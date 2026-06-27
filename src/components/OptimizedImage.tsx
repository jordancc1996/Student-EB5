interface OptimizedImageProps {
  src: string | { src: string };
  alt: string;
  webpSrc?: string | { src: string };
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'low' | 'high' | 'auto';
  title?: string;
  sizes?: string;
}

function resolveAssetSrc(value: string | { src: string }): string {
  return typeof value === 'string' ? value : value.src;
}

/**
 * OptimizedImage component with WebP support via <picture> element.
 * 
 * For Vite-imported assets: pass both `src` (jpg) and `webpSrc` (webp import).
 * For public/ images: WebP source is auto-generated from the path.
 * 
 * Uses <picture> for format negotiation — browsers pick WebP when supported,
 * falling back to JPEG/PNG for older browsers.
 */
const OptimizedImage = ({
  src,
  alt,
  webpSrc,
  className = '',
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'low',
  title,
  sizes = '100vw',
}: OptimizedImageProps) => {
  const resolvedSrc = resolveAssetSrc(src);
  // Only use WebP when explicitly provided (no auto path conversion).
  const resolvedWebpSrc = webpSrc ? resolveAssetSrc(webpSrc).trim() : undefined;
  const hasWebpVariant = Boolean(resolvedWebpSrc);

  const mimeType = resolvedSrc.match(/\.png$/i) ? 'image/png' : resolvedSrc.match(/\.webp$/i) ? 'image/webp' : 'image/jpeg';

  return (
    <picture>
      {hasWebpVariant && (
        <source
          srcSet={resolvedWebpSrc}
          type="image/webp"
          sizes={sizes}
        />
      )}
      <source srcSet={resolvedSrc} type={mimeType} sizes={sizes} />
      <img
        src={resolvedSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        title={title}
      />
    </picture>
  );
};

export default OptimizedImage;
