import { afterEach, describe, expect, test } from 'vitest';
import { isShadowRoot } from './dom';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('isShadowRoot', () => {
  test('identifies a shadow root', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    expect(isShadowRoot(host.attachShadow({ mode: 'open' }))).toBe(true);
  });

  test('rejects a plain DocumentFragment, which reports the same nodeType 11', () => {
    // The distinguishing feature is `host`, not the node type: treating every nodeType 11 as a
    // shadow root made the autocapture walk read `.host` off a fragment and step onto `undefined`.
    expect(isShadowRoot(document.createDocumentFragment())).toBe(false);
  });

  test('rejects elements and nullish input', () => {
    expect(isShadowRoot(document.createElement('div'))).toBe(false);
    expect(isShadowRoot(null)).toBe(false);
    expect(isShadowRoot(undefined)).toBe(false);
  });
});
