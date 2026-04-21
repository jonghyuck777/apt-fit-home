"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStation, getMidpoint, getNearestStation, estimateCommuteMinutes } from "./lib/subway";

export default function HomePage() {
  const router = useRouter();

  // 직장역
  const [stationA, setStationA] = useState("강남역");
  const [stationB, setStationB] = useState("도봉역");

  // 예산
  const [budget, setBudget] = useState("10");
  const [cash, setCash] = useState("5");
  const [monthlyRepay, setMonthlyRepay] = useState("100");

  // 집 조건
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

  // 대출 계산
  const budgetNum = Number(budget) || 0;
  const cashNum = Number(cash) || 0;
  const loanNeeded = Math.max(0, budgetNum - cashNum);
  const monthlyInterest = Math.round((loanNeeded * 100000000 * 0.035) / 12 / 10000); // 금리 3.5% 기준 월 이자 (만원)

  const handleSearch = () => {
    if (!foundA || !foundB) return;
    const params = new URLSearchParams({
      stationA, stationB, budget, cash, monthlyRepay,
      household, pyeong, buildAge, school, moveIn, interior,
      midLat: midpoint?.lat.toString() ?? "",
      midLng: midpoint?.lng.toString() ?? "",
      nearStation: nearestStation?.name ?? "",
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">

        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">🏠 아파트 추천</h1>
          <p className="mt-3 text-slate-500">
            부부 직장역 기준 중간지점으로 최적 아파트를 찾아드려요
          </p>
        </div>

        <div className="space-y-5">

          {/* STEP 1 - 직장역 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">📍 STEP 1 · 직장역</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">남편 직장역</label>
                <input
                  value={stationA}
                  onChange={(e) => setStationA(e.target.value)}
                  placeholder="예: 강남역"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
                {foundA ? (
                  <p className="mt-1 text-xs text-emerald-600">✓ {foundA.name} ({foundA.lines.join(", ")})</p>
                ) : stationA ? (
                  <p className="mt-1 text-xs text-red-500">역을 찾지 못했어요</p>
                ) : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">아내 직장역</label>
                <input
                  value={stationB}
                  onChange={(e) => setStationB(e.target.value)}
                  placeholder="예: 도봉역"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
                {foundB ? (
                  <p className="mt-1 text-xs text-emerald-600">✓ {foundB.name} ({foundB.lines.join(", ")})</p>
                ) : stationB ? (
                  <p className="mt-1 text-xs text-red-500">역을 찾지 못했어요</p>
                ) : null}
              </div>
            </div>

            {nearestStation && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">📊 중간지점 계산 결과</p>
                <p className="mt-2 text-sm text-blue-800">
                  추천 거주지역 근처 역: <span className="font-bold">{nearestStation.name}</span>
                </p>
                {totalCommute && (
                  <p className="mt-1 text-sm text-blue-800">
                    예상 총 출퇴근: <span className="font-bold">하루 {totalCommute}분</span>
                    <span className="ml-2 text-xs text-blue-600">(남편 {commuteA}분 + 아내 {commuteB}분)</span>
                  </p>
                )}
              </div>
            )}
          </section>

          {/* STEP 2 - 예산 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">💰 STEP 2 · 예산</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">총 예산 (억)</label>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  type="number" step="0.5"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">현금 보유 (억)</label>
                <input
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  type="number" step="0.5"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">월 상환 가능 (만원)</label>
                <input
                  value={monthlyRepay}
                  onChange={(e) => setMonthlyRepay(e.target.value)}
                  type="number" step="10"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {loanNeeded > 0 && (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">📋 대출 계산 (금리 3.5% 기준)</p>
                <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-amber-700">필요 대출</p>
                    <p className="mt-1 text-lg font-bold text-amber-900">{loanNeeded.toFixed(1)}억</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700">월 예상 이자</p>
                    <p className="mt-1 text-lg font-bold text-amber-900">{monthlyInterest.toLocaleString()}만원</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700">상환 여유</p>
                    <p className={`mt-1 text-lg font-bold ${Number(monthlyRepay) >= monthlyInterest ? "text-emerald-600" : "text-red-500"}`}>
                      {Number(monthlyRepay) >= monthlyInterest ? "✓ 가능" : "⚠ 빠듯함"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 3 - 집 조건 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">🏡 STEP 3 · 집 조건</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">가구 형태</label>
                <select value={household} onChange={(e) => setHousehold(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500">
                  <option value="single">1인 가구</option>
                  <option value="couple">부부 2인</option>
                  <option value="family">자녀 포함 가족</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">선호 평수</label>
                <select value={pyeong} onChange={(e) => setPyeong(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500">
                  <option value="20">20평대</option>
                  <option value="30">30평대</option>
                  <option value="40">40평대</option>
                  <option value="any">상관없음</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">연식 선호</label>
                <select value={buildAge} onChange={(e) => setBuildAge(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500">
                  <option value="new">신축 (5년 이내)</option>
                  <option value="recent">준신축 (10년 이내)</option>
                  <option value="any">상관없음</option>
                  <option value="old">구축 선호 (가성비)</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">학군 중요도</label>
                <select value={school} onChange={(e) => setSchool(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500">
                  <option value="yes">중요함</option>
                  <option value="any">보통</option>
                  <option value="no">안 봄</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">입주 시기</label>
                <select value={moveIn} onChange={(e) => setMoveIn(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500">
                  <option value="immediate">즉시 입주</option>
                  <option value="6months">6개월 이내</option>
                  <option value="any">상관없음</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">인테리어 상태</label>
                <select value={interior} onChange={(e) => setInterior(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500">
                  <option value="any">상관없음</option>
                  <option value="fresh">깔끔한 상태 선호</option>
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
            className="w-full rounded-2xl bg-slate-900 py-5 text-base font-bold text-white transition hover:bg-slate-700 disabled:bg-slate-300"
          >
            {!foundA || !foundB ? "역 이름을 확인해주세요" : "🔍 아파트 추천 받기"}
          </button>

        </div>
      </div>
    </main>
  );
}