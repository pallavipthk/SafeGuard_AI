import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import ErrorBoundary from '@/components/ErrorBoundary';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const DashboardLayout = lazy(() => import('@/components/dashboard/DashboardLayout'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const DashboardHome = lazy(() => import('@/pages/DashboardHome'));
const AIChat = lazy(() => import('@/pages/AIChat'));
const VisionRecognition = lazy(() => import('@/pages/VisionRecognition'));
const HazardReporting = lazy(() => import('@/pages/HazardReporting'));
const RiskPrediction = lazy(() => import('@/pages/RiskPrediction'));
const CityDashboard = lazy(() => import('@/pages/CityDashboard'));
const EmergencySOS = lazy(() => import('@/pages/EmergencySOS'));
const LearningHub = lazy(() => import('@/pages/LearningHub'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const SafetyScore = lazy(() => import('@/pages/SafetyScore'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Profile = lazy(() => import('@/pages/Profile'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-theme flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Suspense fallback={<LoadingFallback />}><ErrorBoundary>{children}</ErrorBoundary></Suspense>;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="chat" element={<AIChat />} />
          <Route path="vision" element={<VisionRecognition />} />
          <Route path="hazards" element={<HazardReporting />} />
          <Route path="risk" element={<RiskPrediction />} />
          <Route path="map" element={<CityDashboard />} />
          <Route path="sos" element={<EmergencySOS />} />
          <Route path="learning" element={<LearningHub />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="safety-score" element={<SafetyScore />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
