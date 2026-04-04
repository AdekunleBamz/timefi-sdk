/**
 * Protocol metadata and typed helpers for the TimeFi ecosystem.
 */

/** @typedef {{ timeLock: boolean, vaults: boolean, governance: boolean, rewards: boolean }} ProtocolFeatures */
/** @typedef {{ network: string, version: string, features: ProtocolFeatures, initialized?: boolean }} ProtocolConfig */
/** @typedef {'active' | 'locked' | 'withdrawn' | 'failed'} VaultStatus */
/** @typedef {{ id: string, owner: string, amount: number, lockTime: number, unlockTime: number, status: VaultStatus, fees: number }} Vault */
/** @typedef {'deposit' | 'withdraw' | 'create' | 'fee'} TransactionType */
/** @typedef {'pending' | 'confirmed' | 'failed'} TransactionStatus */
/** @typedef {{ hash: string, type: TransactionType, amount: number, from: string, to: string, timestamp: number, status: TransactionStatus }} Transaction */

export const PROTOCOL_VERSION = '1.0.0';

/** @type {Readonly<ProtocolFeatures>} */
export const DEFAULT_PROTOCOL_FEATURES = Object.freeze({
    timeLock: true,
    vaults: true,
    governance: false,
    rewards: false,
});

/** @type {Readonly<VaultStatus[]>} */
export const VAULT_STATUSES = Object.freeze(['active', 'locked', 'withdrawn', 'failed']);

/** @type {Readonly<TransactionType[]>} */
export const TRANSACTION_TYPES = Object.freeze(['deposit', 'withdraw', 'create', 'fee']);

/** @type {Readonly<TransactionStatus[]>} */
export const TRANSACTION_STATUSES = Object.freeze(['pending', 'confirmed', 'failed']);

function toFiniteNumber(value, fallback = 0) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function normalizeVaultStatus(status) {
    return VAULT_STATUSES.includes(status) ? status : 'active';
}

function normalizeTransactionType(type) {
    return TRANSACTION_TYPES.includes(type) ? type : 'deposit';
}

function normalizeTransactionStatus(status) {
    return TRANSACTION_STATUSES.includes(status) ? status : 'pending';
}

/**
 * @param {Partial<ProtocolConfig>} [options={}]
 * @returns {ProtocolConfig}
 */
function createProtocolConfig(options = {}) {
    const mergedFeatures = {
        ...DEFAULT_PROTOCOL_FEATURES,
        ...(options.features || {}),
    };

    return {
        network: options.network || 'mainnet',
        version: options.version || PROTOCOL_VERSION,
        features: mergedFeatures,
        initialized: options.initialized ?? true,
    };
}

let protocolConfig = createProtocolConfig();

/**
 * @param {Partial<ProtocolConfig>} [options={}]
 * @returns {ProtocolConfig}
 */
export function initializeProtocol(options = {}) {
    protocolConfig = createProtocolConfig(options);
    return getProtocolConfig();
}

/**
 * @returns {string}
 */
export function getProtocolVersion() {
    return protocolConfig.version;
}

/**
 * @returns {ProtocolConfig}
 */
export function getProtocolConfig() {
    return {
        ...protocolConfig,
        features: { ...protocolConfig.features },
    };
}

/**
 * @param {Partial<Vault>} [vault={}]
 * @returns {Vault}
 */
export function normalizeVault(vault = {}) {
    return {
        id: vault.id ? String(vault.id) : '',
        owner: vault.owner ? String(vault.owner) : '',
        amount: toFiniteNumber(vault.amount),
        lockTime: toFiniteNumber(vault.lockTime),
        unlockTime: toFiniteNumber(vault.unlockTime),
        status: normalizeVaultStatus(vault.status),
        fees: toFiniteNumber(vault.fees),
    };
}

/**
 * @param {Partial<Transaction>} [transaction={}]
 * @returns {Transaction}
 */
export function normalizeTransaction(transaction = {}) {
    return {
        hash: transaction.hash ? String(transaction.hash) : '',
        type: normalizeTransactionType(transaction.type),
        amount: toFiniteNumber(transaction.amount),
        from: transaction.from ? String(transaction.from) : '',
        to: transaction.to ? String(transaction.to) : '',
        timestamp: toFiniteNumber(transaction.timestamp),
        status: normalizeTransactionStatus(transaction.status),
    };
}
