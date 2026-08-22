/**
 * @typedef {object} WaymarkStyleSource
 * @property {string} [attribution]
 */

/**
 * Aggregate source-level attributions into a single string, following the
 * MapLibre algorithm: collect each source's attribution (skipping empty or
 * whitespace-only values), dedupe exact matches, sort by length ascending,
 * remove any attribution that is a substring of another, then join with " | ".
 *
 * @param {{ sources?: Record<string, WaymarkStyleSource> }} style
 * @returns {string | null}
 */
export function computeStyleAttribution(style) {
  if (!style || typeof style !== "object" || !style.sources) {
    return null;
  }

  const attributions = [];

  for (const source of Object.values(style.sources)) {
    const attribution = source?.attribution;
    if (typeof attribution !== "string" || attribution.trim() === "") {
      continue;
    }
    attributions.push(attribution);
  }

  if (attributions.length === 0) {
    return null;
  }

  const unique = [...new Set(attributions)];
  unique.sort((a, b) => a.length - b.length);

  const filtered = unique.filter(
    (attribution, index) =>
      !unique.some(
        (other, otherIndex) =>
          otherIndex !== index && other.includes(attribution),
      ),
  );

  return filtered.join(" | ");
}

/**
 * @param {{ getStyle: () => unknown }} map
 * @returns {string | null}
 */
export function getLoadedStyleAttribution(map) {
  if (!map || typeof map.getStyle !== "function") {
    return null;
  }

  const style = map.getStyle();
  if (!style || typeof style !== "object") {
    return null;
  }

  return computeStyleAttribution(style);
}
