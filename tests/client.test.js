import { describe, expect, it } from 'vitest';
import { PostConditionMode } from '@stacks/transactions';

import { TimeFiClient } from '../src/client.js';

describe('TimeFiClient option builders', () => {
    it('builds vault options with microSTX conversion', () => {
        const client = new TimeFiClient('mainnet');
        const options = client.getCreateVaultOptions('1.25', 4320);
        expect(options.functionArgs[0].value.toString()).toBe('1250000');
        expect(options.postConditionMode).toBe(PostConditionMode.Allow);
    });

    it('rejects amount with more than 6 decimal places', () => {
        const client = new TimeFiClient('mainnet');
        expect(() => client.getCreateVaultOptions('0.1234567', 4320)).toThrow(
            /at most 6 decimal places/
        );
    });

    it('rejects invalid lock duration', () => {
        const client = new TimeFiClient('mainnet');
        expect(() => client.getCreateVaultOptions('1', 0)).toThrow(/positive integer/);
    });

    it('rejects unsupported network type', () => {
        expect(() => new TimeFiClient('devnet')).toThrow(/Invalid networkType/);
    });
});
