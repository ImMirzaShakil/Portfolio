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
    <section className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
      {heading ? <h2 className="text-2xl font-bold">{heading}</h2> : null}

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
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

      {(videoTitle || videoSubtitle) && (
        <div className="mx-auto max-w-2xl space-y-2">
          {videoTitle ? (
            <h3 className="text-xl font-bold sm:text-2xl">{videoTitle}</h3>
          ) : null}
          {videoSubtitle ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {videoSubtitle}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
