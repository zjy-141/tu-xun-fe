import { useRef, useState } from 'react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string | null;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
}

export function ImageUpload({
  onFileSelect,
  preview: externalPreview,
  accept = 'image/jpeg,image/png',
  maxSizeMB = 20,
  label = '点击或拖拽上传图片',
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(externalPreview || null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setError('仅支持 JPG/PNG 格式');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSizeMB}MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40 hover:bg-bg'
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="预览"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-text font-medium">{label}</p>
            {hint && (
              <p className="text-xs text-text-light mt-1">{hint}</p>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && (
        <p className="text-accent text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
