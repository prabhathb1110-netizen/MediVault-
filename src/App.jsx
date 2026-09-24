import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { RequireAuth, useAuth } from './auth.jsx';
import Search from './pages/Search.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="site-header">
      <div className="container bar">
        <Link to="/" className="brand">
          <span className="brand-mark">+</span>MediVault
        </Link>
        <nav>
          <NavLink to="/" end>Find medicine</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <span className="who">{user.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login">Staff login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container">MediVault - Medicine Availability Management System</div>
      </footer>
    </>
  );
}
