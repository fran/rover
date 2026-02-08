import { describe, it, expect } from 'vitest';
import { parseAgentError, CreditExhaustedError } from '../errors.js';

describe('parseAgentError', () => {
  it('should return CreditExhaustedError for quota exceeded text', () => {
    const err = parseAgentError(
      'Error: quota_exceeded - You have exceeded your usage limit',
      '',
      1
    );
    expect(err).toBeInstanceOf(CreditExhaustedError);
    expect(err.code).toBe('CREDIT_EXHAUSTED');
    expect(err.isRetryable).toBe(true);
  });

  it('should return CreditExhaustedError for credits exhausted text', () => {
    const err = parseAgentError(
      'stderr line\ncredits exhausted for this month',
      '',
      1
    );
    expect(err).toBeInstanceOf(CreditExhaustedError);
    expect(err.code).toBe('CREDIT_EXHAUSTED');
  });

  it('should return CreditExhaustedError for JSON error with quota type', () => {
    const stdout = JSON.stringify({
      error: { type: 'quota_exceeded', message: 'Insufficient quota' },
    });
    const err = parseAgentError('', stdout, 1);
    expect(err).toBeInstanceOf(CreditExhaustedError);
    expect(err.message).toContain('Insufficient quota');
  });

  it('should return CreditExhaustedError for JSON error with credit code', () => {
    const stdout = JSON.stringify({
      error: { code: 'credit_limit', message: 'Out of credits' },
    });
    const err = parseAgentError('', stdout, 1);
    expect(err).toBeInstanceOf(CreditExhaustedError);
  });
});
