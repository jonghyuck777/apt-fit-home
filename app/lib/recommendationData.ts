export type Area = "강남" | "송파" | "도심" | "서북" | "서남" | "동북";
export type HouseholdPreference = "single" | "couple" | "family";
export type SchoolPreference = "any" | "yes" | "no";
export type AgePreference = "any" | "new" | "value";
export type OccupancyPreference = "any" | "immediate" | "negotiable" | "vacant";
export type CommutePreference = "any" | "30" | "45" | "60" | "75";

export type Station = {
  name: string;
  lines: string[];
  lat: number;
  lng: number;
  area: Area;
  hub: boolean;
};

export type Apartment = {
  id: number;
  name: string;
  district: string;
  districtCode: string;
  area: Area;
  nearestStation: string;
  walkMinutes: number;
  priceEok: number;
  sizePyeong: number;
  buildYear: number;
  schoolScore: number;
  familyScore: number;
  occupancy: "immediate" | "negotiable" | "vacant";
  interiorStatus: "fresh" | "good" | "needsRenovation";
};

export type ScoreDetail = {
  score: number;
  detail: string;
};

export type RecommendationItem = Apartment & {
  totalScore: number;
  commute: ScoreDetail & {
    estimatedMinutes: number | null;
    transferCount: number | null;
    fitText: string;
  };
  budget: ScoreDetail;
  family: ScoreDetail;
  school: ScoreDetail;
  age: ScoreDetail;
  occupancyScore: ScoreDetail;
  interior: {
    rangeText: string;
    detail: string;
  };
  reasonBadge: string;
  reasonText: string;
};

export const CURRENT_YEAR = 2026;

export const AREA_NEIGHBORS: Record<Area, Area[]> = {
  강남: ["송파", "도심", "동북", "서남"],
  송파: ["강남", "동북"],
  도심: ["강남", "동북", "서북", "서남"],
  서북: ["도심", "동북", "서남"],
  서남: ["도심", "강남", "서북"],
  동북: ["도심", "강남", "송파", "서북"],
};

