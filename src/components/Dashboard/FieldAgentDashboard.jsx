import React from 'react';
import Sidebar from '../../components/Sidebar';

const FieldAgentDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">Field Agent Dashboard</h2>
        {/* Add field agent-specific functionalities here */}
      </div>
    </div>
  );
};

export default FieldAgentDashboard;
