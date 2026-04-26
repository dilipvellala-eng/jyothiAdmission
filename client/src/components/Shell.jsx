import React from 'react';
import { ClipboardList, FilePlus2, GraduationCap, LayoutDashboard, LogOut, School } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navBase = 'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium';

export default function Shell() {
  const { user, logout } = useAuth();
  const isReviewer = user?.role === 'admin' || user?.role === 'staff';

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img className="h-12 w-12 rounded-full object-contain" src="/logo.png" alt="Jyothi Educational Society logo" />
            <div>
              <h1 className="text-lg font-bold">Jyothi E.M. School</h1>
              <p className="text-xs text-stone-500">{user?.name} - {user?.role}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink className={({ isActive }) => `${navBase} ${isActive ? 'bg-teal-50 text-brand' : 'text-stone-700 hover:bg-stone-100'}`} to="/">
              <LayoutDashboard size={17} /> Dashboard
            </NavLink>
            <NavLink className={({ isActive }) => `${navBase} ${isActive ? 'bg-teal-50 text-brand' : 'text-stone-700 hover:bg-stone-100'}`} to="/apply">
              <FilePlus2 size={17} /> Apply
            </NavLink>
            <NavLink className={({ isActive }) => `${navBase} ${isActive ? 'bg-teal-50 text-brand' : 'text-stone-700 hover:bg-stone-100'}`} to="/applications">
              <ClipboardList size={17} /> My Applications
            </NavLink>
            {isReviewer && (
              <NavLink className={({ isActive }) => `${navBase} ${isActive ? 'bg-teal-50 text-brand' : 'text-stone-700 hover:bg-stone-100'}`} to="/admin/applications">
                <GraduationCap size={17} /> Review
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink className={({ isActive }) => `${navBase} ${isActive ? 'bg-teal-50 text-brand' : 'text-stone-700 hover:bg-stone-100'}`} to="/admin/classes">
                <School size={17} /> Classes
              </NavLink>
            )}
            <button className="btn-secondary" onClick={logout}><LogOut size={16} /> Logout</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
