// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ValidateTokenPage } from '@/pages/ValidateTokenPage';

import { ProfilePage } from '@/pages/ProfilePage';
import { store, persistor } from '@/store';
import { useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import ItemsPage from '@/pages/ItemsPage';
import ProductManagement from '@/pages/ProductManagementPage';

const AppContent: React.FC = () => {
  const { theme } = useTheme();


  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* Add more routes as needed */}
          <Route path="/items" element={
              <ProtectedRoute>
                <Layout/>
              </ProtectedRoute>
            } >
            <Route index element={<ItemsPage />} />
          </Route>

          <Route 
            path="/validate-token" 
            element={
              <ValidateTokenPage
              />
            } 
          />

          <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
        <Route index element={<ProfilePage />} />
        </Route>



      <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<ProductManagement />} />
        </Route>




        </Routes>

      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={true}
        pauseOnFocusLoss={true}
        pauseOnHover={true}
        theme={theme}
        className="toast-container"
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;