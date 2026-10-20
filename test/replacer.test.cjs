"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { replaceText } = require("../replacer.js");

test("replaces each requested standalone term", () => {
  assert.equal(replaceText("AI and A.I. and AGI"), "BUTT and BUTT. and BUTT");
  assert.equal(
    replaceText("Artificial Intelligence and Artifical Intelligence"),
    "Butt and Butt"
  );
  assert.equal(replaceText("super intelligence"), "butt");
  assert.equal(replaceText("super-intelligence"), "butt");
});

test("turns terms preceded by the into my butt", () => {
  assert.equal(replaceText("the AI"), "my butt");
  assert.equal(replaceText("The A.I."), "My butt.");
  assert.equal(replaceText("THE ARTIFICIAL INTELLIGENCE"), "MY BUTT");
  assert.equal(replaceText("the super intelligence"), "my butt");
});

test("preserves capitalization style", () => {
  assert.equal(replaceText("ai Ai AI"), "butt Butt BUTT");
  assert.equal(replaceText("agi Agi AGI"), "butt Butt BUTT");
});

test("does not replace a target embedded in another word", () => {
  assert.equal(replaceText("said chair AIs AGIs"), "said chair AIs AGIs");
});

test("works next to punctuation and at the beginning of text", () => {
  assert.equal(replaceText("AI-powered; (the AGI)!"), "BUTT-powered; (my butt)!");
});
