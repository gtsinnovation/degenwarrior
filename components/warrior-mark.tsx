export function WarriorMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="warriorGlowSite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff66" />
          <stop offset="100%" stopColor="#00b34a" />
        </linearGradient>
      </defs>
      <path
        d="M24 6c-9 0-16 7-16 16v8c0 2 1.5 3 3 3h26c1.5 0 3-1 3-3v-8c0-9-7-16-16-16z"
        fill="#050505"
        stroke="url(#warriorGlowSite)"
        strokeWidth="2"
      />
      <rect x="14" y="22" width="7" height="3" rx="1.5" fill="#00ff66" />
      <rect x="27" y="22" width="7" height="3" rx="1.5" fill="#00ff66" />
      <path d="M16 30 Q24 36 32 30" stroke="url(#warriorGlowSite)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="24" y1="6" x2="24" y2="16" stroke="url(#warriorGlowSite)" strokeWidth="2" />
    </svg>
  );
}
