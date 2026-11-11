import React, { useState, useEffect } from "react";

interface SocialAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const SocialAvatar: React.FC<SocialAvatarProps> = ({
  src,
  name,
  className = "w-10 h-10 rounded-full object-cover",
  fallbackClassName = "w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm uppercase",
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return <div className={fallbackClassName}>{initial}</div>;
};

export default SocialAvatar;
