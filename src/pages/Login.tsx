import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ student_id: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.student_id || !form.password) {
      setError('学号或密码不能为空');
      return;
    }
    setSubmitting(true);
    try {
      await login(form);
      navigate('/');
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message || '登录失败，请检查学号和密码';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-8">登录</h1>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border space-y-4">
        {error && (
          <div className="bg-red-50 text-accent text-sm p-3 rounded-lg">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-text mb-1">学号</label>
          <input
            type="text"
            value={form.student_id}
            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="请输入学号"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">密码</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="请输入密码"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
        >
          {submitting ? '登录中...' : '登录'}
        </button>
        <p className="text-center text-sm text-text-light">
          还没有账号？{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            立即注册
          </Link>
        </p>
      </form>
    </div>
  );
}
