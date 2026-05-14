import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { Loading } from '../../components/Loading';
import { Empty } from '../../components/Empty';
import { Pagination } from '../../components/Pagination';
import type { PendingPhoto, ReviewAction } from '../../types';

export default function PhotoReview() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingPhotos({ page, limit: 10 });
      if (res.data.success) {
        setPhotos(res.data.data.items);
        setTotal(res.data.data.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [page]);

  const handleReview = async (photoId: number, action: ReviewAction) => {
    setReviewing(photoId);
    try {
      await adminApi.reviewPhoto(photoId, {
        action,
        reject_reason: action === 'reject' ? rejectReason : undefined,
      });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setRejectId(null);
      setRejectReason('');
    } catch {
      // ignore
    } finally {
      setReviewing(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">审核图片投稿</h1>

      {loading ? (
        <Loading />
      ) : photos.length === 0 ? (
        <Empty icon="✅" title="暂无待审核图片" description="所有投稿已处理完毕" />
      ) : (
        <>
          <div className="space-y-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/photos/${photo.id}`}
                      className="font-semibold text-text hover:text-primary transition-colors"
                    >
                      {photo.title}
                    </Link>
                    <p className="text-sm text-text-light mt-1">
                      作者：{photo.author.name} · 投稿时间：
                      {new Date(photo.created_at).toLocaleString('zh-CN')}
                    </p>
                    <p className="text-sm bg-bg rounded-lg p-2 mt-2 text-text">
                      📍 具体地点：{photo.location_secret}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleReview(photo.id, 'approve')}
                    disabled={reviewing === photo.id}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {reviewing === photo.id ? '处理中...' : '通过'}
                  </button>
                  <button
                    onClick={() =>
                      setRejectId(rejectId === photo.id ? null : photo.id)
                    }
                    className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    拒绝
                  </button>
                </div>

                {rejectId === photo.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="请输入拒绝原因"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                    />
                    <button
                      onClick={() => handleReview(photo.id, 'reject')}
                      disabled={reviewing === photo.id || !rejectReason.trim()}
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
