interface GalleryStripProps {
  images: string[];
}

const STRIP_HEIGHT = "h-64 md:h-80";

export function GalleryStrip({ images }: GalleryStripProps) {
  if (images.length === 0) return null;

  // Duplicate images so the scroll loops seamlessly (first half scrolls off,
  // second half is identical — when it ends we're back at the start).
  const looped = [...images, ...images];

  return (
    <div className="-mx-4 my-8 overflow-hidden md:-mx-10 lg:-mx-16 xl:-mx-20">
      <div
        className="flex animate-gallery-scroll"
        style={{ width: "max-content" }}
        aria-hidden="true"
      >
        {looped.map((src, i) => (
          // Fixed height, auto width — preserves each photo's aspect ratio.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className={`${STRIP_HEIGHT} w-auto max-w-none shrink-0`}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}
