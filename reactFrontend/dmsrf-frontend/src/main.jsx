// src/main.jsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router';
import { AuthProvider } from "./context/AuthContext.jsx";
import Spinner from './components/Spinner/Spinner.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense fallback={<Spinner></Spinner>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>
);
