"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type AgePreference,
  type CommutePreference,
  type HouseholdPreference,
  type OccupancyPreference,
  type RecommendationItem,
  type SchoolPreference,
  findStationByQuery,
  getCommutePreferenceLabel,
  getOccupancyLabel,
  getRecommendations,
} from "../lib/recommendationData";

type SortOption =
  | "total"
  | "commute"
  | "budget"
  | "school"
  | "family"
  | "age";

const STORAGE_KEYS = {
  sortOption: "apt-fit-home:recommendations:sortOption",
  expandedCardIds: "apt-fit-home:recommendations:expandedCardIds",
  compareIds: "apt-fit-home:recommendations:compareIds",
} as const;

function getSortLabel(sortOption: SortOption) {
  if (sortOption === "commute") return "출퇴근순";
  if (sortOption === "budget") return "예산 적합도순";
  if (sortOption === "school") return "학군순";
  if (sortOption === "family") return "가족 적합도순";
  if (sortOption === "age") return "신축 선호순";
  return "종합 점수순";
}

function isSortOption(value: string): value is SortOption {
  return (
    value === "total" ||
    value === "commute" ||
    value === "budget" ||
    value === "school" ||
    value === "family" ||
    value === "age"
  );
}

function readStoredNumberArray(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value) => typeof value === "number");
  } catch {
    return [];
  }
}

