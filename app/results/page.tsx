"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type AptResult = {
  aptNm: string;
  umdNm: string;
  pyeong: number;
  priceEok: number;
  buildYear: string;
  dealDate: string;
  floor: string;
  score: number;
  scoreBudget: number;
  scoreCommute: number;
  scorePyeong: number;
  scoreAge: number;
  scoreSchool: number;
  district: string;
  commuteA: number;
  commuteB: number;
  interiorCost: string;
  interiorDesc: string;
  reasonText: string;
  badges: string[];
};

const LAWD_CODES: Record<string, { code: string; lat: number; lng: number }> = {
  "강남구": { code: "11680", lat: 37.5172, lng: 127.0473 },
  "서초구": { code: "11650", lat: 37.4837, lng: 127.0324 },
  "송파구": { code: "11710", lat: 37.5145, lng: 127.1059 },
  "마포구": { code: "11440", lat: 37.5638, lng: 126.9084 },
  "용산구": { code: "11170", lat: 37.5324, lng: 126.9904 },
  "성동구": { code: "11200", lat: 37.5633, lng: 127.0371 },
  "광진구": { code: "11215", lat: 37.5384, lng: 127.0822 },
  "동대문구": { code: "11230", lat: 37.5744, lng: 127.0396 },
  "중랑구": { code: "11260", lat: 37.6063, lng: 127.0927 },
  "성북구": { code: "11290", lat: 37.5894, lng: 127.0167 },
  "강북구": { code: "11305", lat: 37.6397, lng: 127.0257 },
  "도봉구": { code: "11320", lat: 37.6688, lng: 127.0471 },
  "노원구": { code: "11350", lat: 37.6543, lng: 127.0568 },
  "은평구": { code: "11380", lat: 37.6026, lng: 126.9291 },
  "서대문구": { code: "11410", lat: 37.5791, lng: 126.9368 },
  "강서구": { code: "11500", lat: 37.5509, lng: 126.8496 },
  "양천구": { code: "11470", lat: 37.5171, lng: 126.8664 },
  "구로구": { code: "11530", lat: 37.4954, lng: 126.8874 },
  "금천구": { code: "11545", lat: 37.4601, lng: 126.9001 },
  "영등포구": { code: "11560", lat: 37.5264, lng: 126.8963 },
  "동작구": { code: "11590", lat: 37.5124, lng: 126.9393 },
  "관악구": { code: "11620", lat: 37.4784, lng: 126.9516 },
  "강동구": { code: "11740", lat: 37.5301, lng: 127.1238 },
  "수원시": { code: "41111", lat: 37.2636, lng: 127.0286 },
  "성남시분당구": { code: "41135", lat: 37.3595, lng: 127.1174 },
  "성남시수정구": { code: "41131", lat: 37.4386, lng: 127.1378 },
  "고양시일산동구": { code: "41285", lat: 37.6584, lng: 126.7791 },
  "고양시일산서구": { code: "41287", lat: 37.6748, lng: 126.7476 },
  "고양시덕양구": { code: "41281", lat: 37.6344, lng: 126.8319 },
  "용인시수지구": { code: "41465", lat: 37.3219, lng: 127.0967 },
  "용인시기흥구": { code: "41463", lat: 37.2751, lng: 127.1151 },
  "부천시": { code: "41190", lat: 37.5036, lng: 126.7660 },
  "안양시동안구": { code: "41173", lat: 37.3943, lng: 126.9531 },
  "안양시만안구": { code: "41171", lat: 37.4012, lng: 126.9186 },
  "광명시": { code: "41210", lat: 37.4784, lng: 126.8644 },
  "하남시": { code: "41450", lat: 37.5397, lng: 127.2148 },
  "구리시": { code: "41310", lat: 37.5943, lng: 127.1296 },
  "남양주시": { code: "41360", lat: 37.6360, lng: 127.2165 },
  "의정부시": { code: "41150", lat: 37.7381, lng: 127.0337 },
  "파주시": { code: "41480", lat: 37.7601, lng: 126.7800 },
  "김포시": { code: "41570", lat: 37.6152, lng: 126.7156 },
  "화성시": { code: "41590", lat: 37.1994, lng: 126.8316 },
  "평택시": { code: "41220", lat: 36.9921, lng: 127.1129 },
  "인천연수구": { code: "28185", lat: 37.4104, lng: 126.6780 },
  "인천남동구": { code: "28200", lat: 37.4470, lng: 126.7314 },
  "인천부평구": { code: "28237", lat: 37.5069, lng: 126.7219 },
  "인천서구": { code: "28260", lat: 37.5454, lng: 126.6761 },
  "인천미추홀구": { code: "28177", lat: 37.4638, lng: 126.6502 },
};

