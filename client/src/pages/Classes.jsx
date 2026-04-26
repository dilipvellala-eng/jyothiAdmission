import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', totalSeats: 40, filledSeats: 0 });

  async function load() {
    const { data } = await api.get('/classes');
    setClasses(data);
  }

  useEffect(() => { load(); }, []);

  async function save(event) {
    event.preventDefault();
    try {
      await api.post('/classes', form);
      setForm({ name: '', totalSeats: 40, filledSeats: 0 });
      toast.success('Class saved');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save class');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Classes and Seats</h2>
        <p className="text-sm text-stone-500">Manage class availability used during application review.</p>
      </div>
      <form className="panel grid gap-3 p-4 md:grid-cols-[1fr_160px_160px_auto]" onSubmit={save}>
        <input className="field" placeholder="Class name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="field" type="number" min="0" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: Number(e.target.value) })} />
        <input className="field" type="number" min="0" value={form.filledSeats} onChange={(e) => setForm({ ...form, filledSeats: Number(e.target.value) })} />
        <button className="btn-primary"><Save size={16} /> Save</button>
      </form>
      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600"><tr><th className="px-4 py-3">Class</th><th>Total Seats</th><th>Filled</th><th>Available</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {classes.map((item) => <tr key={item._id}><td className="px-4 py-3 font-semibold">{item.name}</td><td>{item.totalSeats}</td><td>{item.filledSeats}</td><td>{item.availableSeats}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
