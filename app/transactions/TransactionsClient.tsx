'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const DISTRICTS = [
  { name: '강남구', code: '11680' },
  { name: '강동구', code: '11740' },
  { name: '강북구', code: '11305' },
  { name: '강서구', code: '11500' },
  { name: '관악구', code: '11620' },
  { name: '광진구', code: '11215' },
  { name: '구로구', code: '11530' },
  { name: '금천구', code: '11545' },
  { name: '노원구', code: '11350' },
  { name: '도봉구', code: '11320' },
  { name: '동대문구', code: '11230' },
  { name: '동작구', code: '11590' },
  { name: '마포구', code: '11440' },
  { name: '서대문구', code: '11410' },
  { name: '서초구', code: '11650' },
  { name: '성동구', code: '11200' },
  { name: '성북구', code: '11290' },
  { name: '송파구', code: '11710' },
  { name: '양천구', code: '11470' },
  { name: '영등포구', code: '11560' },
  { name: '용산구', code: '11170' },
  { name: '은평구', code: '11380' },
  { name: '종로구', code: '11110' },
  { name: '중구', code: '11140' },
  { name: '중랑구', code: '11260' },
];

type RawItem = Record<string, unknown>;

type SortType = 'latest' | 'priceHigh' | 'priceLow';

type TransactionItem = {
  id: string;
  aptName: string;
  dealAmount: string;
  dealAmountNumber: number;
  area: string;
  floor: string;
  dealDate: string;
  buildYear: string;
  districtName: string;
  dongName: string;
  jibun: string;
};

function getDistrictNameByCode(code: string) {
  const found = DISTRICTS.find((item) => item.code === code);
  return found?.name ?? code ?? '-';
}

function getStringValue(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function getArrayFromResponse(json: unknown): RawItem[] {
  if (Array.isArray(json)) {
    return json.filter(
      (item): item is RawItem => typeof item === 'object' && item !== null
    );
  }

  if (!json || typeof json !== 'object') {
    return [];
  }

  const source = json as Record<string, unknown>;
  const candidates = [
    source.items,
    source.data,
    source.results,
    source.apartments,
    source.list,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (item): item is RawItem => typeof item === 'object' && item !== null
      );
    }
  }

  return [];
}

function parseAmountToNumber(value: unknown) {
  const original = getStringValue(value);
  if (!original) return 0;

  const onlyNumber = original.replace(/[^\d]/g, '');
  const num = Number(onlyNumber);

  if (Number.isNaN(num)) return 0;
  return num;
}

function formatAmount(value: unknown) {
  const original = getStringValue(value);
  if (!original) return '-';

  if (original.includes('억') || original.includes('만원')) {
    return original;
  }

  const num = parseAmountToNumber(original);

  if (!num) return original;
  return `${num.toLocaleString('ko-KR')}만원`;
}

function formatArea(value: unknown) {
  const original = getStringValue(value);
  if (!original) return '-';

  const num = Number(original);
  if (Number.isNaN(num)) return original;

  return `${num.toFixed(2)}㎡`;
}

function buildDealDate(item: RawItem) {
  const directDealDate = getStringValue(item.dealDate);
  if (directDealDate) return directDealDate;

  const contractDate = getStringValue(item.contractDate);
  if (contractDate) return contractDate;

  const year = getStringValue(item.dealYear || item.year || item['년']);
  const month = getStringValue(item.dealMonth || item.month || item['월']);
  const day = getStringValue(item.dealDay || item.day || item['일']);

  if (!year && !month && !day) return '-';

  const normalizedMonth = month ? month.padStart(2, '0') : '--';
  const normalizedDay = day ? day.padStart(2, '0') : '--';

  return `${year || '----'}-${normalizedMonth}-${normalizedDay}`;
}

