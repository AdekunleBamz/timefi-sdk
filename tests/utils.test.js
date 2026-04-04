import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    calculateTimeRemaining,
    formatAmount,
    formatTimestamp,
    generateId,
    getProtocolConfig,
    getProtocolVersion,
    initializeProtocol,
    normalizeTransaction,
    normalizeVault,
    parseAmount,
    retry,
    validateAddress,
    validateAddressResult,
} from '../src/index.js';

afterEach(() => {
    vi.useRealTimers();
    initializeProtocol();
});

describe('shared utilities', () => {
    it('formats timestamps using the local runtime locale', () => {
        const timestamp = Date.UTC(2026, 0, 1, 12, 30, 0);
        expect(formatTimestamp(timestamp)).toBe(new Date(timestamp).toLocaleString());
    });

    it('calculates remaining time breakdowns', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

        expect(calculateTimeRemaining(Date.now() + 90061000)).toEqual({
            days: 1,
            hours: 1,
            minutes: 1,
            seconds: 1,
            total: 90061000,
        });
    });

    it('validates Stacks addresses and returns details', () => {
        expect(validateAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N')).toBe(true);
        expect(validateAddress('not-an-address')).toBe(false);
        expect(validateAddressResult('  st1pqhqkv0rjxzfy1dgx8mnsnyve3vgzjsrtpgzgm  ')).toEqual({
            valid: true,
            address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        });
    });

    it('formats, parses, and retries utility work', async () => {
        const operation = vi
            .fn()
            .mockRejectedValueOnce(new Error('temporary'))
            .mockResolvedValue('ok');

        expect(formatAmount('1.23456789', 4)).toBe('1.2346');
        expect(parseAmount('1,234.5')).toBe(1234.5);
        expect(generateId()).toMatch(/^\d+-[a-z0-9]{9}$/);
        await expect(retry(operation, 2, 0)).resolves.toBe('ok');
        expect(operation).toHaveBeenCalledTimes(2);
    });
});

describe('protocol helpers', () => {
    it('initializes and reads protocol config', () => {
        const config = initializeProtocol({
            network: 'testnet',
            features: {
                governance: true,
            },
        });

        expect(config).toEqual({
            network: 'testnet',
            version: '1.0.0',
            features: {
                timeLock: true,
                vaults: true,
                governance: true,
                rewards: false,
            },
            initialized: true,
        });
        expect(getProtocolVersion()).toBe('1.0.0');
        expect(getProtocolConfig()).toEqual(config);
        expect(getProtocolConfig()).not.toBe(config);
    });

    it('normalizes vault and transaction records', () => {
        expect(
            normalizeVault({
                id: 7,
                owner: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
                amount: '42',
                lockTime: '10',
                unlockTime: 20,
                status: 'withdrawn',
                fees: '0.5',
            })
        ).toEqual({
            id: '7',
            owner: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
            amount: 42,
            lockTime: 10,
            unlockTime: 20,
            status: 'withdrawn',
            fees: 0.5,
        });

        expect(
            normalizeTransaction({
                hash: 123,
                type: 'withdraw',
                amount: '12.5',
                from: 'SPFROM',
                to: 'SPTO',
                timestamp: '1700000000',
                status: 'confirmed',
            })
        ).toEqual({
            hash: '123',
            type: 'withdraw',
            amount: 12.5,
            from: 'SPFROM',
            to: 'SPTO',
            timestamp: 1700000000,
            status: 'confirmed',
        });
    });
});
