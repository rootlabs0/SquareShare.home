// Custom UI for "The marketplace": the Square Share gallery screenshot, shown in
// full at its natural aspect ratio so nothing is cropped. The wrapper only frames
// it (border + rounded corners); the image sets its own height.
export default function FeedMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/squareshare1.webp"
        alt="Square Share photo marketplace gallery"
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}