function normalizeItems(json: unknown, districtCode: string): TransactionItem[] {
  const items = getArrayFromResponse(json);

  return items.map((item, index) => {
    const aptName =
      getStringValue(
        item.aptName ||
          item.apartmentName ||
          item.aptNm ||
          item.kaptName ||
          item['아파트']
      ) || '-';

    const rawDealAmount =
      getStringValue(
        item.dealAmount || item.tradeAmount || item.price || item['거래금액']
      ) || '-';

    const rawArea =
      getStringValue(
        item.area || item.excluUseAr || item.exclusiveArea || item['전용면적']
      ) || '-';

    const floor = getStringValue(item.floor || item['층']) || '-';

    const buildYear =
      getStringValue(item.buildYear || item['건축년도'] || item.yearBuilt) || '-';

    const dongName =
      getStringValue(item.dongName || item.umdNm || item['법정동']) || '-';

    const jibun = getStringValue(item.jibun) || '-';

    const dealDate = buildDealDate(item);

    return {
      id: `${aptName}-${rawDealAmount}-${rawArea}-${floor}-${buildYear}-${index}`,
      aptName,
      dealAmount: formatAmount(rawDealAmount),
      dealAmountNumber: parseAmountToNumber(rawDealAmount),
      area: formatArea(rawArea),
      floor,
      buildYear,
      dealDate,
      districtName: getDistrictNameByCode(districtCode),
      dongName,
      jibun,
    };
  });
}

function formatSummaryAmount(value: number) {
  if (!value) return '-';

  if (value >= 10000) {
    const eok = Math.floor(value / 10000);
    const man = value % 10000;

    if (man === 0) {
      return `${eok}억`;
    }

    return `${eok}억 ${man.toLocaleString('ko-KR')}만원`;
  }

  return `${value.toLocaleString('ko-KR')}만원`;
}

function getDateSortValue(dateText: string) {
  return dateText.replace(/[^\d]/g, '');
}

