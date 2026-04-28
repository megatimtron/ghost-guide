/**
 * LazyImage — drop-in <img> with native lazy loading + WebP source preference.
 *
 * Usage pattern:
 *   <LazyImage src="/img/foo.jpg" webp="/img/foo.webp" alt="..." width={640} height={360} />
 *
 * Production tip: convert source images to .webp during build (or via
 *   `cwebp -q 80 input.jpg -o input.webp`). Keep .jpg/.png as <img> fallback for
 *   older browsers that do not support WebP. Always provide width/height to
 *   prevent layout shift on slow mobile networks.
 */
export default function LazyImage({
  src,
  webp,
  alt = '',
  width,
  height,
  className = '',
  sizes,
  ...rest
}) {
  return (
    <picture>
      {webp && <source srcSet={webp} type="image/webp" sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        {...rest}
      />
    </picture>
  );
}
