import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Layout({ children }) {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-purple-600">
            Sweet Shop Management System
          </h1>

          <nav className="flex items-center gap-4">
            {!token ? (
              <>
                <Link className="text-gray-600 hover:text-purple-600" to="/login">
                  Login
                </Link>
                <Link className="text-gray-600 hover:text-purple-600" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link className="text-gray-600 hover:text-purple-600" to="/dashboard">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
