import Image from "next/image";

interface GalleryStripProps {
  images: string[];
}

export function GalleryStrip({ images }: GalleryStripProps) {
  if (images.length === 0) return null;

  // Duplicate images so the scroll loops seamlessly (first half scrolls off,
  // second half is identical — when it ends we're back at the start).
  const looped = [...images, ...images];

  return (
    <div className="-mx-4 my-8 overflow-hidden md:-mx-10 lg:-mx-16 xl:-mx-20">
      <div
        className="flex animate-gallery-scroll gap-1.5"
        style={{ width: "max-content" }}
        aria-hidden="true"
      >
        {looped.map((src, i) => (
          <div
            key={i}
            className="relative h-64 w-44 shrink-0 overflow-hidden md:h-80 md:w-56"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="224px"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
