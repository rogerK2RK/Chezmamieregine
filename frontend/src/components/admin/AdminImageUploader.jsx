import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import apiAdmin from '../../services/apiAdmin';
import authHeaderAdmin from '../../services/authHeaderAdmin';
import './style.css';

export default function AdminImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Upload des fichiers sélectionnés
  const handleFiles = async (acceptedFiles) => {
    if (!acceptedFiles?.length) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      acceptedFiles.forEach(f => fd.append('files', f));
      const { data } = await apiAdmin.post('/uploads', fd, {
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
    <div className="uploader-container">
      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? 'Upload en cours…' : 'Glissez-déposez des images ici, ou cliquez pour importer'}
        {error && <div className="error-text">{error}</div>}
      </div>

      {/* Grille d’aperçus */}
      {!!(value?.length) && (
        <div className="thumbs-grid">
          {value.map((url, idx) => (
            <div key={url + idx} className="thumb-item">
              <img src={url} alt="" className="thumb-img" />
              <div className="thumb-actions">
                <button
                  type="button"
                  onClick={() => move(idx, Math.max(0, idx - 1))}
                  className="chip-btn"
                  disabled={idx === 0}
                  title="Monter"
                >↑</button>
                <button
                  type="button"
                  onClick={() => move(idx, Math.min(value.length - 1, idx + 1))}
                  className="chip-btn"
                  disabled={idx === value.length - 1}
                  title="Descendre"
                >↓</button>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="chip-btn delete"
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