function ScoreRow({
  label,
  score,
  text,
}: {
  label: string;
  score: number;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-700">
          {score}점
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function RecommendationCard({
  item,
  index,
  defaultMonth,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleCompare,
  onOpenTransactions,
}: {
  item: RecommendationItem;
  index: number;
  defaultMonth: string;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onOpenTransactions: (item: RecommendationItem, defaultMonth: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-900 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              RANK {index + 1}
            </p>
            <h3 className="mt-2 text-2xl font-bold">{item.name}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {item.district} · {item.nearestStation} 도보 {item.walkMinutes}분
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
            <p className="text-xs text-slate-300">종합 점수</p>
            <p className="mt-1 text-3xl font-bold">{item.totalScore}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            최근가 {item.priceEok}억
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            {item.sizePyeong}평
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            {item.buildYear}년식
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            {getOccupancyLabel(item.occupancy)}
          </span>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200">
            {item.commute.fitText}
          </span>
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-200">
            {item.reasonBadge}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            왜 이 아파트가 올라왔나
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            {item.reasonText}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                예상 인테리어 비용
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {item.interior.rangeText}
              </p>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              {item.interiorStatus === "fresh"
                ? "가벼운 보완"
                : item.interiorStatus === "good"
                ? "부분 리모델링"
                : "전체 리모델링 검토"}
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {item.interior.detail}
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          <ScoreRow
            label="출퇴근"
            score={item.commute.score}
            text={`${item.commute.detail}${
              item.commute.estimatedMinutes !== null
                ? ` 예상 총 출퇴근 시간은 약 ${item.commute.estimatedMinutes}분`
                : ""
            }${
              item.commute.transferCount !== null
                ? ` / 환승 ${item.commute.transferCount}회 기준입니다.`
                : ""
            }`}
          />
          <ScoreRow
            label="예산"
            score={item.budget.score}
            text={item.budget.detail}
          />

          {isExpanded ? (
            <>
              <ScoreRow
                label="가족 적합도"
                score={item.family.score}
                text={item.family.detail}
              />
              <ScoreRow
                label="학군"
                score={item.school.score}
                text={item.school.detail}
              />
              <ScoreRow
                label="신축·구축"
                score={item.age.score}
                text={item.age.detail}
              />
              <ScoreRow
                label="입주 상태"
                score={item.occupancyScore.score}
                text={item.occupancyScore.detail}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
              상세 점수 4개가 접혀 있습니다. 펼치면 가족, 학군, 연식, 입주 상태까지 볼 수 있습니다.
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <button
            onClick={() => onToggleExpand(item.id)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {isExpanded ? "간단히 보기" : "자세히 보기"}
          </button>

          <button
            onClick={() => onToggleCompare(item.id)}
            className={`rounded-2xl px-4 py-4 text-sm font-semibold transition ${
              isSelected
                ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isSelected ? "비교 해제" : "비교 담기"}
          </button>

          <button
            onClick={() => onOpenTransactions(item, defaultMonth)}
            className="rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            이 아파트 실거래 바로 보기
          </button>
        </div>
      </div>
    </article>
  );
}

function getMaxValue(items: RecommendationItem[], selector: (item: RecommendationItem) => number) {
  if (items.length === 0) return null;
  return Math.max(...items.map(selector));
}

function getMinValue(items: RecommendationItem[], selector: (item: RecommendationItem) => number) {
  if (items.length === 0) return null;
  return Math.min(...items.map(selector));
}

function getCompareCellClass(isBest: boolean) {
  return isBest
    ? "bg-emerald-50 font-bold text-emerald-700"
    : "text-slate-700";
}

function BestBadge({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700">
      BEST
    </span>
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortOption, setSortOption] = useState<SortOption>("total");
  const [expandedCardIds, setExpandedCardIds] = useState<number[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const workStationInput = searchParams.get("workStation") ?? "강남역";
  const budgetInput = searchParams.get("budget") ?? "15";
  const householdPreference =
    (searchParams.get("household") as HouseholdPreference) ?? "family";
  const schoolPreference =
    (searchParams.get("school") as SchoolPreference) ?? "yes";
  const agePreference = (searchParams.get("age") as AgePreference) ?? "any";
  const occupancyPreference =
    (searchParams.get("occupancy") as OccupancyPreference) ?? "any";
  const commutePreference =
    (searchParams.get("commute") as CommutePreference) ?? "45";

  const defaultMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, []);

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
    });
  }, [
    workStationInput,
    parsedBudget,
    householdPreference,
    schoolPreference,
    agePreference,
    occupancyPreference,
    commutePreference,
  ]);

  useEffect(() => {
    const storedSort = window.localStorage.getItem(STORAGE_KEYS.sortOption);
    if (storedSort && isSortOption(storedSort)) {
      setSortOption(storedSort);
    }

    setExpandedCardIds(readStoredNumberArray(STORAGE_KEYS.expandedCardIds));
    setCompareIds(readStoredNumberArray(STORAGE_KEYS.compareIds));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.sortOption, sortOption);
  }, [sortOption]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.expandedCardIds,
      JSON.stringify(expandedCardIds)
    );
  }, [expandedCardIds]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.compareIds,
      JSON.stringify(compareIds)
    );
  }, [compareIds]);

  useEffect(() => {
    const validIds = new Set(recommendations.map((item) => item.id));

    setExpandedCardIds((prev) => prev.filter((id) => validIds.has(id)));
    setCompareIds((prev) => prev.filter((id) => validIds.has(id)).slice(0, 3));
  }, [recommendations]);

  const sortedRecommendations = useMemo(() => {
    const items = [...recommendations];

    items.sort((a, b) => {
      if (sortOption === "commute") {
        return b.commute.score - a.commute.score || b.totalScore - a.totalScore;
      }
      if (sortOption === "budget") {
        return b.budget.score - a.budget.score || b.totalScore - a.totalScore;
      }
      if (sortOption === "school") {
        return b.school.score - a.school.score || b.totalScore - a.totalScore;
      }
      if (sortOption === "family") {
        return b.family.score - a.family.score || b.totalScore - a.totalScore;
      }
      if (sortOption === "age") {
        return b.age.score - a.age.score || b.totalScore - a.totalScore;
      }
      return b.totalScore - a.totalScore;
    });

    return items;
  }, [recommendations, sortOption]);

  const compareItems = useMemo(() => {
    return recommendations.filter((item) => compareIds.includes(item.id));
  }, [recommendations, compareIds]);

  const bestTotal = useMemo(
    () => getMaxValue(compareItems, (item) => item.totalScore),
    [compareItems]
  );
  const bestCommute = useMemo(
    () => getMaxValue(compareItems, (item) => item.commute.score),
    [compareItems]
  );
  const bestBudget = useMemo(
    () => getMaxValue(compareItems, (item) => item.budget.score),
    [compareItems]
  );
  const bestSchool = useMemo(
    () => getMaxValue(compareItems, (item) => item.school.score),
    [compareItems]
  );
  const bestFamily = useMemo(
    () => getMaxValue(compareItems, (item) => item.family.score),
    [compareItems]
  );
  const newestYear = useMemo(
    () => getMaxValue(compareItems, (item) => item.buildYear),
    [compareItems]
  );
  const lowestPrice = useMemo(
    () => getMinValue(compareItems, (item) => item.priceEok),
    [compareItems]
  );

  const openTransactions = (item: RecommendationItem, month: string) => {
    const params = new URLSearchParams({
      districtCode: item.districtCode,
      month,
      apartmentName: item.name,
    });

    router.push(`/transactions?${params.toString()}`);
  };

  const resetToHomeDefaults = () => {
    window.localStorage.removeItem(STORAGE_KEYS.sortOption);
    window.localStorage.removeItem(STORAGE_KEYS.expandedCardIds);
    window.localStorage.removeItem(STORAGE_KEYS.compareIds);
    router.push("/");
  };

  const toggleExpand = (id: number) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }

      if (prev.length >= 3) {
        window.alert("비교는 최대 3개까지만 담을 수 있습니다.");
        return prev;
      }

      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold text-slate-500">
                apt-fit-home
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                전체 추천 결과
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                이제 새로고침해도
                <br />
                비교 담기, 펼침 상태, 정렬 기준이 그대로 유지됩니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/")}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                홈으로 돌아가기
              </button>

              <button
                onClick={resetToHomeDefaults}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                기본 조건으로 다시 시작
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">근무지 역</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {matchedWorkStation ? matchedWorkStation.name : "찾지 못함"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">희망 출퇴근</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {getCommutePreferenceLabel(commutePreference)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">예산</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {budgetInput ? `${budgetInput}억` : "미입력"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">전체 결과 수</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {sortedRecommendations.length}개
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">추천 정렬 기준</p>
                <p className="mt-1 text-sm text-slate-600">
                  지금은 <span className="font-semibold">{getSortLabel(sortOption)}</span> 으로 보고 있습니다.
                </p>
              </div>

              <div className="w-full md:w-[260px]">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  정렬 선택
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                >
                  <option value="total">종합 점수순</option>
                  <option value="commute">출퇴근순</option>
                  <option value="budget">예산 적합도순</option>
                  <option value="school">학군순</option>
                  <option value="family">가족 적합도순</option>
                  <option value="age">신축 선호순</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">비교하기</h2>
              <p className="mt-1 text-sm text-slate-500">
                카드에서 비교 담기를 누르면 최대 3개까지 한 번에 볼 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                현재 비교 수 {compareItems.length} / 3
              </div>

              <button
                onClick={clearCompare}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                비교 비우기
              </button>
            </div>
          </div>

          {compareItems.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              아직 비교할 매물이 없습니다. 아래 카드에서 비교 담기를 눌러보면 됩니다.
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-slate-200">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="border-b border-slate-800 px-4 py-3 text-left text-sm font-semibold">
                      비교 항목
                    </th>
                    {compareItems.map((item) => (
                      <th
                        key={item.id}
                        className="border-b border-slate-800 px-4 py-3 text-left text-sm font-semibold"
                      >
                        {item.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      종합 점수
                    </td>
                    {compareItems.map((item) => {
                      const isBest = bestTotal !== null && item.totalScore === bestTotal;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.totalScore}점
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      출퇴근
                    </td>
                    {compareItems.map((item) => {
                      const isBest = bestCommute !== null && item.commute.score === bestCommute;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.commute.score}점
                          {item.commute.estimatedMinutes !== null
                            ? ` / 약 ${item.commute.estimatedMinutes}분`
                            : ""}
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      예산 적합도
                    </td>
                    {compareItems.map((item) => {
                      const isBest = bestBudget !== null && item.budget.score === bestBudget;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.budget.score}점
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      학군
                    </td>
                    {compareItems.map((item) => {
                      const isBest = bestSchool !== null && item.school.score === bestSchool;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.school.score}점
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      가족 적합도
                    </td>
                    {compareItems.map((item) => {
                      const isBest = bestFamily !== null && item.family.score === bestFamily;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.family.score}점
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      연식
                    </td>
                    {compareItems.map((item) => {
                      const isBest = newestYear !== null && item.buildYear === newestYear;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.buildYear}년
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      평형
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700"
                      >
                        {item.sizePyeong}평
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                      최근가
                    </td>
                    {compareItems.map((item) => {
                      const isBest = lowestPrice !== null && item.priceEok === lowestPrice;
                      return (
                        <td
                          key={item.id}
                          className={`border-b border-slate-200 px-4 py-3 text-sm ${getCompareCellClass(
                            isBest
                          )}`}
                        >
                          {item.priceEok}억
                          <BestBadge show={isBest} />
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                      입주 상태
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="px-4 py-3 text-sm text-slate-700"
                      >
                        {getOccupancyLabel(item.occupancy)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">전체 추천 순위</h2>
            <p className="mt-1 text-sm text-slate-500">
              현재 정렬 기준은 {getSortLabel(sortOption)} 입니다.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {sortedRecommendations.map((item, index) => (
              <RecommendationCard
                key={item.id}
                item={item}
                index={index}
                defaultMonth={defaultMonth}
                isExpanded={expandedCardIds.includes(item.id)}
                isSelected={compareIds.includes(item.id)}
                onToggleExpand={toggleExpand}
                onToggleCompare={toggleCompare}
                onOpenTransactions={openTransactions}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}