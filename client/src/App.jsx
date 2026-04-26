import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AdminApplications from './pages/AdminApplications.jsx';
import AdmissionForm from './pages/AdmissionForm.jsx';
import Classes from './pages/Classes.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import MyApplications from './pages/MyApplications.jsx';
import Shell from './components/Shell.jsx';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminOnly({ children }) {
  const { user } = useAuth();
  return user?.role === 'admin' || user?.role === 'staff' ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Shell /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="apply" element={<AdmissionForm />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="admin/applications" element={<AdminOnly><AdminApplications /></AdminOnly>} />
        <Route path="admin/classes" element={<AdminOnly><Classes /></AdminOnly>} />
      </Route>
    </Routes>
  );
}
