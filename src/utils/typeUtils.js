/**
 * Validate a type key against slug constraints.
 * Returns `true` if valid, `false` otherwise.
 *
 * @param {unknown} key
 * @returns {key is string}
 */
export function isValidTypeKey(key) {
  return (
    typeof key === "string" &&
    key.length >= 1 &&
    key.length <= 64 &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)
  );
}

/**
 * Sanitise a string for use in a type sublayer ID.
 * This is a belt-and-braces safety transform for sublayer ID generation,
 * even though type keys are validated at config time.
 *
 * @param {unknown} key
 * @returns {string}
 */
export function sanitiseTypeKey(key) {
  return String(key).replace(/[^a-zA-Z0-9_-]/g, "-");
}
