import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_id: '',
    name: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.student_id || !form.name || !form.password || !form.email) {
      setError('请填写所有必填字段');
      return;
    }
    if (form.password.length < 6 || form.password.length > 20) {
      setError('密码长度需在 6-20 位之间');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message || '注册失败，请稍后重试';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-8">注册</h1>
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
          <label className="block text-sm font-medium text-text mb-1">昵称</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="给自己取个名字"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">校园邮箱</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="example@stu.xjtu.edu.cn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">密码</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="6-20 位密码"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
        >
          {submitting ? '注册中...' : '注册'}
        </button>
        <p className="text-center text-sm text-text-light">
          已有账号？{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            立即登录
          </Link>
        </p>
      </form>
    </div>
  );
}
