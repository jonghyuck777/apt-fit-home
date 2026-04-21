import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lawdCd = searchParams.get("lawdCd") ?? "11200";

  // 자동으로 최신 월 계산 (2개월 전 데이터가 가장 최신)
  const now = new Date();
  now.setMonth(now.getMonth() - 2);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dealYmd = `${year}${month}`;

  const serviceKey = process.env.MOLIT_SERVICE_KEY!;
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const text = await res.text();

    const items: Record<string, string>[] = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g);

    if (itemMatches) {
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
        });
      }
    }

    return NextResponse.json({ items, dealYmd });
  } catch (e) {
    return NextResponse.json({ items: [], error: "API 오류" }, { status: 500 });
  }
}