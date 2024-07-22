import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import FieldAgentDashboard from './components/Dashboard/FieldAgentDashboard';
import ManageFieldAgents from './adminPages/ManageFieldAgents';
import TrackActivities from './adminPages/ManagePrograms';
import UpdateContent from './adminPages/UpdateContent';
import ManageRegistrations from './adminPages/ManageRegistrations';
import ViewReports from './adminPages/ViewReports';
import AccessMaterials from './fieldAgentPages/AccessMaterials';
import RegisterFamilies from './fieldAgentPages/RegisterFamilies';
import TrackAttendance from './fieldAgentPages/TrackAttendance';
import SubmitReports from './fieldAgentPages/SubmitReports';
import PrivateRoute from './components/Auth/PrivateRoute';
import Sidebar from './components/Sidebar';
import './index.css'; // Import the CSS file here

const App = () => {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <div id="root">
        {role && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <PrivateRoute>
                  <AdminDashboard />
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
                <Navigate to={role === 'admin' ? "/dashboard/admin" : "/dashboard/field-agent"} />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
