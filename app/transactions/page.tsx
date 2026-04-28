"use client";

import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">페이지 준비 중</h1>
        <p className="text-slate-500 mb-6">이 페이지는 곧 업데이트될 예정이에요.</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
        >
          홈으로 돌아가기
        </button>
      </div>
    </main>
  );
}