import { useEffect, useState } from 'react';
import { prizesApi } from '../api/prizes';
import { Loading } from '../components/Loading';
import { Empty } from '../components/Empty';
import type { Prize } from '../types';

export default function MyPrizes() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">我的奖品</h1>

      {prizes.length === 0 ? (
        <Empty
          icon="🎁"
          title="暂无奖品"
          description="答对机位后即可获得纪念奖品，加油！"
        />
      ) : (
        <div className="space-y-4">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="bg-card rounded-xl border border-border p-5 flex items-center gap-4"
            >
              <div className="text-3xl shrink-0">
                {prize.status === 'claimed' ? '✅' : '🎁'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text">{prize.prize_type}</h3>
                <p className="text-sm text-text-light">
                  来源：{prize.photo_title}
                </p>
                <p className="text-xs text-text-light mt-1">
                  获得时间：{new Date(prize.awarded_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                  prize.status === 'claimed'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {prize.status === 'claimed' ? '已领取' : '待领取'}
              </span>
            </div>
          ))}

          <div className="p-4 bg-primary/5 rounded-xl text-sm text-text-light">
            💡 待领取的奖品请携带校园卡线下领取，具体时间和地点请关注活动通知。
          </div>
        </div>
      )}
    </div>
  );
}
