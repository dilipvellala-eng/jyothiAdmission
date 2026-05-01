import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-stone-500">Application totals, review progress, and seat availability.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats?.total} tone="stone" />
        <StatCard label="Approved" value={stats?.approved} />
        <StatCard label="Pending" value={stats?.pending} tone="gold" />
        <StatCard label="Rejected" value={stats?.rejected} tone="red" />
        <StatCard label="Drafts" value={stats?.drafts} tone="stone" />
      </div>
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="panel p-4">
          <h3 className="font-semibold">Applications by Class</h3>
          <div className="mt-4 space-y-3">
            {(stats?.byClass || []).map((item) => (
              <div key={item._id}>
                <div className="mb-1 flex justify-between text-sm"><span>{item._id}</span><span>{item.count}</span></div>
                <div className="h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-brand" style={{ width: `${Math.min(item.count * 10, 100)}%` }} /></div>
              </div>
            ))}
            {!stats?.byClass?.length && <p className="text-sm text-stone-500">No applications yet.</p>}
          </div>
        </div>
        <div className="panel p-4">
          <h3 className="font-semibold">Applications by Year</h3>
          <div className="mt-4 space-y-3">
            {(stats?.byYear || []).map((item) => (
              <div key={item._id || 'unknown'}>
                <div className="mb-1 flex justify-between text-sm"><span>{item._id || 'Unknown'}</span><span>{item.count}</span></div>
                <div className="h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-gold" style={{ width: `${Math.min(item.count * 10, 100)}%` }} /></div>
              </div>
            ))}
            {!stats?.byYear?.length && <p className="text-sm text-stone-500">No applications yet.</p>}
          </div>
        </div>
        <div className="panel p-4">
          <h3 className="font-semibold">Seat Availability</h3>
          <div className="mt-4 divide-y divide-stone-100">
            {(stats?.classes || []).map((item) => (
              <div className="flex items-center justify-between py-3" key={item._id}>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-stone-600">{item.availableSeats} of {item.totalSeats} available</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
