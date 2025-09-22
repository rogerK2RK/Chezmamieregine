export default function EyeToggle({
  open,
  onToggle,
  size = 26,
  titleOpen = 'Masquer le mot de passe',
  titleClosed = 'Afficher le mot de passe',
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? titleOpen : titleClosed}
      title={open ? titleOpen : titleClosed}
      className={`eye-btn ${open ? 'open' : 'closed'}`}
      style={{ width: size + 12, height: size + 12 }}
    >
      <svg
        className="eye-svg"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Forme de l’œil */}
        <defs>
          <clipPath id="eye-clip">
            <path d="M4,32 C12,18 22,12 32,12 C42,12 52,18 60,32 C52,46 42,52 32,52 C22,52 12,46 4,32 Z" />
          </clipPath>
        </defs>

        <path
          d="M4,32 C12,18 22,12 32,12 C42,12 52,18 60,32 C52,46 42,52 32,52 C22,52 12,46 4,32 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Iris + pupille */}
        <g clipPath="url(#eye-clip)">
          <circle cx="32" cy="32" r="10" fill="currentColor" opacity="0.15" />
          <circle className="pupil" cx="32" cy="32" r="5" fill="currentColor" />
        </g>

        {/* Paupières */}
        <g clipPath="url(#eye-clip)">
          <rect className="lid top" x="-2" y="-2" width="68" height="34" fill="currentColor" />
          <rect className="lid bottom" x="-2" y="32" width="68" height="34" fill="currentColor" />
        </g>

        {/* Trait barré (quand fermé) */}
        <path
          className="slash"
          d="M14 50 L50 14"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0"
        />
      </svg>
    </button>
  );
}
