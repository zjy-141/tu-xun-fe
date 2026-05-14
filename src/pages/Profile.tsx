import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">个人中心</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* 头像区域 */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-3">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-white/70 text-sm mt-1">{user.student_id}</p>
          {user.level >= 1 && (
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
              管理员
            </span>
          )}
        </div>

        {/* 功能列表 */}
        <div className="divide-y divide-border">
          <Link
            to="/prizes"
            className="flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <span className="text-text font-medium">我的奖品</span>
            </div>
            <span className="text-text-light">
              {user.prize_count ?? 0} 个 ›
            </span>
          </Link>
          <Link
            to="/upload"
            className="flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📸</span>
              <span className="text-text font-medium">投稿新机位</span>
            </div>
            <span className="text-text-light">›</span>
          </Link>
          <Link
            to="/photos"
            className="flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔍</span>
              <span className="text-text font-medium">浏览发现</span>
            </div>
            <span className="text-text-light">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
