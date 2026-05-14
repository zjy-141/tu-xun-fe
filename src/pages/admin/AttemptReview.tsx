import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { Loading } from '../../components/Loading';
import { Empty } from '../../components/Empty';
import { Pagination } from '../../components/Pagination';
import type { PendingAttempt, ReviewAction, ReviewAttemptResponse } from '../../types';

export default function AttemptReview() {
  const [attempts, setAttempts] = useState<PendingAttempt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [result, setResult] = useState<ReviewAttemptResponse | null>(null);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingAttempts({ page, limit: 10 });
      if (res.data.success) {
        setAttempts(res.data.data.items);
        setTotal(res.data.data.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [page]);

  const handleReview = async (attemptId: number, action: ReviewAction) => {
    setReviewing(attemptId);
    setResult(null);
    try {
      const res = await adminApi.reviewAttempt(attemptId, {
        action,
        reject_reason: action === 'reject' ? rejectReason : undefined,
      });
      if (res.data.success) {
        setResult(res.data.data);
        setAttempts((prev) => prev.filter((a) => a.attempt_id !== attemptId));
        setRejectId(null);
        setRejectReason('');
      }
    } catch {
      // ignore
    } finally {
      setReviewing(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">审核答题记录</h1>

      {result && (
        <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-sm">
          <p className="font-medium text-green-800">{result.message}</p>
          <p className="text-green-600 mt-1">
            {result.is_winner ? '🏆 该用户获得奖品！' : '奖品已被他人领走'}
          </p>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : attempts.length === 0 ? (
        <Empty icon="✅" title="暂无待审核答题" description="所有答题已处理完毕" />
      ) : (
        <>
          <div className="space-y-4">
            {attempts.map((a) => (
              <div
                key={a.attempt_id}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex gap-4">
                  <img
                    src={a.image_url}
                    alt="答题照片"
                    className="w-28 h-28 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/photos/${a.photo_id}`}
                      className="font-semibold text-text hover:text-primary transition-colors"
                    >
                      {a.photo_title}
                    </Link>
                    <p className="text-sm text-text-light mt-1">
                      答题者：{a.user.name} · 提交时间：
                      {new Date(a.submitted_at).toLocaleString('zh-CN')}
                    </p>
                    <p className="text-sm bg-bg rounded-lg p-2 mt-2 text-text">
                      📍 猜测地点：{a.guessed_location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleReview(a.attempt_id, 'approve')}
                    disabled={reviewing === a.attempt_id}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {reviewing === a.attempt_id ? '处理中...' : '通过'}
                  </button>
                  <button
                    onClick={() =>
                      setRejectId(rejectId === a.attempt_id ? null : a.attempt_id)
                    }
                    className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    拒绝
                  </button>
                </div>

                {rejectId === a.attempt_id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="请输入拒绝原因（如：角度偏差较大）"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                    />
                    <button
                      onClick={() => handleReview(a.attempt_id, 'reject')}
                      disabled={reviewing === a.attempt_id || !rejectReason.trim()}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      确认拒绝
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            total={total}
            limit={10}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
