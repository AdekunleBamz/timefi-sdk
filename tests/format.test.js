import { describe, expect, it } from 'vitest';

import { formatAddress, formatPercent, formatSTX } from '../src/format.js';

describe('format utilities', () => {
    it('formats microSTX values to STX', () => {
        expect(formatSTX(1500000)).toBe('1.5');
        expect(formatSTX('1000000')).toBe('1');
    });

    it('formats addresses with truncation', () => {
        expect(formatAddress('SP3F1234567890ABCDEFG1234567890XYZ123')).toMatch(/\.\.\./);
    });

    it('formats percent values', () => {
        expect(formatPercent(0.1234)).toBe('12.34%');
    });
});