export const STATIONS: Station[] = [
  { name: "강남역", lines: ["2호선", "신분당선"], lat: 37.4979, lng: 127.0276, area: "강남", hub: true },
  { name: "역삼역", lines: ["2호선"], lat: 37.5006, lng: 127.0365, area: "강남", hub: false },
  { name: "선릉역", lines: ["2호선", "수인분당선"], lat: 37.5045, lng: 127.049, area: "강남", hub: true },
  { name: "삼성역", lines: ["2호선"], lat: 37.5088, lng: 127.0631, area: "강남", hub: false },
  { name: "양재역", lines: ["3호선", "신분당선"], lat: 37.4845, lng: 127.0348, area: "강남", hub: true },
  { name: "교대역", lines: ["2호선", "3호선"], lat: 37.4934, lng: 127.0147, area: "강남", hub: true },
  { name: "신사역", lines: ["3호선", "신분당선"], lat: 37.5162, lng: 127.0206, area: "강남", hub: true },
  { name: "논현역", lines: ["7호선", "신분당선"], lat: 37.5111, lng: 127.0215, area: "강남", hub: true },
  { name: "강남구청역", lines: ["7호선", "수인분당선"], lat: 37.5172, lng: 127.0417, area: "강남", hub: true },
  { name: "선정릉역", lines: ["9호선", "수인분당선"], lat: 37.5108, lng: 127.0436, area: "강남", hub: true },
  { name: "압구정로데오역", lines: ["수인분당선"], lat: 37.527, lng: 127.0406, area: "강남", hub: false },
  { name: "대치역", lines: ["3호선"], lat: 37.4946, lng: 127.0635, area: "강남", hub: false },

  { name: "잠실역", lines: ["2호선", "8호선"], lat: 37.5133, lng: 127.1001, area: "송파", hub: true },
  { name: "송파역", lines: ["8호선"], lat: 37.5054, lng: 127.1069, area: "송파", hub: false },
  { name: "가락시장역", lines: ["3호선", "8호선"], lat: 37.4921, lng: 127.1181, area: "송파", hub: true },

  { name: "서울역", lines: ["1호선", "4호선", "경의중앙선", "공항철도"], lat: 37.5547, lng: 126.9706, area: "도심", hub: true },
  { name: "시청역", lines: ["1호선", "2호선"], lat: 37.5659, lng: 126.9773, area: "도심", hub: true },
  { name: "광화문역", lines: ["5호선"], lat: 37.5716, lng: 126.9769, area: "도심", hub: false },
  { name: "을지로입구역", lines: ["2호선"], lat: 37.5661, lng: 126.9824, area: "도심", hub: false },
  { name: "종각역", lines: ["1호선"], lat: 37.5702, lng: 126.9832, area: "도심", hub: false },
  { name: "종로3가역", lines: ["1호선", "3호선", "5호선"], lat: 37.5713, lng: 126.9916, area: "도심", hub: true },
  { name: "공덕역", lines: ["5호선", "6호선", "경의중앙선", "공항철도"], lat: 37.544, lng: 126.9514, area: "도심", hub: true },
  { name: "경복궁역", lines: ["3호선"], lat: 37.5758, lng: 126.9737, area: "도심", hub: false },
  { name: "독립문역", lines: ["3호선"], lat: 37.5743, lng: 126.9576, area: "도심", hub: false },

  { name: "홍대입구역", lines: ["2호선", "경의중앙선", "공항철도"], lat: 37.5572, lng: 126.9245, area: "서북", hub: true },
  { name: "합정역", lines: ["2호선", "6호선"], lat: 37.5496, lng: 126.9142, area: "서북", hub: true },
  { name: "디지털미디어시티역", lines: ["6호선", "경의중앙선", "공항철도"], lat: 37.5776, lng: 126.9006, area: "서북", hub: true },
  { name: "마곡나루역", lines: ["9호선", "공항철도"], lat: 37.5667, lng: 126.827, area: "서북", hub: true },

  { name: "목동역", lines: ["5호선"], lat: 37.5261, lng: 126.8645, area: "서남", hub: false },
  { name: "구로디지털단지역", lines: ["2호선"], lat: 37.4853, lng: 126.9014, area: "서남", hub: false },
  { name: "가산디지털단지역", lines: ["1호선", "7호선"], lat: 37.4816, lng: 126.8828, area: "서남", hub: true },
  { name: "서울대입구역", lines: ["2호선"], lat: 37.4813, lng: 126.9527, area: "서남", hub: false },
  { name: "신도림역", lines: ["1호선", "2호선"], lat: 37.5097, lng: 126.8913, area: "서남", hub: true },

  { name: "왕십리역", lines: ["2호선", "5호선", "수인분당선", "경의중앙선"], lat: 37.5612, lng: 127.0371, area: "동북", hub: true },
  { name: "성수역", lines: ["2호선"], lat: 37.5447, lng: 127.0557, area: "동북", hub: false },
  { name: "건대입구역", lines: ["2호선", "7호선"], lat: 37.5404, lng: 127.0692, area: "동북", hub: true },
  { name: "옥수역", lines: ["3호선", "경의중앙선"], lat: 37.5405, lng: 127.0187, area: "동북", hub: true },
  { name: "길음역", lines: ["4호선"], lat: 37.6031, lng: 127.025, area: "동북", hub: false },
  { name: "미아사거리역", lines: ["4호선"], lat: 37.6131, lng: 127.0301, area: "동북", hub: false },
  { name: "노원역", lines: ["4호선", "7호선"], lat: 37.6546, lng: 127.0606, area: "동북", hub: true },
  { name: "창동역", lines: ["1호선", "4호선"], lat: 37.653, lng: 127.0479, area: "동북", hub: true },
  { name: "도봉역", lines: ["1호선"], lat: 37.6797, lng: 127.0455, area: "동북", hub: false },
];

