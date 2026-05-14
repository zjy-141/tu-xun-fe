import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { Loading } from '../components/Loading';
import { Empty } from '../components/Empty';
import type { MyAttemptsData } from '../types';

export default function MyAttempts() {
  const { id } = useParams<{ id: string }>();
  const photoId = Number(id);
  const [data, setData] = useState<MyAttemptsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await photosApi.myAttempts(photoId);
        if (res.data.success) setData(res.data.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [photoId]);

  if (loading) return <Loading />;
  if (!data) return <div className="text-center py-20 text-text-light">加载失败</div>;

  const statusLabel = (status: string) => {
    const map: Record<string, { text: string; color: string }> = {
      pending: { text: '审核中', color: 'bg-yellow-100 text-yellow-700' },
      approved: { text: '已通过', color: 'bg-green-100 text-green-700' },
      rejected: { text: '已拒绝', color: 'bg-red-100 text-red-700' },
    };
    return map[status] || { text: status, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">我的答题记录</h1>

      {data.my_attempts.length === 0 ? (
        <Empty icon="📝" title="暂无答题记录" description="你还没有提交过答案" />
      ) : (
        <div className="space-y-4">
          {data.my_attempts.map((attempt) => {
            const s = statusLabel(attempt.status);
            return (
              <div
                key={attempt.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={attempt.image_url}
                    alt="答题照片"
                    className="w-24 h-24 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}
                      >
                        {s.text}
                      </span>
                      {attempt.is_winner && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          🏆 获奖
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text">
                      猜测地点：{attempt.guessed_location}
                    </p>
                    {attempt.reviewed_at && (
                      <p className="text-xs text-text-light mt-1">
                        审核时间：{new Date(attempt.reviewed_at).toLocaleString('zh-CN')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
