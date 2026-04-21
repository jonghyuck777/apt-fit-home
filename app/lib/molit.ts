// 국토부 실거래가 API 연동

const SERVICE_KEY = process.env.MOLIT_SERVICE_KEY!;
const BASE_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev";

export type AptTrade = {
  aptNm: string;       // 아파트명
  umdNm: string;       // 법정동
  excluUseAr: string;  // 전용면적
  dealAmount: string;  // 거래금액
  buildYear: string;   // 건축년도
  dealYear: string;    // 거래년도
  dealMonth: string;   // 거래월
  dealDay: string;     // 거래일
  floor: string;       // 층
  lawdCd?: string;     // 지역코드
};

export async function fetchAptTrades(lawdCd: string, dealYmd: string): Promise<AptTrade[]> {
  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const text = await res.text();

  // XML 파싱
  const items: AptTrade[] = [];
  const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g);

  if (!itemMatches) return [];

  for (const item of itemMatches) {
    const get = (tag: string) => {
      const match = item.match(new RegExp(`<${tag}>([^<]*)<\/${tag}>`));
      return match ? match[1].trim() : "";
    };

    items.push({
      aptNm: get("aptNm"),
      umdNm: get("umdNm"),
      excluUseAr: get("excluUseAr"),
      dealAmount: get("dealAmount"),
      buildYear: get("buildYear"),
      dealYear: get("dealYear"),
      dealMonth: get("dealMonth"),
      dealDay: get("dealDay"),
      floor: get("floor"),
      lawdCd,
    });
  }

  return items;
}

// 금액 파싱 (예: "12,500" → 12500)
export function parseDealAmount(amount: string): number {
  return Number(amount.replace(/,/g, "")) / 10000; // 만원 → 억
}

// 평수 계산 (㎡ → 평)
export function sqmToPyeong(sqm: string): number {
  return Math.round(Number(sqm) / 3.305785);
}
