import { useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { ImageUpload } from '../components/ImageUpload';

export default function SubmitAttempt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const photoId = Number(id);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [guessedLocation, setGuessedLocation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!imageFile) {
      setError('请上传匹配照片');
      return;
    }
    if (!guessedLocation.trim()) {
      setError('请描述你猜测的地点');
      return;
    }
    setSubmitting(true);
    try {
      const res = await photosApi.submitAttempt(photoId, {
        image: imageFile,
        guessed_location: guessedLocation.trim(),
      });
      if (res.data.success) {
        alert(res.data.data.message);
        navigate(`/photos/${photoId}`);
      }
    } catch (err: unknown) {
      const data = (err as { message?: string; code?: number });
      if (data.code === 5) {
        setError('你已有待审核的答题记录，请等待审核结果');
      } else {
        setError(data.message || '提交失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text mb-2">提交答案</h1>
      <p className="text-sm text-text-light mb-6">
        请在上传图片的<strong>同一地点、同一角度</strong>拍摄照片作为验证
      </p>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border space-y-5">
        {error && (
          <div className="bg-red-50 text-accent text-sm p-3 rounded-lg">{error}</div>
        )}

        <ImageUpload
          onFileSelect={setImageFile}
          label="上传匹配照片"
          hint="请在同一地点同一角度拍摄"
        />

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            猜测的地点 <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={guessedLocation}
            onChange={(e) => setGuessedLocation(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="如：主楼A座5楼东侧窗台"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
        >
          {submitting ? '提交中...' : '提交答案'}
        </button>
      </form>
    </div>
  );
}
