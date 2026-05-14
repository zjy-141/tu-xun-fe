import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { PhotoCard } from '../components/PhotoCard';
import { Pagination } from '../components/Pagination';
import { Loading } from '../components/Loading';
import { Empty } from '../components/Empty';
import type { PhotoListItem } from '../types';

export default function PhotoList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photos, setPhotos] = useState<PhotoListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page')) || 1;
  const solvedFilter = searchParams.get('solved');

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const params: { page: number; limit: number; solved?: boolean } = {
          page,
          limit: 12,
        };
        if (solvedFilter === 'true') params.solved = true;
        else if (solvedFilter === 'false') params.solved = false;

        const res = await photosApi.list(params);
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
    fetchPhotos();
  }, [page, solvedFilter]);

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
  };

  const handleFilterChange = (val: string) => {
    const params = new URLSearchParams();
    if (val) params.set('solved', val);
    setSearchParams(params);
  };

  return (
    <div>
      {/* 标题和筛选 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">发现机位</h1>
        <select
          value={solvedFilter || ''}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">全部</option>
          <option value="false">未破解</option>
          <option value="true">已破解</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : photos.length === 0 ? (
        <Empty
          icon="📷"
          title="暂无图片"
          description="还没有人投稿图片，快来成为第一个分享者吧！"
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
          <Pagination
            page={page}
            total={total}
            limit={12}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
