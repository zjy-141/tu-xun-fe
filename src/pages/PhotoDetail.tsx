import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import type { PhotoDetail, Story } from '../types';

export default function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<PhotoDetail | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [storyText, setStoryText] = useState('');
  const [postingStory, setPostingStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storyLoading, setStoryLoading] = useState(false);

  const photoId = Number(id);

  useEffect(() => {
    if (!photoId) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await photosApi.detail(photoId);
        if (res.data.success) setPhoto(res.data.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    const fetchStories = async () => {
      setStoryLoading(true);
      try {
        const res = await photosApi.getStories(photoId);
        if (res.data.success) setStories(res.data.data.stories);
      } catch {
        // ignore
      } finally {
        setStoryLoading(false);
      }
    };
    fetchDetail();
    fetchStories();
  }, [photoId]);

  const handlePostStory = async () => {
    if (!storyText.trim()) return;
    setPostingStory(true);
    try {
      await photosApi.postStory(photoId, { content: storyText });
      setStoryText('');
      // 刷新故事列表
      const res = await photosApi.getStories(photoId);
      if (res.data.success) setStories(res.data.data.stories);
    } catch {
      // ignore
    } finally {
      setPostingStory(false);
    }
  };

  if (loading) return <Loading />;
  if (!photo) return <div className="text-center py-20 text-text-light">图片不存在</div>;

  const canSubmit =
    user &&
    photo.author.id !== user.id &&
    !photo.current_user_attempt;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 图片展示 */}
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
        <div className="aspect-[16/9] sm:aspect-[2/1] bg-gray-100">
          <img
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-text">{photo.title}</h1>
              <p className="text-sm text-text-light mt-1">
                作者：{photo.author.name} · 发布于{' '}
                {new Date(photo.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {photo.solved ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  已破解
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                  待破解 · {photo.attempts_count} 次尝试
                </span>
              )}
            </div>
          </div>

          {photo.description && (
            <p className="mt-4 text-text leading-relaxed">{photo.description}</p>
          )}

          {/* 获奖者 */}
          {photo.winner && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
              🏆 <span className="font-medium">{photo.winner.name}</span> 已破解此机位！
            </div>
          )}

          {/* 当前用户答题状态 */}
          {photo.current_user_attempt && (
            <div className="mt-4 p-3 bg-bg rounded-lg text-sm">
              {photo.current_user_attempt.status === 'pending' && (
                <span className="text-accent-light">⏳ 你的答案正在审核中...</span>
              )}
              {photo.current_user_attempt.status === 'approved' &&
                (photo.current_user_attempt.is_winner ? (
                  <span className="text-green-600">🎉 恭喜！你是第一个破解此机位的人！</span>
                ) : (
                  <span className="text-text-light">✅ 你的答案已被确认，但奖品已被领走</span>
                ))}
              {photo.current_user_attempt.status === 'rejected' && (
                <span className="text-accent">❌ 你的答案未通过审核</span>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-6">
            {canSubmit && (
              <button
                onClick={() => navigate(`/photos/${photoId}/submit`)}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors"
              >
                我要答题
              </button>
            )}
            {user && user.id === photo.author.id && (
              <Link
                to={`/photos/${photoId}/my-attempts`}
                className="px-5 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-bg transition-colors"
              >
                查看答题记录
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 故事区域 */}
      <div className="mt-8 bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-bold text-text mb-4">
          📖 发现故事 ({stories.length})
        </h2>

        {/* 发布故事 */}
        {user && (
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="分享你发现这个角落的故事..."
              className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
            />
            <button
              onClick={handlePostStory}
              disabled={postingStory || !storyText.trim()}
              className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors shrink-0"
            >
              {postingStory ? '发布中...' : '发布'}
            </button>
          </div>
        )}

        {storyLoading ? (
          <Loading text="加载故事中..." />
        ) : stories.length === 0 ? (
          <p className="text-sm text-text-light text-center py-6">
            还没有故事，来分享第一个吧 ✨
          </p>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story.id} className="p-4 bg-bg rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                    {story.user_name.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-text">{story.user_name}</span>
                  <span className="text-xs text-text-light">
                    {new Date(story.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p className="text-sm text-text leading-relaxed">{story.content}</p>
                {story.media_url && (
                  <img
                    src={story.media_url}
                    alt="故事配图"
                    className="mt-2 rounded-lg max-h-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
