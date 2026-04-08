export default function sitemap() {
  const baseUrl = "https://metallurgytools.com";
  const lastModified = new Date();

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/methodology`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/knowledge`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/mechanical-tests`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const tools = [
    { slug: "hardness",         priority: 0.95 },
    { slug: "carbon-equivalent",priority: 0.95 },
    { slug: "grain-size",       priority: 0.95 },
    { slug: "phase-diagram",    priority: 0.90 },
    { slug: "cct-ttt",          priority: 0.90 },
    { slug: "preheat",          priority: 0.90 },
    { slug: "corrosion",        priority: 0.85 },
    { slug: "dbtt",             priority: 0.85 },
    { slug: "inclusion",        priority: 0.85 },
    { slug: "sem-eds",          priority: 0.85 },
    { slug: "unit-converter",   priority: 0.80 },
    { slug: "tensile-specimen",   priority: 0.80 },
    { slug: "inclusion-atlas",    priority: 0.90 },
    { slug: "ultrasonic",         priority: 0.92 },
    { slug: "dwtt",               priority: 0.90 },
    { slug: "hasar-vakalari",     priority: 0.95 },
  ];

  const toolPages = tools.map(({ slug, priority }) => ({
    url: `${baseUrl}/tools/${slug}`,
    changeFrequency: "monthly",
    priority,
    lastModified,
  }));

  return [
    ...staticPages.map((p) => ({ ...p, lastModified })),
    ...toolPages,
  ];
}
