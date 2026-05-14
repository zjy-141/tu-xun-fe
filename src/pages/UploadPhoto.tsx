import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { ImageUpload } from '../components/ImageUpload';

export default function UploadPhoto() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationSecret, setLocationSecret] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!imageFile) {
      setError('请上传图片');
      return;
    }
    if (!title.trim()) {
      setError('请输入图片标题');
      return;
    }
    if (!locationSecret.trim()) {
      setError('请输入具体地点');
      return;
    }
    setSubmitting(true);
    try {
      const res = await photosApi.upload({
        image: imageFile,
        title: title.trim(),
        description: description.trim() || undefined,
        location_secret: locationSecret.trim(),
      });
      if (res.data.success) {
        navigate(`/photos/${res.data.data.id}`);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || '上传失败';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">投稿新机位</h1>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border space-y-5">
        {error && (
          <div className="bg-red-50 text-accent text-sm p-3 rounded-lg">{error}</div>
        )}

        <ImageUpload
          onFileSelect={setImageFile}
          label="上传机位照片"
          hint="支持 JPG/PNG，最大 20MB，建议长边 ≥ 1920px"
        />

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            图片标题 <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="如：晨光中的钱学森图书馆"
          />
          <p className="text-xs text-text-light mt-1">{title.length}/50</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            图片描述 / 背后的故事
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            placeholder="描述一下这张照片的故事..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            具体地点 <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={locationSecret}
            onChange={(e) => setLocationSecret(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="如：主楼A座5楼东侧窗台"
          />
          <p className="text-xs text-text-light mt-1">
            此信息仅管理员可见，用于审核答题
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
        >
          {submitting ? '提交中...' : '提交投稿'}
        </button>
      </form>
    </div>
  );
}
