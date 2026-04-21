import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiBookOpen,
  FiCheckSquare,
  FiAward,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/admin/users', icon: FiUsers, label: 'Manage Users' },
          { path: '/admin/exams', icon: FiFileText, label: 'Manage Exams' },
          { path: '/admin/results', icon: FiAward, label: 'View Results' },
        ];
      case 'faculty':
        return [
          { path: '/faculty/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/faculty/create-exam', icon: FiBookOpen, label: 'Create Exam' },
          { path: '/faculty/my-exams', icon: FiFileText, label: 'My Exams' },
          { path: '/faculty/results', icon: FiBarChart2, label: 'View Results' },
        ];
      case 'student':
        return [
          { path: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/student/exams', icon: FiCheckSquare, label: 'Available Exams' },
          { path: '/student/results', icon: FiAward, label: 'My Results' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ExamPortal
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cloud Examination System
            </p>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2026 ExamPortal
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
