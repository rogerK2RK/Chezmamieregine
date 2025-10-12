import { useEffect, useState } from "react";

export default function SafeImage({ src, alt = "", className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // reset à chaque nouveau src
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className="thumb-placeholder" aria-label="image indisponible">🍽️</div>;
  }

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      className={`${className} ${loaded ? "is-loaded" : "is-loading"}`}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      loading="eager"
      width={1600} height={1000}
    />
  );
}
