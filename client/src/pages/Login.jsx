import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'admin@school.test', phone: '', password: 'Admin@12345' });

  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register({ ...form, role: 'parent' });
      toast.success('Welcome');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8fb] px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-md border border-sky-100 bg-white shadow-xl md:grid-cols-[1fr_420px]">
        <div className="flex min-h-[540px] flex-col justify-between bg-gradient-to-br from-sky-700 via-teal-700 to-red-700 p-8 text-white">
          <div className="flex items-center gap-3">
            <img className="h-20 w-20 rounded-full bg-white object-contain p-1 shadow-md" src="/logo.png" alt="Jyothi Educational Society logo" />
            <div>
              <span className="block text-2xl font-bold">Jyothi E.M. School</span>
              <span className="text-sm font-medium text-sky-50">Nehru Nagar, Dhone</span>
            </div>
          </div>
          <div>
            <p className="mb-3 inline-flex rounded bg-white/15 px-3 py-1 text-sm font-semibold">Admission Management Portal</p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight">Simple, secure admissions for pupils, parents, and school staff.</h1>
            <p className="mt-4 max-w-lg text-sky-50">Submit applications, maintain admission records, review documents, and track every decision from one school-branded system.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-md bg-white/15 p-3 font-semibold">Online Forms</div>
            <div className="rounded-md bg-white/15 p-3 font-semibold">Status Review</div>
            <div className="rounded-md bg-white/15 p-3 font-semibold">PDF Records</div>
          </div>
        </div>
        <form className="p-6 sm:p-8" onSubmit={submit}>
          <h2 className="text-2xl font-bold text-stone-900">{mode === 'login' ? 'Sign in to admissions' : 'Create parent account'}</h2>
          <p className="mt-1 text-sm text-stone-500">Access Jyothi E.M. School admission records and application status.</p>
          <div className="mt-6 space-y-4">
            {mode === 'register' && (
              <>
                <div><label className="label">Name</label><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="label">Phone</label><input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </>
            )}
            <div><label className="label">Email</label><input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="label">Password</label><input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          </div>
          <button className="btn-primary mt-6 w-full" type="submit">{mode === 'login' ? 'Sign in' : 'Register'}</button>
          <button className="mt-4 text-sm font-medium text-brand" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Create a parent/student account' : 'Already have an account? Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
