import { describe, it, expect } from 'vitest';
import { CreditExhaustedError, isCreditExhaustedError } from '../index.js';

describe('CreditExhaustedError', () => {
  it('should be an Error with name CreditExhaustedError', () => {
    const err = new CreditExhaustedError('claude', 'AI credits exhausted');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CreditExhaustedError);
    expect(err.name).toBe('CreditExhaustedError');
    expect(err.message).toBe('AI credits exhausted');
  });

  it('should use default message when only agent is provided', () => {
    const err = new CreditExhaustedError('gemini');
    expect(err.message).toContain('credits or quota exhausted');
    expect(err.message).toContain('gemini');
  });
});

describe('isCreditExhaustedError', () => {
  it('should return true for CreditExhaustedError instance', () => {
    expect(
      isCreditExhaustedError(
        new CreditExhaustedError('claude', 'credits exhausted')
      )
    ).toBe(true);
  });

  it('should return true for error with message containing credit exhaustion phrase', () => {
    expect(isCreditExhaustedError(new Error('quota exceeded'))).toBe(true);
    expect(isCreditExhaustedError(new Error('credits exhausted'))).toBe(true);
    expect(isCreditExhaustedError(new Error('insufficient quota'))).toBe(true);
  });

  it('should return true for object with stderr containing quota exceeded', () => {
    expect(
      isCreditExhaustedError({ stderr: 'quota exceeded', stdout: '' })
    ).toBe(true);
  });

  it('should return false for generic error', () => {
    expect(isCreditExhaustedError(new Error('Something went wrong'))).toBe(
      false
    );
  });

  it('should return false for null or undefined', () => {
    expect(isCreditExhaustedError(null)).toBe(false);
    expect(isCreditExhaustedError(undefined)).toBe(false);
  });
});
