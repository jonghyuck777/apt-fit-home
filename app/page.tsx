"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStation, getMidpoint, getNearestStation, estimateCommuteMinutes } from "./lib/subway";

const CONSULTING_FORM_URL = "https://naver.me/I5w4omQm";

export default function HomePage() {
  const router = useRouter();

  const [stationA, setStationA] = useState("");
  const [stationB, setStationB] = useState("");
  const [budget, setBudget] = useState("");
  const [cash, setCash] = useState("");
  const [monthlyRepay, setMonthlyRepay] = useState("");
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

  const inputClass = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300";
  const selectClass = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-bold text-slate-600";

  return (
    <main className="min-h-screen bg-slate-100">

      {/* 상단 배너 */}
      <div
        onClick={() => window.open(CONSULTING_FORM_URL, "_blank")}
        className="cursor-pointer bg-slate-900 px-4 py-3 hover:bg-slate-800 transition"
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏢</span>
            <div>
              <p className="text-xs font-bold text-slate-400">사무실 · 상가 찾으세요?</p>
              <p className="text-sm font-extrabold text-white">전문 공인중개사 무료 컨설팅 받기 →</p>
            </div>
          </div>
          <span className="shrink-0 rounded-lg bg-amber-400 px-4 py-1.5 text-xs font-extrabold text-slate-900">
            무료상담
          </span>
        </div>
      </div>

      {/* 전체 레이아웃 */}
      <div className="mx-auto max-w-5xl px-4 py-8 flex gap-6">

        {/* 왼쪽 사이드바 */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">

          {/* 서비스 소개 */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm font-extrabold text-slate-900 mb-3">🏠 내집찾기란?</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">📍</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">중간지점 자동 계산</p>
                  <p className="text-xs text-slate-500 mt-0.5">부부 직장역 기준으로 최적 위치를 찾아요</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">📊</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">실거래가 기반</p>
                  <p className="text-xs text-slate-500 mt-0.5">국토부 실거래가 데이터로 정확해요</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">⭐</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">AI 점수 추천</p>
                  <p className="text-xs text-slate-500 mt-0.5">예산·출퇴근·학군 등 100점 만점 분석</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">🔨</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">인테리어 비용 안내</p>
                  <p className="text-xs text-slate-500 mt-0.5">연식별 예상 인테리어 비용 제공</p>
                </div>
              </div>
            </div>
          </div>

          {/* 이용 방법 */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm font-extrabold text-slate-900 mb-3">📋 이용 방법</p>
            <div className="space-y-2">
              {["직장역 입력", "예산 입력", "집 조건 선택", "추천 결과 확인"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0">{i + 1}</span>
                  <p className="text-xs font-semibold text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 사무실/상가 배너 */}
          <div
            onClick={() => window.open(CONSULTING_FORM_URL, "_blank")}
            className="cursor-pointer rounded-2xl bg-slate-900 p-5 hover:bg-slate-800 transition"
          >
            <p className="text-xs font-bold text-slate-400 mb-1">사무실 · 상가</p>
            <p className="text-sm font-extrabold text-white mb-2">전문가 컨설팅</p>
            <p className="text-xs text-slate-400 mb-3">공인중개사가 직접 연락드려요</p>
            <span className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-slate-900">무료 상담받기 →</span>
          </div>
        </div>

        {/* 메인 폼 */}
        <div className="flex-1 min-w-0">

          {/* 헤더 */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow">
                <span className="text-xl">🏠</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">내집찾기</h1>
            </div>
            <p className="text-sm font-medium text-slate-500">부부 직장역 기준 중간지점 아파트 추천 서비스</p>
            <div className="mt-2 flex justify-center gap-3 text-xs font-semibold text-slate-400">
              <span>✓ 실거래가 기반</span>
              <span>✓ 출퇴근 분석</span>
              <span>✓ AI 점수 추천</span>
            </div>
          </div>

          <div className="space-y-4">

            {/* STEP 1 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-extrabold">1</span>
                <h2 className="text-base font-extrabold text-slate-900">직장역 입력</h2>
                <span className="ml-auto text-xs font-medium text-slate-400">중간지점 자동 계산</span>
              </div>
              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className={labelClass}>남편 직장역</label>
                  <input value={stationA} onChange={(e) => setStationA(e.target.value)} placeholder="예: 강남역" className={inputClass} />
                  {foundA ? <p className="mt-1.5 text-xs font-bold text-emerald-500">✓ {foundA.name}</p>
                    : stationA ? <p className="mt-1.5 text-xs font-bold text-red-400">역을 찾지 못했어요</p> : null}
                </div>
                <div>
                  <label className={labelClass}>아내 직장역</label>
                  <input value={stationB} onChange={(e) => setStationB(e.target.value)} placeholder="예: 도봉역" className={inputClass} />
                  {foundB ? <p className="mt-1.5 text-xs font-bold text-emerald-500">✓ {foundB.name}</p>
                    : stationB ? <p className="mt-1.5 text-xs font-bold text-red-400">역을 찾지 못했어요</p> : null}
                </div>
              </div>
              {nearestStation && (
                <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs font-extrabold text-blue-700 mb-2">📍 중간지점 계산 완료</p>
                  <p className="text-sm font-extrabold text-slate-900">추천 지역: <span className="text-blue-600">{nearestStation.name}</span> 근처</p>
                  {totalCommute && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">남편 {commuteA}분</span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">아내 {commuteB}분</span>
                      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">합산 {totalCommute}분/일</span>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* STEP 2 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-extrabold">2</span>
                <h2 className="text-base font-extrabold text-slate-900">예산</h2>
                <span className="ml-auto text-xs font-medium text-slate-400">대출 이자 자동 계산</span>
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
                  <p className="text-xs font-extrabold text-amber-700 mb-3">💰 대출 계산 (금리 3.5% 기준)</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-white p-2.5 border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold">필요 대출</p>
                      <p className="text-lg font-extrabold text-amber-900">{loanNeeded.toFixed(1)}억</p>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold">월 이자</p>
                      <p className="text-lg font-extrabold text-amber-900">{monthlyInterest}만원</p>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-amber-100">
                      <p className="text-xs text-amber-600 font-semibold">여유</p>
                      <p className={"text-lg font-extrabold " + (Number(monthlyRepay) >= monthlyInterest ? "text-emerald-500" : "text-red-500")}>
                        {Number(monthlyRepay) >= monthlyInterest ? "여유" : "빠듯"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* STEP 3 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-extrabold">3</span>
                <h2 className="text-base font-extrabold text-slate-900">집 조건</h2>
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
              className="w-full rounded-2xl bg-slate-900 py-5 text-base font-extrabold text-white shadow-lg transition hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {!foundA || !foundB ? "직장역을 입력해주세요" : "🔍 아파트 추천 받기"}
            </button>

            {/* 하단 사무실/상가 배너 (모바일용) */}
            <div
              onClick={() => window.open(CONSULTING_FORM_URL, "_blank")}
              className="lg:hidden cursor-pointer rounded-2xl bg-slate-900 p-5 flex items-center justify-between gap-4 hover:bg-slate-800 transition"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">사무실 · 상가</p>
                <p className="text-base font-extrabold text-white">전문가 컨설팅 받아보기</p>
                <p className="text-xs text-slate-400 mt-1">조건을 남기시면 공인중개사가 직접 연락드려요</p>
              </div>
              <div className="shrink-0 text-3xl">🏢</div>
            </div>

          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">

          {/* 자주 묻는 질문 */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm font-extrabold text-slate-900 mb-3">❓ 자주 묻는 질문</p>
            <div className="space-y-3">
              {[
                { q: "데이터는 얼마나 최신인가요?", a: "국토부 실거래가 기준 2개월 전 데이터예요." },
                { q: "출퇴근 시간은 어떻게 계산되나요?", a: "직선거리 기반 예상 시간이에요. 실제와 다를 수 있어요." },
                { q: "어느 지역까지 검색되나요?", a: "서울 전 지역, 경기 주요 지역, 인천까지 가능해요." },
                { q: "무료로 이용 가능한가요?", a: "네! 완전 무료예요." },
              ].map((item, i) => (
                <div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-xs font-bold text-slate-800 mb-1">{item.q}</p>
                  <p className="text-xs text-slate-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 점수 안내 */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm font-extrabold text-slate-900 mb-3">⭐ 추천 점수 기준</p>
            <div className="space-y-2">
              {[
                { label: "예산 적합도", score: "35점" },
                { label: "출퇴근 거리", score: "30점" },
                { label: "면적 적합도", score: "20점" },
                { label: "연식", score: "10점" },
                { label: "학군", score: "5점" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">{item.score}</span>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-extrabold text-slate-900">합계</p>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">100점</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}