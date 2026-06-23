import { useState } from 'react';

// Image avec repli si l'URL échoue.
export default function SafeImage({ src, alt = '', fallback = null, ...rest }) {
  const [err, setErr] = useState(false);
  if (err || !src) return fallback;
  return <img src={src} alt={alt} onError={() => setErr(true)} {...rest} />;
}
