# timefi-sdk

The official JavaScript SDK for interacting with the **TimeFi Protocol** on the Stacks blockchain.

[![npm version](https://img.shields.io/npm/v/timefi-sdk.svg)](https://www.npmjs.com/package/timefi-sdk)
[![Downloads](https://img.shields.io/npm/dm/timefi-sdk.svg)](https://www.npmjs.com/package/timefi-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Protocol Client: Easy-to-use `TimeFiClient` for read and write interactions.
- On-chain Data: Fetch TVL, vault status, and lock durations directly from smart contracts.
- Formatting Utilities: Standardized formatting for STX (microSTX to STX), addresses, dates, and timestamps.
- Shared Helpers: Utility helpers and protocol models from the old `timefi-utils` and `timefi-types` packages are now included directly in `timefi-sdk`.
- Mainnet/Testnet Support: Unified interface for both networks.

## Installation

```bash
npm install timefi-sdk
```

## Quick Start

### Fetch Protocol Stats

```javascript
import { TimeFiClient, formatSTX } from 'timefi-sdk';

const client = new TimeFiClient('mainnet');
const tvl = await client.getTVL();

console.log(`Current TVL: ${formatSTX(tvl)} STX`);
```

### Build a Create-Vault Transaction

```javascript
import { TimeFiClient } from 'timefi-sdk';

const client = new TimeFiClient('mainnet');

const txOptions = client.getCreateVaultOptions('1.25', 4320);
```

### Format a Stacks Address

```javascript
import { formatAddress } from 'timefi-sdk';

const shortAddress = formatAddress('SP3F1234567890ABCDEFG1234567890XYZ123');
console.log(shortAddress);
```

### Use Integrated Utilities and Protocol Helpers

```javascript
import {
  calculateTimeRemaining,
  getProtocolConfig,
  validateAddress,
} from 'timefi-sdk';

const config = getProtocolConfig();
const remaining = calculateTimeRemaining(Date.now() + 60_000);
const isValid = validateAddress('SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N');
```

## Running Tests

```bash
npm test
```

## Documentation

The SDK exports:

- `TimeFiClient`
- `formatSTX(microStx)`
- `formatAddress(address)`
- `formatTimestamp(timestamp)`
- `calculateTimeRemaining(endTime)`
- `validateAddress(address)`
- `validateAddressResult(address)`
- `formatAmount(amount, decimals?)`
- `parseAmount(amount)`
- `generateId()`
- `sleep(ms)`
- `retry(fn, maxRetries?, delay?)`
- `initializeProtocol(options?)`
- `getProtocolVersion()`
- `getProtocolConfig()`
- `normalizeVault(vault)`
- `normalizeTransaction(transaction)`
- `formatNumber(value)`
- `formatPercent(value)`
- `formatDate(value)`
- `formatRelativeTime(value)`
- `CONTRACT_ADDRESS`
- `CONTRACT_NAMES`
- `LOCK_PERIODS`

## License

MIT © [AdekunleBamz](https://github.com/AdekunleBamz)
