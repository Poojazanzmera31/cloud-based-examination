import React from 'react';
import Layout from '../../components/Layout/Layout';

const DashboardLayout = ({ children, title }) => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
        {children}
      </div>
    </Layout>
  );
};

export default DashboardLayout;
