import { useEffect, useState } from 'react';
import { prizesApi } from '../../api/prizes';
import { adminApi } from '../../api/admin';
import { Loading } from '../../components/Loading';
import { Empty } from '../../components/Empty';
import type { Prize } from '../../types';

export default function PrizeClaim() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  const fetchPrizes = async () => {
    setLoading(true);
    try {
      const res = await prizesApi.getMyPrizes();
      if (res.data.success) setPrizes(res.data.data.prizes);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const handleClaim = async (prizeId: number) => {
    setClaiming(prizeId);
    try {
      await adminApi.claimPrize(prizeId);
      setPrizes((prev) =>
        prev.map((p) =>
          p.id === prizeId ? { ...p, status: 'claimed' as const } : p
        )
      );
    } catch {
      // ignore
    } finally {
      setClaiming(null);
    }
  };

  if (loading) return <Loading />;

  // 按状态分组
  const unclaimed = prizes.filter((p) => p.status === 'unclaimed');
  const claimed = prizes.filter((p) => p.status === 'claimed');

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">奖品发放管理</h1>

      {prizes.length === 0 ? (
        <Empty icon="🎁" title="暂无奖品记录" />
      ) : (
        <div className="space-y-8">
          {/* 待领取 */}
          {unclaimed.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text mb-3">
                ⏳ 待领取 ({unclaimed.length})
              </h2>
              <div className="space-y-3">
                {unclaimed.map((prize) => (
                  <div
                    key={prize.id}
                    className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-text">{prize.prize_type}</p>
                      <p className="text-sm text-text-light">
                        来源：{prize.photo_title} ·{' '}
                        {new Date(prize.awarded_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleClaim(prize.id)}
                      disabled={claiming === prize.id}
                      className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors shrink-0"
                    >
                      {claiming === prize.id ? '处理中...' : '标记已领取'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 已领取 */}
          {claimed.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text mb-3">
                ✅ 已领取 ({claimed.length})
              </h2>
              <div className="space-y-3">
                {claimed.map((prize) => (
                  <div
                    key={prize.id}
                    className="bg-card rounded-xl border border-border p-4 opacity-60"
                  >
                    <p className="font-medium text-text">{prize.prize_type}</p>
                    <p className="text-sm text-text-light">
                      来源：{prize.photo_title} ·{' '}
                      {new Date(prize.awarded_at).toLocaleDateString('zh-CN')}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      已领取
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
