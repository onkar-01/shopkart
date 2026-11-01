import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-5">
        <Outlet />
      </main>
    </div>
  )
}
