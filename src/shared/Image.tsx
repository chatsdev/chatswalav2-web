/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ImagePath, ROUTES } from "@/src/constants";
import { ImageProps } from "@/src/types/shared";
import { getResolvedImageUrl } from "@/src/utils/image";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState, type FC } from "react";

import { getUrlWithBasePath } from "@/src/utils";

const Images: FC<ImageProps> = ({ src, fallbackSrc, alt, className = "", ...rest }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [prevSrc, setPrevSrc] = useState<any>(null);
  const pathname = usePathname();
  const isLanding = pathname.match(ROUTES.Landing);

  const defaultPlaceholder = isLanding ? `${ImagePath}/default3.png` : `${ImagePath}/default3.png`;

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const resolveImageSource = useMemo(() => {
    return getResolvedImageUrl(src, fallbackSrc);
  }, [src, fallbackSrc]);

  const displaySrc = useMemo(() => {
    const resolved = hasError ? (fallbackSrc || defaultPlaceholder) : resolveImageSource;
    if (resolved && resolved.startsWith("/") && !resolved.startsWith("//")) {
      return getUrlWithBasePath(resolved);
    }
    return resolved;
  }, [hasError, resolveImageSource, fallbackSrc, defaultPlaceholder]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const imageProps = {
    src: displaySrc,
    alt: alt || "image",
    onError: handleError,
    className: `${className}${hasError ? "" : ""}`,
    unoptimized: rest.unoptimized !== undefined ? rest.unoptimized : true,
    priority: rest.priority,
    ...rest,
  };

  if (rest.fill) {
    delete (imageProps as any).width;
    delete (imageProps as any).height;
  } else {
    imageProps.width = rest.width || 100;
    imageProps.height = rest.height || 100;
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...(imageProps as any)} />;
};

export default Images;
