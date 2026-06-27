// A stop on the pixel timeline. The dotted line is over-extended past the panel
// edges so adjacent panels join into one continuous path across the band; the
// acid square is the node that sits on it. Decorative.
export default function TimelineNode() {
  return (
    <div aria-hidden="true" className="relative h-2">
      <span className="future-timeline-line absolute -left-8 -right-8 top-1/2 h-[3px] -translate-y-1/2 md:-left-10 md:-right-10" />
      <span className="relative z-10 block h-2 w-2 bg-acid" />
    </div>
  );
}