export const APARTMENTS: Apartment[] = [
  {
    id: 1,
    name: "마곡엠밸리7단지",
    district: "강서구",
    districtCode: "11500",
    area: "서북",
    nearestStation: "마곡나루역",
    walkMinutes: 8,
    priceEok: 12.4,
    sizePyeong: 33,
    buildYear: 2014,
    schoolScore: 82,
    familyScore: 91,
    occupancy: "negotiable",
    interiorStatus: "good",
  },
  {
    id: 2,
    name: "헬리오시티",
    district: "송파구",
    districtCode: "11710",
    area: "송파",
    nearestStation: "송파역",
    walkMinutes: 7,
    priceEok: 18.7,
    sizePyeong: 33,
    buildYear: 2018,
    schoolScore: 90,
    familyScore: 95,
    occupancy: "negotiable",
    interiorStatus: "good",
  },
  {
    id: 3,
    name: "래미안대치팰리스",
    district: "강남구",
    districtCode: "11680",
    area: "강남",
    nearestStation: "대치역",
    walkMinutes: 5,
    priceEok: 29.5,
    sizePyeong: 34,
    buildYear: 2015,
    schoolScore: 98,
    familyScore: 90,
    occupancy: "negotiable",
    interiorStatus: "fresh",
  },
  {
    id: 4,
    name: "옥수파크힐스",
    district: "성동구",
    districtCode: "11200",
    area: "동북",
    nearestStation: "옥수역",
    walkMinutes: 7,
    priceEok: 22.1,
    sizePyeong: 33,
    buildYear: 2016,
    schoolScore: 88,
    familyScore: 89,
    occupancy: "immediate",
    interiorStatus: "good",
  },
  {
    id: 5,
    name: "래미안아트리치",
    district: "성북구",
    districtCode: "11290",
    area: "동북",
    nearestStation: "길음역",
    walkMinutes: 9,
    priceEok: 11.8,
    sizePyeong: 34,
    buildYear: 2019,
    schoolScore: 84,
    familyScore: 88,
    occupancy: "immediate",
    interiorStatus: "fresh",
  },
  {
    id: 6,
    name: "DMC래미안e편한세상",
    district: "은평구",
    districtCode: "11380",
    area: "서북",
    nearestStation: "디지털미디어시티역",
    walkMinutes: 10,
    priceEok: 13.3,
    sizePyeong: 34,
    buildYear: 2012,
    schoolScore: 83,
    familyScore: 90,
    occupancy: "vacant",
    interiorStatus: "good",
  },
  {
    id: 7,
    name: "트리지움",
    district: "송파구",
    districtCode: "11710",
    area: "송파",
    nearestStation: "잠실역",
    walkMinutes: 12,
    priceEok: 21.0,
    sizePyeong: 33,
    buildYear: 2007,
    schoolScore: 92,
    familyScore: 94,
    occupancy: "negotiable",
    interiorStatus: "needsRenovation",
  },
  {
    id: 8,
    name: "경희궁자이",
    district: "종로구",
    districtCode: "11110",
    area: "도심",
    nearestStation: "독립문역",
    walkMinutes: 9,
    priceEok: 19.2,
    sizePyeong: 32,
    buildYear: 2017,
    schoolScore: 85,
    familyScore: 82,
    occupancy: "immediate",
    interiorStatus: "good",
  },
  {
    id: 9,
    name: "중계그린아파트",
    district: "노원구",
    districtCode: "11350",
    area: "동북",
    nearestStation: "노원역",
    walkMinutes: 12,
    priceEok: 8.2,
    sizePyeong: 31,
    buildYear: 1999,
    schoolScore: 91,
    familyScore: 90,
    occupancy: "vacant",
    interiorStatus: "needsRenovation",
  },
  {
    id: 10,
    name: "e편한세상서울대입구",
    district: "관악구",
    districtCode: "11620",
    area: "서남",
    nearestStation: "서울대입구역",
    walkMinutes: 6,
    priceEok: 12.7,
    sizePyeong: 25,
    buildYear: 2022,
    schoolScore: 80,
    familyScore: 78,
    occupancy: "immediate",
    interiorStatus: "fresh",
  },
  {
    id: 11,
    name: "목동센트럴아이파크위브",
    district: "양천구",
    districtCode: "11470",
    area: "서남",
    nearestStation: "목동역",
    walkMinutes: 11,
    priceEok: 16.1,
    sizePyeong: 34,
    buildYear: 2020,
    schoolScore: 95,
    familyScore: 93,
    occupancy: "negotiable",
    interiorStatus: "fresh",
  },
  {
    id: 12,
    name: "서울숲푸르지오1차",
    district: "성동구",
    districtCode: "11200",
    area: "동북",
    nearestStation: "성수역",
    walkMinutes: 8,
    priceEok: 18.4,
    sizePyeong: 29,
    buildYear: 2019,
    schoolScore: 84,
    familyScore: 80,
    occupancy: "immediate",
    interiorStatus: "fresh",
  },
];

