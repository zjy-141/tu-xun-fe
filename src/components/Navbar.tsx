import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <span className="text-xl">🔍</span>
          <span className="hidden sm:inline">挑战西交图寻</span>
        </Link>

        <div className="flex items-center gap-1 text-sm">
          <Link
            to="/photos"
            className="px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
          >
            发现
          </Link>
          {user ? (
            <>
              <Link
                to="/upload"
                className="px-3 py-2 rounded-lg text-primary font-medium hover:bg-primary/5 transition-colors"
              >
                投稿
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/photos"
                  className="px-3 py-2 rounded-lg text-accent-light font-medium hover:bg-accent-light/5 transition-colors"
                >
                  审核
                </Link>
              )}
              <Link
                to="/prizes"
                className="px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
              >
                奖品
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-bg transition-colors">
                  <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </span>
                  <span className="hidden sm:inline text-text">{user.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-40 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors"
                  >
                    个人中心
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-text-light hover:bg-bg transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
