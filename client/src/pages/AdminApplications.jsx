import { Download, FileSpreadsheet, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { Status } from './MyApplications.jsx';

export default function AdminApplications() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', admissionYear: '' });
  const [remark, setRemark] = useState('');

  async function load() {
    const { data } = await api.get('/applications', { params: filters });
    setRows(data.items);
  }

  useEffect(() => { load(); }, []);

  async function review(id, status) {
    try {
      await api.patch(`/applications/${id}/review`, { status, remark });
      setRemark('');
      toast.success(`Application ${status.toLowerCase()}`);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review failed');
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

  async function exportCsv() {
    const params = filters.admissionYear ? { admissionYear: filters.admissionYear } : {};
    const { data } = await api.get('/applications/export.csv', { params, responseType: 'blob' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filters.admissionYear ? `admission-applications-${filters.admissionYear}.csv` : 'admission-applications.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Application Review</h2>
          <p className="text-sm text-stone-500">Search, filter, approve, reject, export, and download PDFs.</p>
        </div>
        <button className="btn-primary" onClick={exportCsv}><FileSpreadsheet size={16} /> Export CSV</button>
      </div>
      <div className="panel grid gap-3 p-4 md:grid-cols-[1fr_160px_200px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-stone-400" size={17} />
          <input className="field pl-9" placeholder="Search application ID, student, phone, email" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <input className="field" type="number" min="1900" max={new Date().getFullYear() + 1} placeholder="Year" value={filters.admissionYear} onChange={(e) => setFilters({ ...filters, admissionYear: e.target.value })} />
        <select className="field" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option>Draft</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <button className="btn-secondary" onClick={load}>Apply Filters</button>
      </div>
      <div className="grid gap-4">
        {rows.map((item) => (
          <article className="panel p-4" key={item._id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{item.fullName}</h3>
                  <Status value={item.status} />
                  {item.duplicateWarning && <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Possible duplicate</span>}
                </div>
                <p className="mt-1 text-sm text-stone-500">{item.applicationId} - {item.admissionYear || '-'} - {item.classApplyingFor} - Parent: {item.parent?.name} ({item.parent?.phone})</p>
              </div>
              <button className="btn-secondary" onClick={() => downloadPdf(item)}><Download size={15} /> PDF</button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <input className="field" placeholder="Add remarks before approval/rejection" value={remark} onChange={(e) => setRemark(e.target.value)} />
              <button className="btn-primary" onClick={() => review(item._id, 'Approved')} disabled={item.status === 'Approved'}>Approve</button>
              <button className="btn-secondary text-red-700" onClick={() => review(item._id, 'Rejected')} disabled={item.status === 'Rejected'}>Reject</button>
            </div>
          </article>
        ))}
        {!rows.length && <div className="panel p-8 text-center text-stone-500">No applications match the current filters.</div>}
      </div>
    </div>
  );
}
