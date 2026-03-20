import { CSSProperties } from 'react';

interface AvatarInitialsProps {
  initials: string;
  bgColor: string;
  size?: number;
  first?: boolean;
}

export function AvatarInitials({ initials, bgColor, size = 32, first = false }: AvatarInitialsProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: bgColor,
    border: '2px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 700,
    color: 'white',
    flexShrink: 0,
    marginLeft: first ? 0 : -10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: first ? 30 : 20,
    userSelect: 'none',
    transition: 'transform 0.2s ease',
  };

  return (
    <div 
      className="avatar-initials hover:scale-110 cursor-default"
      style={style}
    >
      <span style={{ transform: 'translateY(-0.5px)' }}>{initials}</span>
    </div>
  );
}
