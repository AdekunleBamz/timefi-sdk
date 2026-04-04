/**
 * Shared utility helpers for TimeFi SDK consumers.
 */

/** @typedef {{ days: number, hours: number, minutes: number, seconds: number, total: number }} TimeRemaining */
/** @typedef {{ valid: boolean, address?: string, error?: string }} ValidationResult */

const STACKS_ADDRESS_PATTERN = /^S[PTMN][A-Z0-9]{38,40}$/i;

function normalizeDecimals(decimals) {
    const parsed = Number(decimals);
    if (!Number.isInteger(parsed) || parsed < 0) {
        return 6;
    }
    return parsed;
}

/**
 * @param {number | string | Date} timestamp
 * @returns {string}
 */
export function formatTimestamp(timestamp) {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toLocaleString();
}

/**
 * @param {number | string | Date} endTime
 * @returns {TimeRemaining}
 */
export function calculateTimeRemaining(endTime) {
    const target = endTime instanceof Date ? endTime.getTime() : Number(endTime);
    const remaining = Number.isFinite(target) ? target - Date.now() : 0;

    if (remaining <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: remaining };
}

/**
 * @param {string} address
 * @returns {ValidationResult}
 */
export function validateAddressResult(address) {
    if (typeof address !== 'string') {
        return { valid: false, error: 'Address must be a string.' };
    }

    const normalized = address.trim().toUpperCase();
    if (!normalized) {
        return { valid: false, error: 'Address is required.' };
    }

    if (!STACKS_ADDRESS_PATTERN.test(normalized)) {
        return { valid: false, address: normalized, error: 'Address must be a valid Stacks address.' };
    }

    return { valid: true, address: normalized };
}

/**
 * @param {string} address
 * @returns {boolean}
 */
export function validateAddress(address) {
    return validateAddressResult(address).valid;
}

/**
 * @param {number | string} amount
 * @param {number} [decimals=6]
 * @returns {string}
 */
export function formatAmount(amount, decimals = 6) {
    const numericAmount = Number(amount);
    const safeDecimals = normalizeDecimals(decimals);

    if (!Number.isFinite(numericAmount)) {
        return (0).toFixed(safeDecimals);
    }

    return numericAmount.toFixed(safeDecimals);
}

/**
 * @param {string | number} amountStr
 * @returns {number}
 */
export function parseAmount(amountStr) {
    const numericAmount = Number.parseFloat(String(amountStr).replace(/,/g, '').trim());
    return Number.isFinite(numericAmount) ? numericAmount : 0;
}

/**
 * @returns {string}
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    const delay = Number.isFinite(ms) && ms > 0 ? ms : 0;
    return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * @template T
 * @param {() => Promise<T>} fn
 * @param {number} [maxRetries=3]
 * @param {number} [delay=1000]
 * @returns {Promise<T>}
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
    const retries = Number.isInteger(maxRetries) && maxRetries > 0 ? maxRetries : 1;

    for (let index = 0; index < retries; index += 1) {
        try {
            return await fn();
        } catch (error) {
            if (index === retries - 1) {
                throw error;
            }
            await sleep(delay);
        }
    }

    throw new Error('Retry exhausted without executing the operation.');
}