export default function TransactionsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const districtCodeFromUrl =
    searchParams.get('districtCode') ?? searchParams.get('gu') ?? '';

  const monthFromUrl = searchParams.get('month') ?? '';

  const apartmentNameFromUrl =
    searchParams.get('apartmentName') ?? searchParams.get('apt') ?? '';

  const [districtCode, setDistrictCode] = useState(districtCodeFromUrl);
  const [month, setMonth] = useState(monthFromUrl);
  const [apartmentName, setApartmentName] = useState(apartmentNameFromUrl);
  const [sortType, setSortType] = useState<SortType>('latest');

  const [items, setItems] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(
    Boolean(districtCodeFromUrl && monthFromUrl)
  );

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setDistrictCode(districtCodeFromUrl);
    setMonth(monthFromUrl);
    setApartmentName(apartmentNameFromUrl);
  }, [districtCodeFromUrl, monthFromUrl, apartmentNameFromUrl]);

  useEffect(() => {
    if (!districtCodeFromUrl || !monthFromUrl) {
      setItems([]);
      setError('');
      setHasSearched(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchTransactions() {
      try {
        setLoading(true);
        setError('');
        setHasSearched(true);

        const params = new URLSearchParams();
        params.set('districtCode', districtCodeFromUrl);
        params.set('month', monthFromUrl);

        if (apartmentNameFromUrl.trim()) {
          params.set('apartmentName', apartmentNameFromUrl.trim());
        }

        const response = await fetch(`/api/transactions?${params.toString()}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });

        const json: unknown = await response.json();

        if (!response.ok) {
          const errorData =
            json && typeof json === 'object'
              ? (json as { error?: string })
              : undefined;

          throw new Error(errorData?.error || '조회 중 오류가 발생했습니다.');
        }

        const normalized = normalizeItems(json, districtCodeFromUrl);
        setItems(normalized);
      } catch (err) {
        if (controller.signal.aborted) return;

        const message =
          err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.';

        setItems([]);
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTransactions();

    return () => {
      controller.abort();
    };
  }, [districtCodeFromUrl, monthFromUrl, apartmentNameFromUrl]);

  function buildUrl(
    nextDistrictCode: string,
    nextMonth: string,
    nextApartmentName: string
  ) {
    const params = new URLSearchParams();

    if (nextDistrictCode) params.set('districtCode', nextDistrictCode);
    if (nextMonth) params.set('month', nextMonth);
    if (nextApartmentName.trim()) {
      params.set('apartmentName', nextApartmentName.trim());
    }

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  function handleSearch() {
    if (!districtCode) {
      alert('구를 먼저 선택해줘');
      return;
    }

    if (!month) {
      alert('조회월을 먼저 선택해줘');
      return;
    }

    router.push(buildUrl(districtCode, month, apartmentName));
  }

  function handleReset() {
    setDistrictCode('');
    setMonth('');
    setApartmentName('');
    setItems([]);
    setError('');
    setHasSearched(false);
    setSortType('latest');
    router.push(pathname);
  }

  const sortedItems = useMemo(() => {
    const copied = [...items];

    if (sortType === 'priceHigh') {
      return copied.sort((a, b) => b.dealAmountNumber - a.dealAmountNumber);
    }

    if (sortType === 'priceLow') {
      return copied.sort((a, b) => a.dealAmountNumber - b.dealAmountNumber);
    }

    return copied.sort((a, b) =>
      getDateSortValue(b.dealDate).localeCompare(getDateSortValue(a.dealDate))
    );
  }, [items, sortType]);

  const summary = useMemo(() => {
    if (!items.length) {
      return {
        avgAmount: '-',
        maxAmount: '-',
        minAmount: '-',
        latestDate: '-',
      };
    }

    const validAmounts = items
      .map((item) => item.dealAmountNumber)
      .filter((value) => value > 0);

    const totalAmount = validAmounts.reduce((sum, value) => sum + value, 0);
    const avgAmount = validAmounts.length
      ? Math.round(totalAmount / validAmounts.length)
      : 0;
    const maxAmount = validAmounts.length ? Math.max(...validAmounts) : 0;
    const minAmount = validAmounts.length ? Math.min(...validAmounts) : 0;

    const latestItem = [...items].sort((a, b) =>
      getDateSortValue(b.dealDate).localeCompare(getDateSortValue(a.dealDate))
    )[0];

    return {
      avgAmount: formatSummaryAmount(avgAmount),
      maxAmount: formatSummaryAmount(maxAmount),
      minAmount: formatSummaryAmount(minAmount),
      latestDate: latestItem?.dealDate || '-',
    };
  }, [items]);

  const resultText = useMemo(() => {
    if (loading) return '조회 중입니다...';
    if (!hasSearched) return '조건을 선택하고 조회해줘';
    if (error) return '오류가 있어요';
    return `총 ${items.length}건`;
  }, [loading, hasSearched, error, items.length]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">실거래 조회</h1>
          <p className="mt-2 text-sm text-slate-600">
            추천 카드에서 넘어온 값도 자동 반영되고, 직접 검색한 값도 주소창에 저장됩니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="grid gap-4 md:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                서울 구
              </label>
              <select
                value={districtCode}
                onChange={(e) => setDistrictCode(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="">구 선택</option>
                {DISTRICTS.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                조회 월
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                아파트명
              </label>
              <input
                type="text"
                value={apartmentName}
                onChange={(e) => setApartmentName(e.target.value)}
                placeholder="예: 한라비발디, 래미안"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="h-11 flex-1 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                조회하기
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                초기화
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-slate-800">
              현재 조건: {getDistrictNameByCode(districtCodeFromUrl) || '-'} /{' '}
              {monthFromUrl || '-'} / {apartmentNameFromUrl || '전체'}
            </p>
            <p className="text-sm text-slate-600">{resultText}</p>
          </div>
        </div>

        {!loading && !error && items.length > 0 && (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-500">평균 거래가</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {summary.avgAmount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-500">최고 거래가</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {summary.maxAmount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-500">최저 거래가</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {summary.minAmount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-500">최근 거래일</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {summary.latestDate}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-medium text-slate-800">
                  정렬 기준을 바꿔서 거래 흐름을 더 보기 쉽게 볼 수 있습니다.
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">정렬</span>
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value as SortType)}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500"
                  >
                    <option value="latest">최신순</option>
                    <option value="priceHigh">가격 높은순</option>
                    <option value="priceLow">가격 낮은순</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-4 w-60 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-4 w-60 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && hasSearched && items.length === 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            조회 결과가 없습니다.
          </div>
        )}

        {!loading && !error && sortedItems.length > 0 && (
          <div className="mt-6 grid gap-4">
            {sortedItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.aptName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.districtName} / {item.dongName} / {item.jibun}
                    </p>
                  </div>

                  <div className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800">
                    {item.dealAmount}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">전용면적</p>
                    <p className="mt-1 font-semibold">{item.area}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">층</p>
                    <p className="mt-1 font-semibold">{item.floor}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">거래일</p>
                    <p className="mt-1 font-semibold">{item.dealDate}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">건축년도</p>
                    <p className="mt-1 font-semibold">{item.buildYear}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}