export function normalizeStationName(value: string) {
  return value.replace(/\s/g, "").replace(/역/g, "").toLowerCase();
}

export function findStationByName(name: string) {
  return STATIONS.find((station) => station.name === name) ?? null;
}

export function findStationByQuery(query: string) {
  const normalized = normalizeStationName(query);

  if (!normalized) return null;

  const exact = STATIONS.find((station) => normalizeStationName(station.name) === normalized);
  if (exact) return exact;

  const startsWith = STATIONS.find((station) =>
    normalizeStationName(station.name).startsWith(normalized)
  );
  if (startsWith) return startsWith;

  const contains = STATIONS.find((station) => {
    const stationName = normalizeStationName(station.name);
    return stationName.includes(normalized) || normalized.includes(stationName);
  });
  if (contains) return contains;

  return null;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function formatEok(value: number) {
  return value % 1 === 0 ? `${value}억` : `${value.toFixed(1)}억`;
}

export function formatManwon(value: number) {
  return `${value.toLocaleString("ko-KR")}만원`;
}

export function getAge(buildYear: number) {
  return CURRENT_YEAR - buildYear;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getInteriorEstimate(apartment: Apartment) {
  const age = getAge(apartment.buildYear);

  if (apartment.interiorStatus === "fresh") {
    return {
      rangeText: `${formatManwon(1800)} ~ ${formatManwon(3200)}`,
      detail: "신축급 또는 손볼 곳이 적어 가벼운 스타일링 위주로 접근하기 좋습니다.",
    };
  }

  if (apartment.interiorStatus === "good" && age <= 15) {
    return {
      rangeText: `${formatManwon(2800)} ~ ${formatManwon(4500)}`,
      detail: "주방·도배·조명 중심의 부분 리모델링을 고려하기 좋은 구간입니다.",
    };
  }

  return {
    rangeText: `${formatManwon(4500)} ~ ${formatManwon(7500)}`,
    detail: "연식 반영 시 전체 리모델링까지 열어두고 보는 편이 현실적입니다.",
  };
}

export function getFastestLineFactor(lines: string[]) {
  if (lines.includes("신분당선")) return 1.45;
  if (lines.includes("9호선")) return 1.55;
  if (lines.includes("공항철도")) return 1.55;
  if (lines.includes("수인분당선")) return 1.75;
  if (lines.includes("2호선")) return 1.95;
  if (lines.includes("3호선")) return 1.9;
  if (lines.includes("4호선")) return 1.95;
  if (lines.includes("7호선")) return 1.95;
  if (lines.includes("1호선")) return 2.05;
  if (lines.includes("5호선")) return 1.95;
  if (lines.includes("6호선")) return 2.0;
  if (lines.includes("8호선")) return 1.95;
  return 2.0;
}

export function estimateTransferCount(
  homeStation: Station,
  workStation: Station,
  sharedLines: string[],
  distanceKm: number
) {
  if (homeStation.name === workStation.name) return 0;
  if (sharedLines.length > 0) return 0;

  const sameArea = homeStation.area === workStation.area;
  const adjacent =
    AREA_NEIGHBORS[homeStation.area].includes(workStation.area) ||
    AREA_NEIGHBORS[workStation.area].includes(homeStation.area);

  if (sameArea && (homeStation.hub || workStation.hub)) return 1;
  if (sameArea && distanceKm <= 6) return 1;
  if (sameArea) return 2;

  if (adjacent && homeStation.hub && workStation.hub) return 1;
  if (adjacent) return 2;

  if (homeStation.hub && workStation.hub && distanceKm <= 14) return 2;
  if (distanceKm <= 10) return 2;

  return 3;
}

export function estimateCommuteMinutes(
  homeStation: Station,
  workStation: Station,
  apartmentWalkMinutes: number,
  sharedLines: string[],
  transferCount: number,
  distanceKm: number
) {
  const homeWalk = apartmentWalkMinutes;
  const officeWalk = workStation.hub ? 5 : 6;
  const waitMinutes = sharedLines.length > 0 ? 4 : 6;
  const lineFactor = sharedLines.length > 0 ? getFastestLineFactor(sharedLines) : 2.0;

  let trainMinutes = distanceKm * lineFactor;

  if (homeStation.area !== workStation.area) {
    trainMinutes += 3;
  }

  if (homeStation.hub && workStation.hub) {
    trainMinutes -= 1.5;
  }

  if (sharedLines.length > 0 && distanceKm <= 5) {
    trainMinutes -= 1.5;
  }

  if (sharedLines.length === 0 && transferCount >= 2) {
    trainMinutes += 4;
  }

  const transferPenalty = transferCount === 0 ? 0 : transferCount * 8;

  return Math.round(
    clamp(homeWalk + officeWalk + waitMinutes + trainMinutes + transferPenalty, 18, 120)
  );
}

export function getCommuteScoreByMinutes(minutes: number) {
  if (minutes <= 25) return 97;
  if (minutes <= 35) return 90;
  if (minutes <= 45) return 82;
  if (minutes <= 55) return 72;
  if (minutes <= 65) return 60;
  if (minutes <= 75) return 48;
  if (minutes <= 90) return 36;
  return 24;
}

export function getCommutePreferenceLabel(value: CommutePreference) {
  if (value === "30") return "30분 이내";
  if (value === "45") return "45분 이내";
  if (value === "60") return "60분 이내";
  if (value === "75") return "75분 이내";
  return "상관없음";
}

export function getCommuteFitText(minutes: number | null, preference: CommutePreference) {
  if (minutes === null || preference === "any") return "시간 제한 없음";

  const limit = Number(preference);

  if (minutes <= limit) return "희망 시간 이내";
  if (minutes <= limit + 10) return "살짝 초과";
  if (minutes <= limit + 20) return "다소 초과";
  return "시간 부담 큼";
}

export function applyCommutePreferenceToScore(
  baseScore: number,
  estimatedMinutes: number,
  preference: CommutePreference
) {
  if (preference === "any") return clamp(baseScore, 18, 99);

  const limit = Number(preference);
  let adjusted = baseScore;

  if (estimatedMinutes <= limit - 10) adjusted += 8;
  else if (estimatedMinutes <= limit) adjusted += 4;
  else if (estimatedMinutes <= limit + 10) adjusted -= 8;
  else if (estimatedMinutes <= limit + 20) adjusted -= 18;
  else adjusted -= 28;

  return clamp(adjusted, 18, 99);
}

export function calculateCommuteScore(
  workStationInput: string,
  apartment: Apartment,
  commutePreference: CommutePreference
): ScoreDetail & {
  estimatedMinutes: number | null;
  transferCount: number | null;
  fitText: string;
} {
  const workStation = findStationByQuery(workStationInput);

  if (!workStation) {
    return {
      score: 65,
      detail: "근무지 역을 입력하면 같은 노선, 환승 수, 허브역 여부, 도보 시간을 함께 반영해 더 현실적으로 계산합니다.",
      estimatedMinutes: null,
      transferCount: null,
      fitText: "근무지 입력 필요",
    };
  }

  const homeStation = findStationByName(apartment.nearestStation);

  if (!homeStation) {
    return {
      score: 60,
      detail: "주변 역 정보가 부족해 기본 출퇴근 점수로 반영했습니다.",
      estimatedMinutes: null,
      transferCount: null,
      fitText: "역 정보 부족",
    };
  }

  const sharedLines = homeStation.lines.filter((line) => workStation.lines.includes(line));
  const distanceKm = haversineKm(
    homeStation.lat,
    homeStation.lng,
    workStation.lat,
    workStation.lng
  );

  const transferCount = estimateTransferCount(homeStation, workStation, sharedLines, distanceKm);
  const estimatedMinutes = estimateCommuteMinutes(
    homeStation,
    workStation,
    apartment.walkMinutes,
    sharedLines,
    transferCount,
    distanceKm
  );

  let score = getCommuteScoreByMinutes(estimatedMinutes);

  if (sharedLines.length > 0) score += 4;
  if (homeStation.hub) score += 2;
  if (homeStation.name === workStation.name) score += 5;
  if (apartment.walkMinutes >= 12) score -= 4;

  score = applyCommutePreferenceToScore(score, estimatedMinutes, commutePreference);

  let detail = "";

  if (homeStation.name === workStation.name) {
    detail = `${workStation.name} 생활권으로 바로 이어지는 편입니다. 집에서 역까지 도보 ${apartment.walkMinutes}분 기준으로 매우 편하게 볼 수 있습니다.`;
  } else if (sharedLines.length > 0) {
    detail = `${sharedLines.join(", ")} 직결 축이라 환승 없이 이동 가능한 편으로 봤습니다. 집에서 역까지 도보 ${apartment.walkMinutes}분 기준입니다.`;
  } else if (transferCount === 1) {
    detail = `${workStation.name}까지 환승 1회 정도로 이어지는 구조라 체감 출퇴근은 무난한 편으로 반영했습니다.`;
  } else if (transferCount === 2) {
    detail = `${workStation.name}까지 환승 2회 안팎으로 보는 것이 현실적이라 출퇴근 점수를 보수적으로 반영했습니다.`;
  } else {
    detail = `${workStation.name} 기준으로 거리와 환승 부담이 모두 있는 편이라 장거리 출퇴근으로 판단했습니다.`;
  }

  if (commutePreference !== "any") {
    const label = getCommutePreferenceLabel(commutePreference);
    const fitText = getCommuteFitText(estimatedMinutes, commutePreference);

    detail += ` 사용자가 원하는 기준은 ${label}이고, 현재 평가는 ${fitText}로 반영했습니다.`;

    return {
      score,
      detail,
      estimatedMinutes,
      transferCount,
      fitText,
    };
  }

  return {
    score,
    detail,
    estimatedMinutes,
    transferCount,
    fitText: "시간 제한 없음",
  };
}

export function calculateBudgetScore(budgetEok: number | null, apartment: Apartment): ScoreDetail {
  if (!budgetEok || Number.isNaN(budgetEok)) {
    return {
      score: 70,
      detail: "예산을 입력하면 최근가 대비 여유 구간인지, 살짝 초과인지까지 더 정확하게 반영합니다.",
    };
  }

  if (apartment.priceEok <= budgetEok * 0.9) {
    return {
      score: 96,
      detail: `예산 ${formatEok(budgetEok)} 기준으로 여유가 있는 편입니다. 최근가 ${formatEok(apartment.priceEok)} 수준입니다.`,
    };
  }

  if (apartment.priceEok <= budgetEok) {
    return {
      score: 88,
      detail: `예산 ${formatEok(budgetEok)} 안쪽에서 검토 가능한 수준입니다. 최근가 ${formatEok(apartment.priceEok)} 입니다.`,
    };
  }

  if (apartment.priceEok <= budgetEok * 1.05) {
    return {
      score: 76,
      detail: "예산을 소폭 넘는 정도라 협상 여지나 자금 계획에 따라 접근 가능한 구간입니다.",
    };
  }

  if (apartment.priceEok <= budgetEok * 1.15) {
    return {
      score: 60,
      detail: "예산 대비 부담이 조금 있는 편입니다. 실거래 흐름과 추가 자금 계획을 함께 보시는 게 좋습니다.",
    };
  }

  if (apartment.priceEok <= budgetEok * 1.3) {
    return {
      score: 42,
      detail: "예산보다 꽤 높은 구간이라 현실성은 다소 떨어집니다.",
    };
  }

  return {
    score: 24,
    detail: "현재 예산 기준으로는 간극이 큰 편입니다.",
  };
}

export function calculateFamilyScore(
  apartment: Apartment,
  householdPreference: HouseholdPreference
): ScoreDetail {
  const sizeBonus =
    apartment.sizePyeong >= 33 ? 8 : apartment.sizePyeong >= 29 ? 4 : 0;

  if (householdPreference === "single") {
    const score = clamp(
      Math.round(62 + (apartment.sizePyeong <= 30 ? 12 : 4) + (apartment.familyScore - 80) * 0.2),
      40,
      92
    );

    return {
      score,
      detail: "1인 가구 기준으로는 너무 큰 평형보다 접근성과 관리 부담을 함께 봤습니다.",
    };
  }

  if (householdPreference === "couple") {
    const score = clamp(
      Math.round(68 + (apartment.familyScore - 80) * 0.5 + sizeBonus),
      45,
      95
    );

    return {
      score,
      detail: "2인 가구 기준으로 생활 편의와 적당한 공간 균형을 반영했습니다.",
    };
  }

  const score = clamp(
    Math.round(72 + (apartment.familyScore - 80) * 0.9 + sizeBonus),
    50,
    98
  );

  return {
    score,
    detail: "자녀 동반 실거주를 가정해 면적, 단지 안정감, 생활 인프라 성격을 더 높게 반영했습니다.",
  };
}

export function calculateSchoolScore(
  apartment: Apartment,
  schoolPreference: SchoolPreference
): ScoreDetail {
  if (schoolPreference === "no") {
    return {
      score: 70,
      detail: "학군 비중을 낮춰서 중립 점수로 반영했습니다.",
    };
  }

  if (schoolPreference === "any") {
    const score = Math.round((apartment.schoolScore + 70) / 2);
    return {
      score,
      detail: "학군을 필수 조건으로 두지 않아 중간 비중으로 반영했습니다.",
    };
  }

  return {
    score: apartment.schoolScore,
    detail: "학군 민감도가 높다고 보고 학교·학원 접근성 쪽 가중치를 높였습니다.",
  };
}

export function calculateAgeScore(
  apartment: Apartment,
  agePreference: AgePreference
): ScoreDetail {
  const age = getAge(apartment.buildYear);

  if (agePreference === "any") {
    return {
      score: 72,
      detail: `준공 ${apartment.buildYear}년 기준 연식은 ${age}년차이며, 신축/구축 선호를 중립으로 두고 반영했습니다.`,
    };
  }

  if (agePreference === "new") {
    let score = 40;
    if (age <= 5) score = 96;
    else if (age <= 10) score = 88;
    else if (age <= 15) score = 74;
    else if (age <= 20) score = 58;

    return {
      score,
      detail: `신축 선호 기준으로 ${age}년차 연식을 반영했습니다.`,
    };
  }

  let score = 55;
  if (age >= 20) score = 90;
  else if (age >= 15) score = 82;
  else if (age >= 10) score = 72;

  return {
    score,
    detail: "구축 선호 기준으로 가격 메리트와 리모델링 여지를 함께 봤습니다.",
  };
}

export function calculateOccupancyScore(
  apartment: Apartment,
  occupancyPreference: OccupancyPreference
): ScoreDetail {
  if (occupancyPreference === "any") {
    return {
      score: 72,
      detail: "입주 상태는 상관없음으로 두고 중립 반영했습니다.",
    };
  }

  if (occupancyPreference === "immediate") {
    const score =
      apartment.occupancy === "vacant"
        ? 97
        : apartment.occupancy === "immediate"
        ? 90
        : 68;

    return {
      score,
      detail: "즉시 입주 선호 기준으로 공실 여부와 바로 진행 가능성을 높게 반영했습니다.",
    };
  }

  if (occupancyPreference === "negotiable") {
    const score =
      apartment.occupancy === "negotiable"
        ? 95
        : apartment.occupancy === "immediate"
        ? 82
        : 75;

    return {
      score,
      detail: "협의 입주 가능성을 우선으로 봤습니다.",
    };
  }

  const score = apartment.occupancy === "vacant" ? 98 : 55;

  return {
    score,
    detail: "공실만 선호하는 조건이라 현재 비어 있는 매물에 점수를 크게 줬습니다.",
  };
}

export function getOccupancyLabel(value: Apartment["occupancy"]) {
  if (value === "vacant") return "공실";
  if (value === "immediate") return "즉시 가능";
  return "협의 입주";
}

function getReasonSummary(params: {
  apartment: Apartment;
  workStationName: string | null;
  budgetEok: number | null;
  householdPreference: HouseholdPreference;
  schoolPreference: SchoolPreference;
  agePreference: AgePreference;
  occupancyPreference: OccupancyPreference;
  commute: RecommendationItem["commute"];
  budget: ScoreDetail;
  family: ScoreDetail;
  school: ScoreDetail;
  age: ScoreDetail;
  occupancy: ScoreDetail;
}) {
  const {
    apartment,
    workStationName,
    budgetEok,
    householdPreference,
    schoolPreference,
    agePreference,
    occupancyPreference,
    commute,
    budget,
    family,
    school,
    age,
    occupancy,
  } = params;

  if (
    workStationName &&
    commute.estimatedMinutes !== null &&
    commute.fitText === "희망 시간 이내" &&
    commute.score >= 85
  ) {
    return {
      badge: "출퇴근 만족도 우수",
      text: `${workStationName} 기준 예상 출퇴근 ${commute.estimatedMinutes}분, 환승 ${commute.transferCount ?? 0}회 수준으로 출퇴근 체감이 좋은 편이라 상위권으로 올라왔습니다.`,
    };
  }

  if (budgetEok !== null && budget.score >= 88) {
    return {
      badge: "예산 적합도 우수",
      text: `예산 ${formatEok(budgetEok)} 기준으로 최근가 ${formatEok(apartment.priceEok)} 수준이라 자금 계획과의 간격이 비교적 안정적입니다.`,
    };
  }

  if (householdPreference === "family" && family.score >= 90) {
    return {
      badge: "가족 실거주 적합",
      text: `${apartment.sizePyeong}평형대와 단지 성격이 자녀 포함 실거주 수요에 잘 맞아 가족 기준 점수가 높게 반영됐습니다.`,
    };
  }

  if (schoolPreference === "yes" && school.score >= 90) {
    return {
      badge: "학군 선호 반영",
      text: `학군 중요도를 높게 둔 조건에서 학교·학원 접근성 점수가 좋아 추천 순위가 올라온 케이스입니다.`,
    };
  }

  if (agePreference === "new" && age.score >= 88) {
    return {
      badge: "신축 선호 반영",
      text: `${apartment.buildYear}년 준공 기준으로 신축 선호 조건에 잘 맞고, 초기 수선 부담도 상대적으로 적은 편입니다.`,
    };
  }

  if (occupancyPreference === "immediate" && occupancy.score >= 90) {
    return {
      badge: "빠른 입주 유리",
      text: `즉시 진행이나 빠른 입주를 원하는 조건에서 현재 입주 상태가 유리하게 작용한 매물입니다.`,
    };
  }

  if (apartment.interiorStatus === "fresh") {
    return {
      badge: "인테리어 부담 적음",
      text: `신축급 또는 손볼 부분이 적은 상태라 초기 인테리어 비용 부담을 낮게 보고 접근하기 좋은 매물입니다.`,
    };
  }

  if (apartment.interiorStatus === "needsRenovation" && budget.score >= 70) {
    return {
      badge: "가격 대비 개선 여지",
      text: `연식은 있지만 예산 적합도가 나쁘지 않아 리모델링까지 포함한 전략으로 보면 매력이 있는 매물입니다.`,
    };
  }

  return {
    badge: "종합 밸런스 우수",
    text: `출퇴근, 예산, 생활 조건이 한쪽으로 치우치지 않고 전반적으로 균형 있게 맞아 상위권으로 올라온 매물입니다.`,
  };
}

export function getRecommendations(options: {
  workStationInput: string;
  budgetEok: number | null;
  householdPreference: HouseholdPreference;
  schoolPreference: SchoolPreference;
  agePreference: AgePreference;
  occupancyPreference: OccupancyPreference;
  commutePreference: CommutePreference;
}) {
  const {
    workStationInput,
    budgetEok,
    householdPreference,
    schoolPreference,
    agePreference,
    occupancyPreference,
    commutePreference,
  } = options;

  const matchedWorkStation = findStationByQuery(workStationInput);

  return APARTMENTS.map((apartment) => {
    const commute = calculateCommuteScore(workStationInput, apartment, commutePreference);
    const budget = calculateBudgetScore(budgetEok, apartment);
    const family = calculateFamilyScore(apartment, householdPreference);
    const school = calculateSchoolScore(apartment, schoolPreference);
    const age = calculateAgeScore(apartment, agePreference);
    const occupancy = calculateOccupancyScore(apartment, occupancyPreference);
    const interior = getInteriorEstimate(apartment);

    const totalScore = Math.round(
      commute.score * 0.36 +
        budget.score * 0.21 +
        family.score * 0.13 +
        school.score * 0.1 +
        age.score * 0.1 +
        occupancy.score * 0.1
    );

    const reason = getReasonSummary({
      apartment,
      workStationName: matchedWorkStation?.name ?? null,
      budgetEok,
      householdPreference,
      schoolPreference,
      agePreference,
      occupancyPreference,
      commute,
      budget,
      family,
      school,
      age,
      occupancy,
    });

    const result: RecommendationItem = {
      ...apartment,
      commute,
      budget,
      family,
      school,
      age,
      occupancyScore: occupancy,
      interior,
      totalScore,
      reasonBadge: reason.badge,
      reasonText: reason.text,
    };

    return result;
  }).sort((a, b) => b.totalScore - a.totalScore);
}