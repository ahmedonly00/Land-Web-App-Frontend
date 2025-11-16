import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

// Create a browser router with future flags
const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <App />
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

// Add case-insensitive path handling
const originalPush = window.history.pushState;
window.history.pushState = function(state, title, url) {
  return originalPush.call(this, state, title, url && typeof url === 'string' ? url.toLowerCase() : url);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>,
)