const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "강남역": { lat: 37.4979, lng: 127.0276 },
  "도봉역": { lat: 37.6797, lng: 127.0455 },
  "청량리역": { lat: 37.5797, lng: 127.0474 },
  "역삼역": { lat: 37.5006, lng: 127.0365 },
  "선릉역": { lat: 37.5045, lng: 127.049 },
  "삼성역": { lat: 37.5088, lng: 127.0631 },
  "잠실역": { lat: 37.5133, lng: 127.1001 },
  "건대입구역": { lat: 37.5404, lng: 127.0692 },
  "홍대입구역": { lat: 37.5572, lng: 126.9245 },
  "합정역": { lat: 37.5496, lng: 126.9142 },
  "서울역": { lat: 37.5547, lng: 126.9706 },
  "종로3가역": { lat: 37.5713, lng: 126.9916 },
  "왕십리역": { lat: 37.5612, lng: 127.0371 },
  "노원역": { lat: 37.6546, lng: 127.0606 },
  "창동역": { lat: 37.6531, lng: 127.0479 },
  "사당역": { lat: 37.4765, lng: 126.9816 },
  "신도림역": { lat: 37.5087, lng: 126.8913 },
  "여의도역": { lat: 37.5217, lng: 126.9244 },
  "판교역": { lat: 37.3949, lng: 127.1111 },
  "수원역": { lat: 37.2662, lng: 127.0003 },
  "도봉산역": { lat: 37.689, lng: 127.0469 },
  "의정부역": { lat: 37.7381, lng: 127.0337 },
  "인천역": { lat: 37.4738, lng: 126.6163 },
  "부천역": { lat: 37.5036, lng: 126.7836 },
  "안양역": { lat: 37.3948, lng: 126.9564 },
  "분당구청역": { lat: 37.3794, lng: 127.1317 },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateCommute(districtLat: number, districtLng: number, stationName: string): number {
  const station = STATION_COORDS[stationName];
  if (!station) return 40;
  const km = haversineKm(districtLat, districtLng, station.lat, station.lng);
  return Math.round(Math.min(Math.max(km * 3.5 + 15, 15), 90));
}

function getInteriorInfo(buildYear: string, currentYear: number) {
  const age = currentYear - Number(buildYear);
  if (age <= 5) return { cost: "500~1,000만원", desc: "거의 새집 수준이에요." };
  if (age <= 10) return { cost: "1,000~2,000만원", desc: "도배 장판 정도만 해도 쾌적해요." };
  if (age <= 15) return { cost: "1,500~3,000만원", desc: "도배 장판 주방 부분 수리 추천해요." };
  if (age <= 20) return { cost: "2,500~4,500만원", desc: "주요 공간 리모델링이 필요해요." };
  return { cost: "4,000~7,000만원", desc: "전체 리모델링을 고려해야 해요." };
}

function getReasonText(priceEok: number, budget: number, commuteA: number, commuteB: number, stationA: string, stationB: string, pyeong: number, buildYear: string, currentYear: number): string {
  const age = currentYear - Number(buildYear);
  const totalCommute = commuteA + commuteB;
  const underBudget = priceEok <= budget;
  if (underBudget && totalCommute <= 60) return "예산 내 가격에 " + stationA + "까지 약 " + commuteA + "분, " + stationB + "까지 약 " + commuteB + "분으로 출퇴근이 편해요.";
  if (underBudget && age <= 10) return "예산 내 가격에 준신축 수준이라 인테리어 부담이 적어요.";
  if (underBudget) return "예산 대비 가격이 적당해요. 대출 부담 없이 접근 가능한 매물이에요.";
  if (totalCommute <= 50) return stationA + "까지 " + commuteA + "분, " + stationB + "까지 " + commuteB + "분으로 두 분 모두 출퇴근이 짧아요.";
  if (age <= 5) return "신축 수준이라 인테리어 비용이 거의 없어요.";
  if (pyeong >= 33) return pyeong + "평 넓은 공간으로 가족 생활에 여유로워요.";
  return "중간지점 기준 출퇴근 합산 " + totalCommute + "분으로 균형 잡힌 매물이에요.";
}

