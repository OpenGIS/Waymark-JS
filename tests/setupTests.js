// Suppress non-error console output during tests
const noop = () => {};

if (!globalThis.__orig_console) globalThis.__orig_console = {};

if (!globalThis.__orig_console.log) {
  globalThis.__orig_console.log = console.log;
  console.log = noop;
}
if (!globalThis.__orig_console.info) {
  globalThis.__orig_console.info = console.info;
  console.info = noop;
}
if (!globalThis.__orig_console.debug) {
  globalThis.__orig_console.debug = console.debug;
  console.debug = noop;
}
// Keep warn/error visible but track originals
if (!globalThis.__orig_console.warn) globalThis.__orig_console.warn = console.warn;
if (!globalThis.__orig_console.error) globalThis.__orig_console.error = console.error;
