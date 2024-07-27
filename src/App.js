import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import DashboardAdmin from './adminPages/Dashboard';
import FieldAgentDashboard from './components/Dashboard/FieldAgentDashboard';
import ManageFieldAgents from './adminPages/ManageFieldAgents';
import TrackActivities from './adminPages/ManagePrograms';
import UpdateContent from './adminPages/UpdateContent';
import ManageRegistrations from './adminPages/ManageRegistrations';
import ViewReports from './adminPages/ViewReports';
import AccessMaterials from './fieldAgentPages/AccessMaterials';
import RegisterFamilies from './fieldAgentPages/RegisterFamilies';
import ManageFamilies from './adminPages/ManageFamilies';
import ManageAttendance from './adminPages/Attendance';
import ManageFeedback from './adminPages/AllFeedbacks';
import SubmitFeedback from './fieldAgentPages/Feedback';
import TrackAttendance from './fieldAgentPages/TrackAttendance';
import SubmitReports from './fieldAgentPages/SubmitReports';
import PrivateRoute from './components/Auth/PrivateRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Main />
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

const Main = () => {
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem('role');

  return (
    <div id="root">
      {isAuthenticated && (
        <>
          <Sidebar role={role} />
          <Navbar />
        </>
      )}
      <div className="main-content" style={{ marginLeft: isAuthenticated ? 240 : 0, marginTop: isAuthenticated ? 64 : 0 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-field-agents"
            element={
              <PrivateRoute>
                <ManageFieldAgents />
              </PrivateRoute>
            }
          />
          <Route
            path="/track-activities"
            element={
              <PrivateRoute>
                <TrackActivities />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-content"
            element={
              <PrivateRoute>
                <UpdateContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-registrations"
            element={
              <PrivateRoute>
                <ManageRegistrations />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-feedbacks"
            element={
              <PrivateRoute>
                <ManageFeedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-attendance"
            element={
              <PrivateRoute>
                <ManageAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-families"
            element={
              <PrivateRoute>
                <ManageFamilies />
              </PrivateRoute>
            }
          />
          <Route
            path="/view-reports"
            element={
              <PrivateRoute>
                <ViewReports />
              </PrivateRoute>
            }
          />

          {/* Field Agent Routes */}
          <Route
            path="/dashboard/field-agent"
            element={
              <PrivateRoute>
                <FieldAgentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/access-materials"
            element={
              <PrivateRoute>
                <AccessMaterials />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-feedback"
            element={
              <PrivateRoute>
                <SubmitFeedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/register-families"
            element={
              <PrivateRoute>
                <RegisterFamilies />
              </PrivateRoute>
            }
          />
          <Route
            path="/track-attendance"
            element={
              <PrivateRoute>
                <TrackAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-reports"
            element={
              <PrivateRoute>
                <SubmitReports />
              </PrivateRoute>
            }
          />

          {/* Redirect to the appropriate dashboard based on role */}
          <Route
            path="*"
            element={
              <Navigate to={role === 'admin' ? '/dashboard/admin' : '/dashboard/field-agent'} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
