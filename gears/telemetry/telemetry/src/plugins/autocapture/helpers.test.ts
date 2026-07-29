import { afterEach, describe, expect, test } from 'vitest';
import { eachParentElement } from './helpers';

// Deliberately a separate file from autocapture.test.ts, which `vi.mock('./helpers')`.

afterEach(() => {
  document.body.innerHTML = '';
  document.head.querySelectorAll('[data-test]').forEach((el) => el.remove());
});

describe('eachParentElement', () => {
  test('walks up to body for an attached element', () => {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');
    wrapper.appendChild(button);
    document.body.appendChild(wrapper);

    expect([...eachParentElement(button, true)]).toEqual([button, wrapper, document.body]);
  });

  test('crosses a shadow boundary through the host', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    shadow.appendChild(button);

    expect([...eachParentElement(button, true)]).toEqual([button, host, document.body]);
  });

  test('stops at a DocumentFragment root instead of stepping onto its missing host', () => {
    // Regression: a fragment reports nodeType 11 like a shadow root but has no `host`, so the walk
    // used to yield `undefined` and then throw on the next iteration's `curEl.parentNode`.
    const fragment = document.createDocumentFragment();
    const button = document.createElement('button');
    fragment.appendChild(button);

    expect([...eachParentElement(button, true)]).toEqual([button]);
  });

  test('stops below the document for an element outside body', () => {
    // Regression: nothing on this path hits the `body` boundary, so the walk climbed past <html>
    // and yielded the Document — which has no `dataset` for the consumer to read.
    const meta = document.createElement('meta');
    meta.setAttribute('data-test', '');
    document.head.appendChild(meta);

    const walked = [...eachParentElement(meta, true)];

    expect(walked).toEqual([meta, document.head, document.documentElement]);
    expect(walked.every((node) => node.nodeType === Node.ELEMENT_NODE)).toBe(true);
  });

  test('omits the target unless asked for it', () => {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');
    wrapper.appendChild(button);
    document.body.appendChild(wrapper);

    expect([...eachParentElement(button)]).toEqual([wrapper, document.body]);
  });
});
