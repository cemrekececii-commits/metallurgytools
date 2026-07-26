// ─────────────────────────────────────────────────────────────────────────────
// components/JsonLd.js — JSON-LD script renderer (server component)
// Kullanım: <JsonLd data={breadcrumbLd([...])} /> veya data={[obj1, obj2]}
// ─────────────────────────────────────────────────────────────────────────────
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
