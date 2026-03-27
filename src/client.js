import {
    callReadOnlyFunction,
    cvToValue,
    uintCV,
    AnchorMode,
    PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAMES } from './constants.js';

function assertPositiveInteger(value, fieldName) {
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${fieldName} must be a positive integer.`);
    }
}

function toMicroStx(amountSTX) {
    if (amountSTX === undefined || amountSTX === null) {
        throw new Error('amountSTX is required');
    }

    const raw = String(amountSTX).trim();
    if (!/^\d+(\.\d+)?$/.test(raw)) {
        throw new Error('amountSTX must be a valid positive number.');
    }

    const [whole, fraction = ''] = raw.split('.');
    if (fraction.length > 6) {
        throw new Error('amountSTX supports at most 6 decimal places.');
    }

    const micros = BigInt(whole) * 1_000_000n + BigInt((fraction + '000000').slice(0, 6));
    if (micros <= 0n) {
        throw new Error('amountSTX must be greater than 0.');
    }
    return micros;
}

export class TimeFiClient {
    constructor(networkType = 'mainnet') {
        if (!['mainnet', 'testnet'].includes(networkType)) {
            throw new Error(`Invalid networkType "${networkType}". Use "mainnet" or "testnet".`);
        }
        this.networkType = networkType;
        this.network = networkType === 'mainnet'
            ? new StacksMainnet()
            : new StacksTestnet();
        this.contractAddress = CONTRACT_ADDRESS;
    }

    // --- Read-only Methods ---

    async callReadOnly(functionName, functionArgs = [], senderAddress) {
        const result = await callReadOnlyFunction({
            contractAddress: this.contractAddress,
            contractName: CONTRACT_NAMES.VAULT,
            functionName,
            functionArgs,
            network: this.network,
            senderAddress: senderAddress || this.contractAddress,
        });

        // Handle ResponseCV (ok/err) explicitly
        if (result.type === 7 || result.type === 8) { // ok or err
            return cvToValue(result.value);
        }

        return cvToValue(result);
    }

    async getVault(vaultId) {
        assertPositiveInteger(vaultId, 'vaultId');
        return this.callReadOnly('get-vault', [uintCV(vaultId)]);
    }

    async getTimeRemaining(vaultId) {
        assertPositiveInteger(vaultId, 'vaultId');
        return this.callReadOnly('get-time-remaining', [uintCV(vaultId)]);
    }

    async canWithdraw(vaultId) {
        assertPositiveInteger(vaultId, 'vaultId');
        return this.callReadOnly('can-withdraw', [uintCV(vaultId)]);
    }

    async getTVL() {
        return this.callReadOnly('get-tvl', []);
    }

    // --- Transaction Signing Options Helpers ---

    getCreateVaultOptions(amountSTX, lockDurationBlocks) {
        assertPositiveInteger(lockDurationBlocks, 'lockDurationBlocks');
        return {
            contractAddress: this.contractAddress,
            contractName: CONTRACT_NAMES.VAULT,
            functionName: 'create-vault',
            functionArgs: [uintCV(toMicroStx(amountSTX)), uintCV(lockDurationBlocks)],
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        };
    }

    getWithdrawOptions(vaultId) {
        assertPositiveInteger(vaultId, 'vaultId');
        return {
            contractAddress: this.contractAddress,
            contractName: CONTRACT_NAMES.VAULT,
            functionName: 'request-withdraw',
            functionArgs: [uintCV(vaultId)],
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        };
    }
}
