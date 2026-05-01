import { Download, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [admissionYear, setAdmissionYear] = useState('');

  async function load() {
    const params = admissionYear ? { admissionYear } : {};
    const { data } = await api.get('/applications', { params });
    setApplications(data.items);
  }

  useEffect(() => { load(); }, []);

  async function submit(id) {
    try {
      await api.post(`/applications/${id}/submit`);
      toast.success('Application submitted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit');
    }
  }

  async function downloadPdf(item) {
    const { data } = await api.get(`/applications/${item._id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.applicationId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">My Applications</h2>
        <p className="text-sm text-stone-500">Track drafts, pending applications, and admission decisions.</p>
      </div>
      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <input className="field max-w-40" type="number" min="1900" max={new Date().getFullYear() + 1} placeholder="Year" value={admissionYear} onChange={(e) => setAdmissionYear(e.target.value)} />
        <button className="btn-secondary" onClick={load}>Apply Filters</button>
      </div>
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed text-left text-sm">
            <thead className="bg-stone-100 text-stone-600">
              <tr>
                <th className="w-40 px-4 py-3">Application ID</th>
                <th className="w-28 px-4 py-3">Year</th>
                <th className="px-4 py-3">Name</th>
                <th className="w-36 px-4 py-3">Class</th>
                <th className="w-28 px-4 py-3">Status</th>
                <th className="w-32 px-4 py-3">Submitted</th>
                <th className="w-52 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {applications.map((item) => (
                <tr className="align-middle hover:bg-stone-50" key={item._id}>
                  <td className="px-4 py-3 font-semibold text-stone-900">{item.applicationId}</td>
                  <td className="px-4 py-3">{item.admissionYear || '-'}</td>
                  <td className="truncate px-4 py-3" title={item.fullName}>{item.fullName}</td>
                  <td className="px-4 py-3">{item.classApplyingFor}</td>
                  <td className="px-4 py-3"><Status value={item.status} /></td>
                  <td className="px-4 py-3 text-stone-600">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'Draft' && <button className="btn-secondary min-w-24 px-3" onClick={() => submit(item._id)}><Send size={15} /> Submit</button>}
                      <button className="btn-secondary min-w-20 px-3" onClick={() => downloadPdf(item)}><Download size={15} /> PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!applications.length && <tr><td className="px-4 py-8 text-center text-stone-500" colSpan="7">No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Status({ value }) {
  const tone = {
    Approved: 'bg-teal-100 text-teal-700',
    Pending: 'bg-amber-100 text-amber-700',
    Rejected: 'bg-red-100 text-red-700',
    Draft: 'bg-stone-100 text-stone-700'
  }[value] || 'bg-stone-100 text-stone-700';
  return <span className={`rounded px-2 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}