function getBadges(priceEok: number, budget: number, commuteA: number, commuteB: number, age: number, pyeong: number, school: string, district: string): string[] {
  const badges: string[] = [];
  if (priceEok <= budget * 0.9) badges.push("예산 여유");
  else if (priceEok <= budget) badges.push("예산 내");
  if (commuteA <= 30) badges.push("남편 가까움");
  if (commuteB <= 30) badges.push("아내 가까움");
  if (commuteA + commuteB <= 60) badges.push("출퇴근 최적");
  if (age <= 5) badges.push("신축");
  else if (age <= 10) badges.push("준신축");
  if (pyeong >= 33) badges.push("넓은 평수");
  const schoolDistricts = ["강남구", "서초구", "송파구", "양천구", "노원구"];
  if (school === "yes" && schoolDistricts.includes(district)) badges.push("학군 우수");
  return badges;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "border-emerald-200 bg-emerald-50";
  if (score >= 60) return "border-amber-200 bg-amber-50";
  return "border-slate-200 bg-white";
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className={"h-2 rounded-full transition-all " + color} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

const LIKED_KEY = "apt-liked";

function getLikedIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function toggleLiked(id: string): string[] {
  const current = getLikedIds();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  localStorage.setItem(LIKED_KEY, JSON.stringify(next));
  return next;
}

function ResultsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const stationA = searchParams.get("stationA") ?? "";
  const stationB = searchParams.get("stationB") ?? "";
  const budget = Number(searchParams.get("budget") ?? "10");
  const cash = Number(searchParams.get("cash") ?? "5");
  const pyeongPref = searchParams.get("pyeong") ?? "30";
  const buildAge = searchParams.get("buildAge") ?? "any";
  const school = searchParams.get("school") ?? "yes";
  const nearStation = searchParams.get("nearStation") ?? "";
  const midLat = Number(searchParams.get("midLat") ?? "0");
  const midLng = Number(searchParams.get("midLng") ?? "0");

  const currentYear = new Date().getFullYear();
  const loanNeeded = Math.max(0, budget - cash);
  const monthlyInterest = Math.round((loanNeeded * 100000000 * 0.035) / 12 / 10000);

  const sortedDistricts = Object.entries(LAWD_CODES)
    .map(([name, info]) => ({ name, ...info, dist: midLat && midLng ? haversineKm(midLat, midLng, info.lat, info.lng) : 999 }))
    .sort((a, b) => a.dist - b.dist)
    .map((d) => d.name);

  const [results, setResults] = useState<AptResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(sortedDistricts[0]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [dealYmd, setDealYmd] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  useEffect(() => {
    setLikedIds(getLikedIds());
  }, []);

  function getLikeId(item: AptResult) {
    return item.aptNm + "-" + item.district + "-" + item.pyeong;
  }

  function handleLike(item: AptResult) {
    const id = getLikeId(item);
    const next = toggleLiked(id);
    setLikedIds(next);
  }

  function calcScore(priceEok: number, pyeong: number, buildYear: string, district: string, commuteA: number, commuteB: number) {
    if (pyeongPref !== "any") {
      const prefNum = Number(pyeongPref);
      if (Math.abs(pyeong - prefNum) > 20) return null;
    }
    let scoreBudget = 0;
    if (priceEok <= budget * 0.9) scoreBudget = 35;
    else if (priceEok <= budget) scoreBudget = 28;
    else if (priceEok <= budget * 1.1) scoreBudget = 18;
    else scoreBudget = 5;

    let scoreCommute = 0;
    const totalCommute = commuteA + commuteB;
    if (totalCommute <= 50) scoreCommute = 30;
    else if (totalCommute <= 70) scoreCommute = 22;
    else if (totalCommute <= 90) scoreCommute = 14;
    else scoreCommute = 5;

    let scorePyeong = 0;
    if (pyeongPref === "any") {
      scorePyeong = 15;
    } else {
      const prefNum = Number(pyeongPref);
      if (pyeong >= prefNum && pyeong < prefNum + 10) scorePyeong = 20;
      else if (Math.abs(pyeong - prefNum) <= 10) scorePyeong = 12;
      else scorePyeong = 4;
    }

    let scoreAge = 0;
    const age = currentYear - Number(buildYear);
    if (buildAge === "new") scoreAge = age <= 5 ? 10 : age <= 10 ? 6 : 2;
    else if (buildAge === "recent") scoreAge = age <= 10 ? 10 : age <= 15 ? 6 : 3;
    else if (buildAge === "old") scoreAge = age >= 20 ? 10 : age >= 15 ? 6 : 3;
    else scoreAge = 7;

    let scoreSchool = 0;
    const schoolDistricts = ["강남구", "서초구", "송파구", "양천구", "노원구"];
    if (school === "yes" && schoolDistricts.includes(district)) scoreSchool = 5;
    else if (school === "yes") scoreSchool = 2;
    else scoreSchool = 4;

    const total = Math.min(100, scoreBudget + scoreCommute + scorePyeong + scoreAge + scoreSchool);
    return { total, scoreBudget, scoreCommute, scorePyeong, scoreAge, scoreSchool };
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const districtInfo = LAWD_CODES[selectedDistrict];
        const lawdCd = districtInfo?.code ?? "11200";
        const res = await fetch("/api/trades?lawdCd=" + lawdCd);
        const data = await res.json();
        if (data.dealYmd) setDealYmd(data.dealYmd);
        if (!data.items || data.items.length === 0) {
          setResults([]);
          return;
        }

        const commuteAMin = estimateCommute(districtInfo.lat, districtInfo.lng, stationA);
        const commuteBMin = estimateCommute(districtInfo.lat, districtInfo.lng, stationB);

        const mapped: AptResult[] = data.items
          .filter((t: any) => t.dealAmount && t.excluUseAr)
          .map((t: any) => {
            const pyeong = Math.round(Number(t.excluUseAr) / 3.305785);
            const priceEok = Number(t.dealAmount.replace(/,/g, "")) / 10000;
            const age = currentYear - Number(t.buildYear);
            const interior = getInteriorInfo(t.buildYear, currentYear);
            const scoreResult = calcScore(priceEok, pyeong, t.buildYear, selectedDistrict, commuteAMin, commuteBMin);
            if (!scoreResult) return null;
            const badges = getBadges(priceEok, budget, commuteAMin, commuteBMin, age, pyeong, school, selectedDistrict);
            const reasonText = getReasonText(priceEok, budget, commuteAMin, commuteBMin, stationA, stationB, pyeong, t.buildYear, currentYear);
            return {
              aptNm: t.aptNm, umdNm: t.umdNm, pyeong, priceEok,
              buildYear: t.buildYear,
              dealDate: t.dealYear + "년 " + t.dealMonth + "월 " + t.dealDay + "일",
              floor: t.floor, district: selectedDistrict,
              commuteA: commuteAMin, commuteB: commuteBMin,
              interiorCost: interior.cost, interiorDesc: interior.desc,
              reasonText, badges,
              score: scoreResult.total,
              scoreBudget: scoreResult.scoreBudget,
              scoreCommute: scoreResult.scoreCommute,
              scorePyeong: scoreResult.scorePyeong,
              scoreAge: scoreResult.scoreAge,
              scoreSchool: scoreResult.scoreSchool,
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => b.score - a.score);

        const seen = new Set<string>();
        const unique = mapped.filter((item: any) => {
          const key = item.aptNm + "-" + item.pyeong;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setResults(unique.slice(0, 20));
        setExpandedIndex(null);
      } catch (e) {
        setError("데이터를 불러오는 중 오류가 발생했어요.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedDistrict]);

  function openNaver(aptNm: string, district: string) {
    const query = encodeURIComponent(aptNm + " " + district + " 아파트");
    window.open("https://search.naver.com/search.naver?query=" + query, "_blank");
  }

  function openAuction(aptNm: string, district: string) {
    const query = encodeURIComponent(aptNm + " " + district + " 경매");
    window.open("https://search.naver.com/search.naver?query=" + query, "_blank");
  }

  const displayResults = showLikedOnly
    ? results.filter((item) => likedIds.includes(item.aptNm + "-" + item.district + "-" + item.pyeong))
    : results;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-2xl px-4 py-6">

        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold"
          >
            뒤로
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">추천 결과</h1>
            <p className="text-xs font-medium text-slate-500">
              {stationA} ↔ {stationB} · 중간: {nearStation}
              {dealYmd && (
                <span className="ml-1 text-slate-400">
                  ({dealYmd.slice(0, 4)}년 {dealYmd.slice(4)}월 기준)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-bold">예산 {budget}억</span>
          <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-bold">현금 {cash}억</span>
          {loanNeeded > 0 && (
            <span className="rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-bold">
              대출 {loanNeeded.toFixed(1)}억 월 {monthlyInterest}만원
            </span>
          )}
          <span className="rounded-full bg-slate-700 text-white px-3 py-1 text-xs font-bold">
            {pyeongPref === "any" ? "평수 무관" : pyeongPref + "평대"}
          </span>
          <span className="rounded-full bg-slate-700 text-white px-3 py-1 text-xs font-bold">
            {buildAge === "new" ? "신축" : buildAge === "recent" ? "준신축" : buildAge === "old" ? "구축" : "연식 무관"}
          </span>
        </div>

        <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <p className="mb-1 text-sm font-bold text-slate-900">지역 선택</p>
          <p className="mb-3 text-xs font-medium text-slate-500">중간지점({nearStation})에서 가까운 순서</p>
          <div className="flex flex-wrap gap-2">
            {sortedDistricts.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={"rounded-full px-3 py-1.5 text-xs font-bold transition " + (selectedDistrict === district ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}
              >
                {district}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">실거래가 데이터 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 font-medium">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">{selectedDistrict} · 총 {results.length}개</p>
              <button
                onClick={() => setShowLikedOnly(!showLikedOnly)}
                className={"rounded-full px-3 py-1.5 text-xs font-bold transition " + (showLikedOnly ? "bg-red-500 text-white" : "bg-white border border-slate-200 text-slate-700")}
              >
                {showLikedOnly ? "전체 보기" : "저장 목록 " + likedIds.length + "개"}
              </button>
            </div>

            {displayResults.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-slate-100 p-8">
                <p className="text-slate-700 font-bold mb-1">
                  {showLikedOnly ? "저장한 아파트가 없어요" : "조건에 맞는 매물이 없어요"}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {showLikedOnly ? "하트 버튼을 눌러 저장해보세요" : "다른 지역을 선택하거나 평수 조건을 변경해보세요."}
                </p>
              </div>
            ) : (
              displayResults.map((item, index) => (
                <article key={index} className={"rounded-2xl border-2 overflow-hidden " + getScoreBg(item.score)}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">{"#" + (index + 1)}</span>
                          <h3 className="text-base font-extrabold text-slate-900">{item.aptNm}</h3>
                          <button
                            onClick={() => handleLike(item)}
                            className="ml-1 text-lg leading-none"
                          >
                            {likedIds.includes(item.aptNm + "-" + item.district + "-" + item.pyeong) ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          {selectedDistrict} {item.umdNm} · {item.floor}층
                        </p>
                        {item.badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.badges.map((badge, i) => (
                              <span key={i} className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-center bg-white rounded-xl p-3 shadow-sm min-w-[60px]">
                        <p className="text-xs font-bold text-slate-500">점수</p>
                        <p className={"text-2xl font-extrabold " + getScoreColor(item.score)}>{item.score}</p>
                        <p className="text-xs text-slate-400">/100</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-sm font-bold text-slate-900">{item.priceEok.toFixed(1)}억</span>
                      <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-sm font-bold text-slate-900">{item.pyeong}평</span>
                      <span className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-sm font-bold text-slate-900">{item.buildYear}년식</span>
                    </div>

                    <div className="mt-2 rounded-xl bg-blue-600 px-3 py-2">
                      <p className="text-xs font-bold text-white">
                        최근 거래: {item.dealDate} · {item.priceEok.toFixed(1)}억 ({item.floor}층)
                      </p>
                    </div>

                    <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                      <p className="text-xs font-medium text-amber-800">{item.reasonText}</p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white border border-slate-200 p-3">
                        <p className="text-xs font-bold text-slate-500 mb-1">출퇴근 예상</p>
                        <p className="text-sm font-bold text-slate-900">남편 약 {item.commuteA}분</p>
                        <p className="text-sm font-bold text-slate-900">아내 약 {item.commuteB}분</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">합산 {item.commuteA + item.commuteB}분/일</p>
                      </div>
                      <div className="rounded-xl bg-white border border-slate-200 p-3">
                        <p className="text-xs font-bold text-slate-500 mb-1">예상 인테리어</p>
                        <p className="text-sm font-bold text-slate-900">{item.interiorCost}</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">{item.interiorDesc}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="rounded-xl border-2 border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        {expandedIndex === index ? "간단히" : "점수상세"}
                      </button>
                      <button
                        onClick={() => openNaver(item.aptNm, selectedDistrict)}
                        className="rounded-xl bg-green-500 py-2.5 text-xs font-bold text-white hover:bg-green-600 transition"
                      >
                        네이버
                      </button>
                      <button
                        onClick={() => openAuction(item.aptNm, selectedDistrict)}
                        className="rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition"
                      >
                        경매조회
                      </button>
                    </div>

                    {expandedIndex === index && (
                      <div className="mt-3 rounded-xl bg-white border border-slate-200 p-4">
                        <p className="text-sm font-bold text-slate-900 mb-3">점수 상세 분석</p>
                        <div className="space-y-3">
                          <ScoreBar label="예산 적합도 (최대 35점)" score={item.scoreBudget} max={35} />
                          <ScoreBar label="출퇴근 거리 (최대 30점)" score={item.scoreCommute} max={30} />
                          <ScoreBar label="면적 적합도 (최대 20점)" score={item.scorePyeong} max={20} />
                          <ScoreBar label="연식 적합도 (최대 10점)" score={item.scoreAge} max={10} />
                          <ScoreBar label="학군 (최대 5점)" score={item.scoreSchool} max={5} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-slate-50 p-3 text-center">
                            <p className="text-xs font-medium text-slate-500">예산</p>
                            <p className="mt-1 text-sm font-bold text-slate-900">{item.priceEok <= budget ? "예산 내" : "초과"}</p>
                            <p className="text-xs text-slate-400">{item.priceEok.toFixed(1)}억 / {budget}억</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 text-center">
                            <p className="text-xs font-medium text-slate-500">연식</p>
                            <p className="mt-1 text-sm font-bold text-slate-900">{currentYear - Number(item.buildYear)}년차</p>
                            <p className="text-xs text-slate-400">{item.buildYear}년 준공</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 text-center">
                            <p className="text-xs font-medium text-slate-500">면적</p>
                            <p className="mt-1 text-sm font-bold text-slate-900">{item.pyeong}평</p>
                            <p className="text-xs text-slate-400">선호 {pyeongPref === "any" ? "무관" : pyeongPref + "평대"}</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 text-center">
                            <p className="text-xs font-medium text-slate-500">대출</p>
                            <p className="mt-1 text-sm font-bold text-slate-900">{loanNeeded > 0 ? loanNeeded.toFixed(1) + "억" : "없음"}</p>
                            <p className="text-xs text-slate-400">{loanNeeded > 0 ? "월 " + monthlyInterest + "만원" : "현금 가능"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">로딩 중...</p>
          </div>
        </div>
      }
    >
      <ResultsPageInner />
    </Suspense>
  );
}