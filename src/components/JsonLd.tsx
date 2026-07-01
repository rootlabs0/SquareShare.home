// Renders a JSON-LD structured-data block. The payload is developer-authored
// static data (never user input), so serialising it is safe; we still escape "<"
// so the JSON can never break out of the <script> element.
type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export default function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
