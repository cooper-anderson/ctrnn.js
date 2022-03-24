import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';

interface CustomMatchers<R = unknown> {
  /**
   * Used when you want to verify a list contains only specified values.
   * This method does not terminate upon finding an unexpected value.
   *
   * @example
   * expect([1, 2]).toContainOnly([1, 2]);
   * expect([1, 2]).toContainOnly([1, 2, 3]);
   * expect([1, 2, 3]).not.toContainOnly([1, 2]);
   */
  toContainOnly<E>(expected: E[]): R;
  /**
   * Used when you want to verify a list contains only specified values.
   * This method terminates upon finding an unexpected value.
   *
   * @example
   * expect([1, 2]).toContainOnlyT([1, 2]);
   * expect([1, 2]).toContainOnlyT([1, 2, 3]);
   * expect([1, 2, 3]).not.toContainOnlyT([1, 2]);
   */
  toContainOnlyT<E>(expected: E[]): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

function toContainOnly(received: any[], expected: any[], terminate: boolean) {
  const found: any[] = [];
  for (let item of received) {
    if (!expected.includes(item)) {
      found.push(item);
      if (terminate) break;
    }
  }

  if (found.length) {
    const plural = terminate ? "" : "s";
    const value = terminate ? found[0] : found;
    return {
      pass: false,
      message: () => matcherHint('.toContainOnly') + '\n\n' +
        `Expected values: ${printExpected(expected)}\n` +
        `Received values: ${printReceived(received)}\n` +
        `Unexpected value${plural}: ${printReceived(value)}`
    }
  }

  return {
    pass: true,
    message: () => matcherHint('.not.toContainOnly') + '\n\n' +
      `Expected values: ${printExpected(expected)}\n` +
      `Received values: ${printReceived(received)}`
  }
}

expect.extend({
  toContainOnly: (r, e) => toContainOnly(r, e, false),
  toContainOnlyT: (r, e) => toContainOnly(r, e, true)
});
