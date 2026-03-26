import { callReadOnlyFunction as l, cvToValue as a, uintCV as i, PostConditionMode as c, AnchorMode as u } from "@stacks/transactions";
import { AnchorMode as b, PostConditionMode as D, bufferCV as k, noneCV as _, principalCV as S, responseErrorCV as L, responseOkCV as $, someCV as F, stringAsciiCV as v, stringUtf8CV as G, uintCV as P } from "@stacks/transactions";
import { StacksMainnet as f, StacksTestnet as d } from "@stacks/network";
const h = "SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N", s = {
  VAULT: "timefi-vault-v-A2",
  REWARDS: "timefi-rewards-v-A2",
  GOVERNANCE: "timefi-governance-v-A2",
  EMERGENCY: "timefi-emergency-v-A2"
}, N = {
  MONTH_1: { label: "1 Month", blocks: 4320, apy: 1 },
  MONTH_3: { label: "3 Months", blocks: 12960, apy: 3 },
  MONTH_6: { label: "6 Months", blocks: 25920, apy: 6 },
  MONTH_9: { label: "9 Months", blocks: 38880, apy: 9 },
  YEAR_1: { label: "1 Year", blocks: 52560, apy: 12 }
}, M = 0.01, g = 1e6, y = (t) => {
  if (t == null) return "0.000000";
  try {
    const n = typeof t == "object" && t !== null && "value" in t ? t.value : t, e = Number(n);
    return isNaN(e) ? "0.000000" : (e / 1e6).toLocaleString(void 0, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6
    });
  } catch (n) {
    return console.error("Error formatting STX:", n), "0.000000";
  }
}, C = (t, n = 4, e = 4) => t ? t.length <= n + e ? t : `${t.slice(0, n + 2)}...${t.slice(-e)}` : "", T = (t) => {
  if (t == null) return "0";
  const n = Number(t);
  return isNaN(n) ? "0" : n.toLocaleString();
}, p = (t, n = 2) => {
  if (t == null) return "0%";
  const e = Number(t);
  return isNaN(e) ? "0%" : (e * 100).toFixed(n) + "%";
}, m = (t) => {
  if (!t) return "--";
  const n = new Date(t);
  return isNaN(n.getTime()) ? "--" : n.toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}, O = (t) => {
  if (!t) return "--";
  const n = /* @__PURE__ */ new Date(), e = new Date(t), r = Math.floor((n - e) / 1e3);
  if (r < -1) {
    const o = Math.abs(r);
    return o < 60 ? "in a few seconds" : o < 3600 ? `in ${Math.floor(o / 60)}m` : o < 86400 ? `in ${Math.floor(o / 3600)}h` : `in ${Math.floor(o / 86400)}d`;
  }
  return r < 5 ? "just now" : r < 60 ? `${r}s ago` : r < 3600 ? `${Math.floor(r / 60)}m ago` : r < 86400 ? `${Math.floor(r / 3600)}h ago` : r < 604800 ? `${Math.floor(r / 86400)}d ago` : m(t);
};
class R {
  constructor(n = "mainnet") {
    this.network = n === "mainnet" ? new f() : new d(), this.contractAddress = h;
  }
  // --- Read-only Methods ---
  async callReadOnly(n, e = [], r) {
    const o = await l({
      contractAddress: this.contractAddress,
      contractName: s.VAULT,
      functionName: n,
      functionArgs: e,
      network: this.network,
      senderAddress: r || this.contractAddress
    });
    return o.type === 7 || o.type === 8 ? a(o.value) : a(o);
  }
  async getVault(n) {
    if (n == null) throw new Error("vaultId is required");
    return this.callReadOnly("get-vault", [i(n)]);
  }
  async getTimeRemaining(n) {
    if (n == null) throw new Error("vaultId is required");
    return this.callReadOnly("get-time-remaining", [i(n)]);
  }
  async canWithdraw(n) {
    if (n == null) throw new Error("vaultId is required");
    return this.callReadOnly("can-withdraw", [i(n)]);
  }
  async getTVL() {
    return this.callReadOnly("get-tvl", []);
  }
  // --- Transaction Signing Options Helpers ---
  getCreateVaultOptions(n, e) {
    return {
      contractAddress: this.contractAddress,
      contractName: s.VAULT,
      functionName: "create-vault",
      functionArgs: [i(n * 1e6), i(e)],
      network: this.network,
      anchorMode: u.Any,
      postConditionMode: c.Deny
    };
  }
  getWithdrawOptions(n) {
    if (n == null) throw new Error("vaultId is required");
    return {
      contractAddress: this.contractAddress,
      contractName: s.VAULT,
      functionName: "request-withdraw",
      functionArgs: [i(n)],
      network: this.network,
      anchorMode: u.Any,
      postConditionMode: c.Deny
    };
  }
}
export {
  b as AnchorMode,
  h as CONTRACT_ADDRESS,
  s as CONTRACT_NAMES,
  N as LOCK_PERIODS,
  g as MAX_DEPOSIT,
  M as MIN_DEPOSIT,
  D as PostConditionMode,
  R as TimeFiClient,
  k as bufferCV,
  C as formatAddress,
  m as formatDate,
  T as formatNumber,
  p as formatPercent,
  O as formatRelativeTime,
  y as formatSTX,
  _ as noneCV,
  S as principalCV,
  L as responseErrorCV,
  $ as responseOkCV,
  F as someCV,
  v as stringAsciiCV,
  G as stringUtf8CV,
  P as uintCV
};
