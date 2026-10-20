(function (root) {
  "use strict";

  // Longer phrases are listed first for readability. The surrounding checks
  // keep short terms such as "AI" from changing words like "said" or "chair".
  const TERM_SOURCE = [
    "artificial\\s+intelligence",
    "artifical\\s+intelligence",
    "super(?:\\s+|-)intelligence",
    "A\\.I",
    "AGI",
    "AI"
  ].join("|");

  const TARGET_PATTERN = new RegExp(
    `(^|[^\\p{L}\\p{N}_])((?:the\\s+)?(?:${TERM_SOURCE}))(?![\\p{L}\\p{N}_])`,
    "giu"
  );

  function hasAllCaps(text) {
    const letters = text.replace(/[^\p{L}]/gu, "");
    return letters.length > 0 && letters === letters.toUpperCase();
  }

  function replacementFor(phrase) {
    const includesThe = /^the\s+/iu.test(phrase);
    const replacement = includesThe ? "my butt" : "butt";

    if (hasAllCaps(phrase)) {
      return replacement.toUpperCase();
    }

    if (/^\p{Lu}/u.test(phrase)) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }

    return replacement;
  }

  function replaceText(text) {
    return text.replace(TARGET_PATTERN, (_match, prefix, phrase) => {
      return prefix + replacementFor(phrase);
    });
  }

  const api = Object.freeze({ replaceText });
  root.AIToButt = api;

  // This branch is ignored by browsers and lets the same code be unit tested
  // with Node without introducing a build step or runtime dependency.
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis === "object" ? globalThis : this);
