"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStation, getMidpoint, getNearestStation, estimateCommuteMinutes } from "./lib/subway";

const CONSULTING_FORM_URL = "https://naver.me/I5w4omQm";

export default function HomePage() {
  const router = useRouter();

  const [stationA, setStationA] = useState("강남역");
  const [stationB, setStationB] = useState("도봉역");
  const [budget, setBudget] = useState("10");
  const [cash, setCash] = useState("5");
  const [monthlyRepay, setMonthlyRepay] = useState("100");
  const [household, setHousehold] = useState("family");
  const [pyeong, setPyeong] = useState("30");
  const [buildAge, setBuildAge] = useState("any");
  const [school, setSchool] = useState("yes");
  const [moveIn, setMoveIn] = useState("any");
  const [interior, setInterior] = useState("any");

  const foundA = findStation(stationA);
  const foundB = findStation(stationB);
  const midpoint = foundA && foundB ? getMidpoint(foundA, foundB) : null;
  const nearestStation = midpoint ? getNearestStation(midpoint.lat, midpoint.lng) : null;
  const commuteA = foundA && nearestStation ? estimateCommuteMinutes(nearestStation, foundA) : null;
  const commuteB = foundB && nearestStation ? estimateCommuteMinutes(nearestStation, foundB) : null;
  const totalCommute = commuteA && commuteB ? commuteA + commuteB : null;

  const budgetNum = Number(budget) || 0;
  const cashNum = Number(cash) || 0;
  const loanNeeded = Math.max(0, budgetNum - cashNum);
  const monthlyInterest = Math.round((loanNeeded * 100000000 * 0.035) / 12 / 10000);

  const handleSearch = () => {
    if (!foundA || !foundB) return;
    const params = new URLSearchParams({
      stationA, stationB, budget, cash, monthlyRepay,
      household, pyeong, buildAge, school, moveIn, interior,
      midLat: midpoint?.lat.toString() ?? "",
      midLng: midpoint?.lng.toString() ?? "",
      nearStation: nearestStation?.name ?? "",
    });
    router.push("/results?" + params.toString());
  };

  const inputClass = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400";
  const selectClass = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-bold text-slate-700";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">

      {/* 상단 배너 - 사무실/상가 컨설팅 */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-400">사무실 · 상가 찾고 계세요?</p>
            <p className="text-sm font-bold text-white">전문 공인중개사가 직접 컨설팅해드려요</p>
          </div>
          <button
            onClick={() => window.open(CONSULTING_FORM_URL, "_blank")}
            className="shrink-0 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-900 hover:bg-amber-300 transition"
          >
            무료 상담받기
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">내집찾기</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">부부 직장역 기준 중간지점으로 최적 아파트를 찾아드려요</p>
        </div>

        <div className="space-y-4">

          {/* STEP 1 - 직장역 */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold">1</span>
              <h2 className="text-base font-bold text-slate-900">직장역 입력</h2>
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className={labelClass}>남편 직장역</label>
                <input
                  value={stationA}
                  onChange={(e) => setStationA(e.target.value)}
                  placeholder="예: 강남역"
                  className={inputClass}
                />
                {foundA ? (
                  <p className="mt-1.5 text-xs font-semibold text-emerald-600">✓ {foundA.name}</p>
                ) : stationA ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">역을 찾지 못했어요</p>
                ) : null}
              </div>
              <div>
                <label className={labelClass}>아내 직장역</label>
                <input
                  value={stationB}
                  onChange={(e) => setStationB(e.target.value)}
                  placeholder="예: 도봉역"
                  className={inputClass}
                />
                {foundB ? (
                  <p className="mt-1.5 text-xs font-semibold text-emerald-600">✓ {foundB.name}</p>
                ) : stationB ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">역을 찾지 못했어요</p>
                ) : null}
              </div>
            </div>

            {nearestStation && (
              <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-bold text-blue-700 mb-1">중간지점 계산 결과</p>
                <p className="text-sm font-bold text-blue-900">
                  추천 거주지역: <span className="text-blue-600">{nearestStation.name}</span> 근처
                </p>
                {totalCommute && (
                  <p className="text-sm text-blue-800 mt-1">
                    예상 총 출퇴근 <span className="font-bold">{totalCommute}분/일</span>
                    <span className="text-xs text-blue-600 ml-2">(남편 {commuteA}분 + 아내 {commuteB}분)</span>
                  </p>
                )}
              </div>
            )}
          </section>

          {/* STEP 2 - 예산 */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
              <h2 className="text-base font-bold text-slate-900">예산</h2>
            </div>
            <div className="grid gap-3 grid-cols-3">
              <div>
                <label className={labelClass}>총 예산 (억)</label>
                <input value={budget} onChange={(e) => setBudget(e.target.value)} type="number" step="0.5" placeholder="10" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>현금 보유 (억)</label>
                <input value={cash} onChange={(e) => setCash(e.target.value)} type="number" step="0.5" placeholder="5" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>월 상환 (만원)</label>
                <input value={monthlyRepay} onChange={(e) => setMonthlyRepay(e.target.value)} type="number" step="10" placeholder="100" className={inputClass} />
              </div>
            </div>

            {loanNeeded > 0 && (
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-xs font-bold text-amber-700 mb-2">대출 계산 (금리 3.5% 기준)</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-amber-600 font-medium">필요 대출</p>
                    <p className="text-lg font-extrabold text-amber-900">{loanNeeded.toFixed(1)}억</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-medium">월 예상 이자</p>
                    <p className="text-lg font-extrabold text-amber-900">{monthlyInterest.toLocaleString()}만원</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-medium">상환 여유</p>
                    <p className={"text-lg font-extrabold " + (Number(monthlyRepay) >= monthlyInterest ? "text-emerald-600" : "text-red-500")}>
                      {Number(monthlyRepay) >= monthlyInterest ? "여유" : "빠듯"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 3 - 집 조건 */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold">3</span>
              <h2 className="text-base font-bold text-slate-900">집 조건</h2>
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className={labelClass}>가구 형태</label>
                <select value={household} onChange={(e) => setHousehold(e.target.value)} className={selectClass}>
                  <option value="single">1인 가구</option>
                  <option value="couple">부부 2인</option>
                  <option value="family">자녀 포함 가족</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>선호 평수</label>
                <select value={pyeong} onChange={(e) => setPyeong(e.target.value)} className={selectClass}>
                  <option value="20">20평대</option>
                  <option value="30">30평대</option>
                  <option value="40">40평대</option>
                  <option value="any">상관없음</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>연식 선호</label>
                <select value={buildAge} onChange={(e) => setBuildAge(e.target.value)} className={selectClass}>
                  <option value="new">신축 (5년 이내)</option>
                  <option value="recent">준신축 (10년 이내)</option>
                  <option value="any">상관없음</option>
                  <option value="old">구축 (가성비)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>학군 중요도</label>
                <select value={school} onChange={(e) => setSchool(e.target.value)} className={selectClass}>
                  <option value="yes">중요함</option>
                  <option value="any">보통</option>
                  <option value="no">안 봄</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>입주 시기</label>
                <select value={moveIn} onChange={(e) => setMoveIn(e.target.value)} className={selectClass}>
                  <option value="immediate">즉시 입주</option>
                  <option value="6months">6개월 이내</option>
                  <option value="any">상관없음</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>인테리어 상태</label>
                <select value={interior} onChange={(e) => setInterior(e.target.value)} className={selectClass}>
                  <option value="any">상관없음</option>
                  <option value="fresh">깔끔한 상태</option>
                  <option value="ok">부분 수리 가능</option>
                  <option value="reno">전체 리모델링 가능</option>
                </select>
              </div>
            </div>
          </section>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            disabled={!foundA || !foundB}
            className="w-full rounded-2xl bg-slate-900 py-5 text-base font-extrabold text-white shadow-lg transition hover:bg-slate-700 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
          >
            {!foundA || !foundB ? "역 이름을 확인해주세요" : "아파트 추천 받기"}
          </button>

          {/* 하단 사무실/상가 배너 */}
          <div
            onClick={() => window.open(CONSULTING_FORM_URL, "_blank")}
            className="cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 flex items-center justify-between gap-4 hover:border-slate-400 transition"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">사무실 · 상가</p>
              <p className="text-base font-extrabold text-slate-900">전문가 컨설팅 받아보기</p>
              <p className="text-xs text-slate-500 mt-1">조건을 남기시면 공인중개사가 직접 연락드려요</p>
            </div>
            <div className="shrink-0 text-3xl">🏢</div>
          </div>

        </div>
      </div>
    </main>
  );
}