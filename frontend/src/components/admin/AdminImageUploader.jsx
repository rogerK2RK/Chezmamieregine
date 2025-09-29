import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (acceptedFiles) => {
    if (!acceptedFiles?.length) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      acceptedFiles.forEach(f => fd.append('files', f));
      const { data } = await api.post('/uploads', fd, {
        headers: { ...authHeaderAdmin(), 'Content-Type': 'multipart/form-data' }
      });
      const newUrls = (data.files || []).map(f => f.url);
      onChange?.([...(value || []), ...newUrls]);
    } catch (e) {
      console.error('[UPLOAD ERROR]', e?.response?.data || e.message);
      setError(e?.response?.data?.message || 'Upload impossible');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(handleFiles, [value]); // eslint-disable-line

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  const removeAt = (idx) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange?.(next);
  };

  const move = (from, to) => {
    const next = [...value];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange?.(next);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: 10,
          padding: 16,
          textAlign: 'center',
          background: isDragActive ? 'rgba(79,70,229,0.15)' : 'transparent',
          cursor: 'pointer',
          color: '#e5e7eb'
        }}
      >
        <input {...getInputProps()} />
        {uploading ? 'Upload en cours…' : 'Glissez-déposez des images ici, ou cliquez pour importer'}
        {error && <div style={{ color: '#fca5a5', marginTop: 8 }}>{error}</div>}
      </div>

      {!!(value?.length) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 10, marginTop: 12
        }}>
          {value.map((url, idx) => (
            <div key={url + idx} style={{
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, overflow: 'hidden'
            }}>
              <img src={url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              <div style={{ display: 'flex', gap: 6, position: 'absolute', bottom: 6, right: 6 }}>
                <button
                  type="button"
                  onClick={() => move(idx, Math.max(0, idx - 1))}
                  style={chipBtn}
                  disabled={idx === 0}
                  title="Monter"
                >↑</button>
                <button
                  type="button"
                  onClick={() => move(idx, Math.min(value.length - 1, idx + 1))}
                  style={chipBtn}
                  disabled={idx === value.length - 1}
                  title="Descendre"
                >↓</button>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  style={{ ...chipBtn, background: 'rgba(239,68,68,0.65)' }}
                  title="Supprimer"
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const chipBtn = {
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  padding: '6px 8px',
  borderRadius: 6,
  cursor: 'pointer'
};
