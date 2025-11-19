import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header>
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              Quiz Shop
            </Link>
            <ul>
              <li>
                <NavLink to="/">Produse</NavLink>
              </li>
              {user && (
                <>
                  <li>
                    <NavLink to="/cart">Coș</NavLink>
                  </li>
                  <li>
                    <NavLink to="/orders">Comenzile mele</NavLink>
                  </li>
                </>
              )}
              {user?.role === "ADMIN" && (
                <li>
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              )}
              {!user ? (
                <>
                  <li>
                    <NavLink to="/login">Autentificare</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register">Înregistrare</NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <button className="secondary-btn" onClick={handleLogout}>
                    Delogare
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
