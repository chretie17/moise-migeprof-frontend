import React from 'react';
import Sidebar from '../../components/Sidebar';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        {/* Add admin-specific functionalities here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
