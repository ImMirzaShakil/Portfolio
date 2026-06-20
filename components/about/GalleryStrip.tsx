import Image from "next/image";

interface GalleryStripProps {
  images: string[];
}

export function GalleryStrip({ images }: GalleryStripProps) {
  if (images.length === 0) return null;

  // Build a mosaic: up to 5 visual columns.
  // If 7+ images, middle column becomes a 3-stack.
  // Otherwise, simple equal-width strips.
  const showMosaic = images.length >= 5;

  if (!showMosaic) {
    return (
      <div className="-mx-4 md:-mx-10 lg:-mx-16 xl:-mx-20 my-8 overflow-hidden">
        <div className="flex h-64 gap-0.5 md:h-80">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative flex-1 overflow-hidden"
              style={{ flexBasis: `${100 / images.length}%` }}
            >
              <Image
                src={src}
                alt={`Gallery photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mosaic layout for 5+ images:
  // Columns: [img0] [img1] [img2+img3+img4 stacked] [img5] [img6]
  const col0 = images[0];
  const col1 = images[1];
  const colMid = images.slice(2, 5);       // up to 3 stacked
  const col3 = images[5] ?? null;
  const col4 = images[6] ?? null;

  return (
    <div className="-mx-4 md:-mx-10 lg:-mx-16 xl:-mx-20 my-8 overflow-hidden">
      <div className="flex h-72 gap-0.5 md:h-96">
        {/* Col 0 */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={col0}
            alt="Gallery photo 1"
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>

        {/* Col 1 */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={col1}
            alt="Gallery photo 2"
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>

        {/* Middle stacked column */}
        <div className="flex flex-[0.75] flex-col gap-0.5 overflow-hidden">
          {colMid.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{ flex: 1 }}
            >
              <Image
                src={src}
                alt={`Gallery photo ${i + 3}`}
                fill
                className="object-cover"
                sizes="15vw"
              />
            </div>
          ))}
        </div>

        {/* Col 3 */}
        {col3 ? (
          <div className="relative flex-[1.2] overflow-hidden">
            <Image
              src={col3}
              alt="Gallery photo 6"
              fill
              className="object-cover"
              sizes="24vw"
            />
          </div>
        ) : null}

        {/* Col 4 */}
        {col4 ? (
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={col4}
              alt="Gallery photo 7"
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
