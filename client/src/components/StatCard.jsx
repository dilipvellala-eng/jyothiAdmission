import React from 'react';

export default function StatCard({ label, value, tone = 'teal' }) {
  const tones = {
    teal: 'border-teal-200 bg-teal-50 text-brand',
    gold: 'border-amber-200 bg-amber-50 text-amber-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    stone: 'border-stone-200 bg-white text-stone-800'
  };

  return (
    <div className={`rounded-md border p-4 ${tones[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value ?? 0}</p>
    </div>
  );
}
