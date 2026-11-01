import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import ListingPage from './pages/ListingPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import NotFound from './pages/NotFound.jsx'
import './index.css'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ListingPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
