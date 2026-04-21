"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type AgePreference,
  type CommutePreference,
  type HouseholdPreference,
  type OccupancyPreference,
  type SchoolPreference,
  findStationByQuery,
  getCommutePreferenceLabel,
  getOccupancyLabel,
  getRecommendations,
} from "../lib/recommendationData";

function getHouseholdLabel(value: HouseholdPreference) {
  if (value === "single") return "1인 가구";
  if (value === "couple") return "2인 가구";
  return "자녀 포함 가족";
}

function getSchoolLabel(value: SchoolPreference) {
  if (value === "yes") return "중요함";
  if (value === "no") return "거의 안 봄";
  return "상관없음";
}

function getAgeLabel(value: AgePreference) {
  if (value === "new") return "신축 선호";
  if (value === "value") return "구축도 가능";
  return "상관없음";
}

function getOccupancyPreferenceLabel(value: OccupancyPreference) {
  if (value === "immediate") return "즉시 입주 선호";
  if (value === "negotiable") return "협의 입주 가능";
  if (value === "vacant") return "공실만 보기";
  return "상관없음";
}

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const workStationInput = searchParams.get("workStation") ?? "강남역";
  const budgetInput = searchParams.get("budget") ?? "15";
  const householdPreference =
    (searchParams.get("household") as HouseholdPreference) ?? "family";
  const schoolPreference =
    (searchParams.get("school") as SchoolPreference) ?? "yes";
  const agePreference =
    (searchParams.get("age") as AgePreference) ?? "any";
  const occupancyPreference =
    (searchParams.get("occupancy") as OccupancyPreference) ?? "any";
  const commutePreference =
    (searchParams.get("commute") as CommutePreference) ?? "45";

  const parsedBudget = useMemo(() => {
    if (!budgetInput.trim()) return null;
    const num = Number(budgetInput);
    return Number.isNaN(num) ? null : num;
  }, [budgetInput]);

  const matchedWorkStation = useMemo(() => {
    return findStationByQuery(workStationInput);
  }, [workStationInput]);

  const recommendations = useMemo(() => {
    return getRecommendations({
      workStationInput,
      budgetEok: parsedBudget,
      householdPreference,
      schoolPreference,
      agePreference,
      occupancyPreference,
      commutePreference,
    }).slice(0, 3);
  }, [
    workStationInput,
    parsedBudget,
    householdPreference,
    schoolPreference,
    agePreference,
    occupancyPreference,
    commutePreference,
  ]);

  const openRecommendations = () => {
    const params = new URLSearchParams({
      workStation: workStationInput,
      budget: budgetInput,
      household: householdPreference,
      school: schoolPreference,
      age: agePreference,
      occupancy: occupancyPreference,
      commute: commutePreference,
    });

    router.push(`/recommendations?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-slate-100 print:bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 print:px-0">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                apt-fit-home
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                상담용 추천 요약
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                현재 선택한 조건을 기준으로
                상위 추천 매물을 한눈에 정리한 화면입니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
              <button
                onClick={() => router.push("/")}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                홈으로 돌아가기
              </button>

              <button
                onClick={openRecommendations}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                전체 추천 보기
              </button>

              <button
                onClick={() => window.print()}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                이 화면 출력
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
          <h2 className="text-xl font-bold text-slate-900">현재 조건 요약</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">근무지 역</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {matchedWorkStation ? matchedWorkStation.name : workStationInput}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">예산</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {budgetInput ? `${budgetInput}억` : "미입력"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">출퇴근 허용 시간</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {getCommutePreferenceLabel(commutePreference)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">가구 형태</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {getHouseholdLabel(householdPreference)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">학군 중요도</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {getSchoolLabel(schoolPreference)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">연식 선호</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {getAgeLabel(agePreference)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">입주 상태</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {getOccupancyPreferenceLabel(occupancyPreference)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">추천 결과 수</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {recommendations.length}개
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">상위 추천 매물 요약</h2>
            <p className="mt-1 text-sm text-slate-500">
              상담 시 빠르게 보여주기 좋은 핵심 정보만 정리했습니다.
            </p>
          </div>

          <div className="grid gap-5">
            {recommendations.map((item, index) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      TOP {index + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.district} · {item.nearestStation} 도보 {item.walkMinutes}분
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
                    <p className="text-xs font-semibold text-slate-500">종합 점수</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {item.totalScore}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    최근가 {item.priceEok}억
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {item.sizePyeong}평
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {item.buildYear}년식
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {getOccupancyLabel(item.occupancy)}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {item.reasonBadge}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">출퇴근</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {item.commute.score}점
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.commute.estimatedMinutes !== null
                        ? `약 ${item.commute.estimatedMinutes}분`
                        : "계산 전"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">예산 적합도</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {item.budget.score}점
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      최근가 {item.priceEok}억
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">학군</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {item.school.score}점
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      가족 적합도 {item.family.score}점
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">인테리어 예상</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {item.interior.rangeText}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.interiorStatus === "fresh"
                        ? "가벼운 보완"
                        : item.interiorStatus === "good"
                        ? "부분 리모델링"
                        : "전체 리모델링 검토"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    추천 이유 한 줄 요약
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    {item.reasonText}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}