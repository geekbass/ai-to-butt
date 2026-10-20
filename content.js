(function () {
  "use strict";

  const { replaceText } = globalThis.AIToButt;
  const SKIPPED_PARENTS = new Set([
    "CODE",
    "KBD",
    "NOSCRIPT",
    "PRE",
    "SCRIPT",
    "STYLE",
    "TEXTAREA"
  ]);

  function shouldSkip(textNode) {
    let element = textNode.parentElement;
    if (!element) {
      return true;
    }

    // Check every ancestor so, for example, syntax-highlighting spans nested
    // inside a <code> block are left untouched too.
    while (element) {
      if (SKIPPED_PARENTS.has(element.tagName) || element.isContentEditable) {
        return true;
      }
      element = element.parentElement;
    }

    return false;
  }

  function processTextNode(textNode) {
    if (shouldSkip(textNode) || !textNode.nodeValue) {
      return;
    }

    const updatedText = replaceText(textNode.nodeValue);
    if (updatedText !== textNode.nodeValue) {
      textNode.nodeValue = updatedText;
    }
  }

  function processTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      processTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
      processTextNode(textNode);
    }
  }

  processTree(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        processTextNode(mutation.target);
        continue;
      }

      for (const addedNode of mutation.addedNodes) {
        processTree(addedNode);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true
  });
})();
