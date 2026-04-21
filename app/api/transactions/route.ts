import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DISTRICT_CODE_MAP: Record<string, string> = {
  강남구: '11680',
  강동구: '11740',
  강북구: '11305',
  강서구: '11500',
  관악구: '11620',
  광진구: '11215',
  구로구: '11530',
  금천구: '11545',
  노원구: '11350',
  도봉구: '11320',
  동대문구: '11230',
  동작구: '11590',
  마포구: '11440',
  서대문구: '11410',
  서초구: '11650',
  성동구: '11200',
  성북구: '11290',
  송파구: '11710',
  양천구: '11470',
  영등포구: '11560',
  용산구: '11170',
  은평구: '11380',
  종로구: '11110',
  중구: '11140',
  중랑구: '11260',
};

const DISTRICT_NAME_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DISTRICT_CODE_MAP).map(([name, code]) => [code, name])
);

type TransactionItem = {
  aptName: string;
  dealAmount: string;
  area: string;
  floor: string;
  buildYear: string;
  dealDate: string;
  districtName: string;
  districtCode: string;
  dongName: string;
  jibun: string;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function getTagValue(block: string, tag: string) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = block.match(regex);
  return match ? decodeXml(match[1]) : '';
}

function getHeaderBlock(xmlText: string) {
  const match = xmlText.match(/<header>([\s\S]*?)<\/header>/);
  return match ? match[1] : '';
}

function resolveDistrictCode(rawValue: string) {
  if (!rawValue) return '';
  if (/^\d{5}$/.test(rawValue)) return rawValue;
  return DISTRICT_CODE_MAP[rawValue] ?? '';
}

function normalizeMonth(rawMonth: string) {
  if (!rawMonth) return '';
  const cleaned = rawMonth.replace(/[^0-9]/g, '');
  if (/^\d{6}$/.test(cleaned)) return cleaned;
  return '';
}

function formatDealDate(year: string, month: string, day: string) {
  const y = year || '-';
  const m = month ? month.padStart(2, '0') : '-';
  const d = day ? day.padStart(2, '0') : '-';
  return `${y}-${m}-${d}`;
}

function parseItemsFromXml(xmlText: string, districtCode: string): TransactionItem[] {
  const itemMatches = [...xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return itemMatches.map((match) => {
    const block = match[1];

    const aptName = getTagValue(block, 'aptNm');
    const dealAmount = getTagValue(block, 'dealAmount');
    const area = getTagValue(block, 'excluUseAr');
    const floor = getTagValue(block, 'floor');
    const buildYear = getTagValue(block, 'buildYear');
    const dongName = getTagValue(block, 'umdNm');
    const jibun = getTagValue(block, 'jibun');
    const dealYear = getTagValue(block, 'dealYear');
    const dealMonth = getTagValue(block, 'dealMonth');
    const dealDay = getTagValue(block, 'dealDay');

    return {
      aptName,
      dealAmount,
      area,
      floor,
      buildYear,
      dealDate: formatDealDate(dealYear, dealMonth, dealDay),
      districtName: DISTRICT_NAME_MAP[districtCode] ?? districtCode,
      districtCode,
      dongName,
      jibun,
    };
  });
}

function normalizeAmount(value: string) {
  if (!value) return '-';

  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned) return '-';

  const num = Number(cleaned);
  if (Number.isNaN(num)) return value;

  return `${num.toLocaleString('ko-KR')}만원`;
}

function normalizeArea(value: string) {
  if (!value) return '-';

  const num = Number(value);
  if (Number.isNaN(num)) return value;

  return `${num.toFixed(2)}㎡`;
}

function sortByDateDesc(items: TransactionItem[]) {
  return [...items].sort((a, b) => {
    const aDate = a.dealDate.replace(/-/g, '');
    const bDate = b.dealDate.replace(/-/g, '');
    return bDate.localeCompare(aDate);
  });
}

function isSuccessResponse(resultCode: string, resultMsg: string) {
  const normalizedCode = resultCode.trim();
  const normalizedMsg = resultMsg.trim().toUpperCase();

  if (normalizedCode === '00') return true;
  if (normalizedCode === '000') return true;
  if (!normalizedCode && normalizedMsg === 'OK') return true;

  return false;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const rawDistrict =
      searchParams.get('districtCode') ??
      searchParams.get('gu') ??
      '';

    const rawMonth =
      searchParams.get('month') ??
      '';

    const apartmentName =
      (searchParams.get('apartmentName') ??
        searchParams.get('apt') ??
        '').trim();

    const districtCode = resolveDistrictCode(rawDistrict);
    const dealYmd = normalizeMonth(rawMonth);

    if (!districtCode) {
      return NextResponse.json(
        { error: 'districtCode 값이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    if (!dealYmd) {
      return NextResponse.json(
        { error: 'month 값이 올바르지 않습니다. 예: 2026-03' },
        { status: 400 }
      );
    }

    const serviceKey = process.env.MOLIT_SERVICE_KEY;

    if (!serviceKey) {
      return NextResponse.json(
        { error: 'MOLIT_SERVICE_KEY가 없습니다.' },
        { status: 500 }
      );
    }

    const apiUrl = new URL(
      'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev'
    );

    apiUrl.searchParams.set('serviceKey', serviceKey);
    apiUrl.searchParams.set('LAWD_CD', districtCode);
    apiUrl.searchParams.set('DEAL_YMD', dealYmd);
    apiUrl.searchParams.set('pageNo', '1');
    apiUrl.searchParams.set('numOfRows', '1000');

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      cache: 'no-store',
    });

    const xmlText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: '공공데이터 조회에 실패했습니다.',
          detail: xmlText.slice(0, 300),
        },
        { status: 500 }
      );
    }

    const headerBlock = getHeaderBlock(xmlText);
    const resultCode = getTagValue(headerBlock, 'resultCode');
    const resultMsg = getTagValue(headerBlock, 'resultMsg');

    if (resultCode || resultMsg) {
      if (!isSuccessResponse(resultCode, resultMsg)) {
        return NextResponse.json(
          {
            error: `공공데이터 오류: ${resultMsg || resultCode || '알 수 없는 오류'}`,
          },
          { status: 500 }
        );
      }
    }

    let items = parseItemsFromXml(xmlText, districtCode);

    if (apartmentName) {
      const keyword = apartmentName.replace(/\s/g, '').toLowerCase();

      items = items.filter((item) =>
        item.aptName.replace(/\s/g, '').toLowerCase().includes(keyword)
      );
    }

    const normalizedItems = sortByDateDesc(items).map((item) => ({
      aptName: item.aptName || '-',
      dealAmount: normalizeAmount(item.dealAmount),
      area: normalizeArea(item.area),
      floor: item.floor || '-',
      buildYear: item.buildYear || '-',
      dealDate: item.dealDate || '-',
      districtName: item.districtName || '-',
      districtCode: item.districtCode || '-',
      dongName: item.dongName || '-',
      jibun: item.jibun || '-',
    }));

    return NextResponse.json({
      items: normalizedItems,
      count: normalizedItems.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}