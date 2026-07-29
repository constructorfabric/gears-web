import { afterEach, describe, expect, test } from 'vitest';
import { eachParentElement, shouldCaptureElement } from './helpers';

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
    const fragment = document.createDocumentFragment();
    const button = document.createElement('button');
    fragment.appendChild(button);

    expect([...eachParentElement(button, true)]).toEqual([button]);
  });

  test('stops below the document for an element outside body', () => {
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

  test('keeps walking when a consumer detaches the current element between yields', () => {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');
    wrapper.appendChild(button);
    document.body.appendChild(wrapper);

    const walked: Element[] = [];

    expect(() => {
      for (const el of eachParentElement(button, true)) {
        walked.push(el);

        if (el === wrapper) {
          button.remove();
        }
      }
    }).not.toThrow();

    expect(walked).toEqual([button, wrapper, document.body]);
  });

  test('keeps crossing a shadow boundary when the current element is detached between yields', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    shadow.appendChild(button);

    const walked: Element[] = [];

    expect(() => {
      for (const el of eachParentElement(button, true)) {
        walked.push(el);

        if (el === host) {
          button.remove();
        }
      }
    }).not.toThrow();

    expect(walked).toEqual([button, host, document.body]);
  });
});

describe('shouldCaptureElement', () => {
  test('rejects hidden and password inputs', () => {
    document.body.innerHTML = `
      <input id="hidden-field" type="hidden">
      <input id="password-field" type="password">
      <input id="text-field" type="text">
    `;

    expect(shouldCaptureElement(document.getElementById('hidden-field')!)).toBe(false);
    expect(shouldCaptureElement(document.getElementById('password-field')!)).toBe(false);
    expect(shouldCaptureElement(document.getElementById('text-field')!)).toBe(true);
  });

  test('survives a form whose named getter shadows `type` with a child control', () => {
    document.body.innerHTML = '<form id="shadowed"><input name="type"></form>';
    const form = document.getElementById('shadowed')!;

    expect(typeof (form as unknown as { type: unknown }).type).not.toBe('string');
    expect(() => shouldCaptureElement(form)).not.toThrow();
    expect(shouldCaptureElement(form)).toBe(true);
  });

  test('rejects a field whose name or id looks sensitive', () => {
    document.body.innerHTML = `
      <input id="plain" name="comment">
      <input id="a" name="cardnum">
      <input id="ssn-field">
    `;

    expect(shouldCaptureElement(document.getElementById('plain')!)).toBe(true);
    expect(shouldCaptureElement(document.getElementById('a')!)).toBe(false);
    expect(shouldCaptureElement(document.getElementById('ssn-field')!)).toBe(false);
  });

  test('falls back to the id when `name` is not a string', () => {
    const widget = document.createElement('my-widget');
    widget.id = 'ssn-field';
    (widget as unknown as { name: unknown }).name = { toString: () => 'harmless' };
    document.body.appendChild(widget);

    expect(shouldCaptureElement(widget)).toBe(false);
  });
});
