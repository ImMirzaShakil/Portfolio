import { getYouTubeEmbedUrl } from "@/lib/youtube";

interface HomeVideoSectionProps {
  sectionTitle?: string | null;
  youtubeUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

export function HomeVideoSection({
  sectionTitle,
  youtubeUrl,
  title,
  subtitle,
}: HomeVideoSectionProps) {
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  if (!embedUrl) return null;

  const heading = sectionTitle?.trim() || null;
  const videoTitle = title?.trim() || null;
  const videoSubtitle = subtitle?.trim() || null;

  return (
    <section className="space-y-8">
      {heading ? <h2 className="text-2xl font-bold">{heading}</h2> : null}

      {(videoTitle || videoSubtitle) && (
        <div className="space-y-2">
          {videoTitle ? (
            <h3 className="text-xl font-bold sm:text-2xl">{videoTitle}</h3>
          ) : null}
          {videoSubtitle ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {videoSubtitle}
            </p>
          ) : null}
        </div>
      )}

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
        <iframe
          src={embedUrl}
          title={videoTitle || heading || "Homepage video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
