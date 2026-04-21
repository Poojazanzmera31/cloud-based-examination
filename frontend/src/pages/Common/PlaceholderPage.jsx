import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';

const PlaceholderPage = ({ title, description }) => {
  return (
    <DashboardLayout title={title}>
      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
        <p className="text-sm text-gray-500 mt-4">This page is under construction.</p>
      </div>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
