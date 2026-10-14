import { connectInjectedWallet, subscribeWallet, switchInjectedWalletToStudionet } from './wallet.mjs?v=studionet-switch-1';

let sdkPromise;
let configPromise;
let mountedTarget;
let notifyUser = () => {};
let records = [];
let connectedAddress = '';
let operation = null;
let walletProvider = null;
let currentChainId = '';
let publishers = [];
let disconnectedByUser = false;
const TX_KEY = 'pride-studionet-transactions-v1';
let transactions = [];
try { transactions = JSON.parse(localStorage.getItem(TX_KEY) || '[]').slice(0, 30); } catch { transactions = []; }

function rememberTransaction(entry) {
  transactions = [entry, ...transactions.filter((item) => item.hash !== entry.hash)].slice(0, 30);
  try { localStorage.setItem(TX_KEY, JSON.stringify(transactions)); } catch { /* tx hash remains in the page state */ }
}

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const allowedAddress = (value) => /^0x[0-9a-fA-F]{40}$/.test(String(value ?? ''));

async function loadSdk() {
  sdkPromise ??= import('./genlayer-client.js');
  return sdkPromise;
}

async function deployment() {
  configPromise ??= fetch('./assets/deployment.json', { cache: 'no-store' }).then(async (response) => {
    if (!response.ok) throw new Error('Deployment manifest could not be loaded.');
    return response.json();
  });
  return configPromise;
}

async function discoverWallet() {
  if (walletProvider) return walletProvider;
  const providers = [];
  const announce = (event) => {
    const provider = event.detail?.provider;
    if (provider?.request && !providers.includes(provider)) providers.push(provider);
  };
  window.addEventListener('eip6963:announceProvider', announce);
  window.dispatchEvent(new Event('eip6963:requestProvider'));
  await new Promise((resolve) => setTimeout(resolve, 250));
  window.removeEventListener('eip6963:announceProvider', announce);
  walletProvider = providers[0] || (window.ethereum?.request ? window.ethereum : null);
  if (!walletProvider) throw new Error('No injected EIP-1193 wallet was found.');
  subscribeWallet(walletProvider, {
    accountsChanged: (address) => { connectedAddress = disconnectedByUser ? '' : address; frame(); },
    chainChanged: (chainId) => { currentChainId = chainId; frame(); },
    disconnect: () => { connectedAddress = ''; currentChainId = ''; disconnectedByUser = true; frame(); },
  });
  return walletProvider;
}

function frame() {
  if (!mountedTarget) return;
  const configured = mountedTarget.dataset.configured === 'true';
  const walletReady = Boolean(connectedAddress && currentChainId === '0xf22f');
  const headerStatus = document.getElementById('wallet-header-status');
  const headerAction = document.getElementById('wallet-header-action');
  if (headerStatus) {
    const wrongNetwork = Boolean(connectedAddress && currentChainId && currentChainId !== '0xf22f');
    headerStatus.textContent = wrongNetwork ? 'Wrong network · switch to 61999' : connectedAddress ? `Connected · ${connectedAddress.slice(0, 6)}…${connectedAddress.slice(-4)}` : 'Wallet not connected';
    headerStatus.classList.toggle('wallet-wrong-network', wrongNetwork);
    headerStatus.title = connectedAddress ? `Connected wallet ${connectedAddress}` : 'Public records are readable without a wallet.';
  }
  const headerSwitch = document.getElementById('wallet-switch-network');
  if (headerSwitch) {
    const wrongNetwork = Boolean(connectedAddress && currentChainId && currentChainId !== '0xf22f');
    headerSwitch.style.display = wrongNetwork ? 'inline-flex' : 'none';
    headerSwitch.disabled = Boolean(operation?.message?.startsWith('Switching wallet'));
    headerSwitch.textContent = headerSwitch.disabled ? 'Switching…' : 'Switch to Studionet';
  }
  if (headerAction) {
    const connecting = operation?.message?.startsWith('Connecting wallet');
    headerAction.textContent = connecting ? 'Connecting…' : connectedAddress ? 'Disconnect' : 'Connect wallet';
    headerAction.dataset.networkAction = connectedAddress ? 'disconnect' : 'connect';
    headerAction.disabled = Boolean(connecting || !configured);
    headerAction.classList.toggle('btn-outline', Boolean(connectedAddress));
    headerAction.classList.toggle('btn-primary', !connectedAddress);
  }
  mountedTarget.innerHTML = `
    <section class="network-hero panel">
      <span class="eyebrow">REAL NETWORK</span>
      <h1 class="title">Public chain records <span class="gradient-text">you can verify.</span></h1>
      <p class="lead">Browse finalized Studionet records without connecting. Connect a wallet to register a publisher or commitment, check sources, submit an amendment, or challenge a record. Your wallet approves every write.</p>
      <div class="network-state" role="status" aria-live="polite">${esc(operation?.message || (!configured ? 'Deployment is not configured.' : (connectedAddress ? (currentChainId && currentChainId !== '0xf22f' ? 'Wrong network. Switch your wallet to GenLayer Studionet (chain 61999), then reconnect.' : `Connected to Studionet as ${connectedAddress}. You can use the publisher and commitment actions below.`) : 'Wallet not connected. Public records are read-only until you connect.')))}</div>
      ${walletReady ? '' : '<p class="wallet-helper">Use <strong>Connect wallet</strong> in the top bar before writing. PRIDE never asks for your recovery phrase.</p>'}
      ${transactions.length ? `<details class="section"><summary>Wallet transaction history (${transactions.length})</summary>${transactions.map((item) => `<p><b>${esc(item.action)}</b> · ${esc(item.status)} · ${esc(item.at)} · <a class="link-action" href="https://explorer-studio.genlayer.com/tx/${encodeURIComponent(item.hash)}" target="_blank" rel="noopener noreferrer">${esc(item.hash.slice(0, 12))}… ↗</a></p>`).join('')}</details>` : ''}
    </section>
    ${!configured ? `<section class="section banner">No contract address is set in <code>assets/deployment.json</code>. PRIDE will not show demo records in Real Network mode or pretend a deployment exists.</section>` : ''}
    ${configured ? `<section class="section"><div class="section-heading"><div><h2>Public commitments</h2><p>Finalized records are public. Connect a wallet to create or update one.</p></div><span class="chip neutral">${records.length} records</span></div>
      ${walletReady ? `<div class="network-register panel"><h3>Publisher identity</h3><p class="hint">Your connected wallet becomes the publisher identity. Labels and repository scope are public claims; they do not prove domain ownership.</p>
        ${publishers.some((p) => p.active && p.owner?.toLowerCase() === connectedAddress.toLowerCase()) ? '<p class="chip good">Publisher registered for this wallet</p><button class="btn btn-outline" data-network-action="revoke-publisher">Revoke publisher</button>' : `<form id="network-publisher-form" class="form-grid"><div class="field"><label for="publisher-label">Publisher label *</label><input id="publisher-label" name="label" maxlength="80" required /></div><div class="field"><label for="publisher-repo">GitHub repository scope *</label><input id="publisher-repo" name="repo" placeholder="owner/repository" maxlength="100" required /></div><div class="form-actions"><button class="btn btn-primary" type="submit">Register publisher</button></div></form>`}
      </div>
      <div class="network-register panel"><h3>Register a commitment on chain</h3><p class="hint">Wallet transactions are submitted to GenLayer Studionet. Sources must be public raw GitHub text files pinned to a 40-character commit hash in the registered repository.</p>
        <form id="network-register-form" class="form-grid">
          <div class="field"><label for="network-title">Charter title *</label><input id="network-title" name="title" maxlength="100" required /></div>
          <div class="field"><label for="network-policy">Policy type *</label><select id="network-policy" name="policy"><option value="TOKENOMICS">Tokenomics</option><option value="FEES">Public fee policy</option><option value="GOVERNANCE">Governance</option><option value="SECURITY">Security</option><option value="OTHER">Other</option></select></div>
          <div class="field"><label for="network-source">Commit-pinned raw GitHub .txt URL *</label><input id="network-source" name="source" type="url" placeholder="https://raw.githubusercontent.com/owner/repo/40-char-commit/policy.txt" required /></div>
          <div class="field"><label for="network-promise">Exact commitment *</label><textarea id="network-promise" name="promise" maxlength="1600" required></textarea></div>
          <div class="form-actions"><button class="btn btn-primary" type="submit">Register on GenLayer</button></div>
        </form>
      </div>` : '<div class="panel wallet-connect-prompt"><h3>Connect wallet to write</h3><p>After connecting on Studionet, you can register a publisher and create commitments. Read-only records below remain available without a wallet.</p></div>'}
      <div class="network-records">${records.length ? records.map((row) => `<article class="panel network-record"><div><span class="chip neutral">${esc(row.policy_type)}</span> ${row.active ? '<span class="chip good">Active</span>' : '<span class="chip">Inactive</span>'}<h3>${esc(row.title)} · v${Number(row.version || 1)}</h3><p>${esc(row.promise)}</p><a href="${esc(row.source_url)}" target="_blank" rel="noopener noreferrer">Open recorded source ↗</a><small>Signer ${esc(row.owner)} · Baseline SHA-256 ${esc(row.baseline_digest)} · Charter ${Number(row.id)}</small></div><div class="network-record-actions"><button class="btn btn-outline" data-network-check="${Number(row.id)}" ${walletReady && row.active && row.owner?.toLowerCase() === connectedAddress.toLowerCase() ? '' : 'disabled'}>Check source</button><button class="btn btn-outline" data-network-history="${Number(row.id)}">View checkpoints</button><button class="btn btn-outline" data-network-amend="${Number(row.id)}" ${walletReady && row.owner?.toLowerCase() === connectedAddress.toLowerCase() ? '' : 'disabled'}>Amend</button><button class="btn btn-outline" data-network-challenge="${Number(row.id)}" ${walletReady ? '' : 'disabled'}>Challenge</button></div></article>`).join('') : '<div class="empty">No finalized commitments are recorded at this contract.</div>'}</div>
      <div id="network-checkpoints" class="section" aria-live="polite"></div>
    </section>` : ''}`;
}

async function context(requireWallet = false) {
  const [cfg, sdk] = await Promise.all([deployment(), loadSdk()]);
  if (cfg.network !== 'studionet' || Number(cfg.chainId) !== 61999 || !allowedAddress(cfg.contractAddress)) {
    throw new Error('The deployment manifest needs a verified Studionet contract address.');
  }
  if (requireWallet) {
    const provider = await discoverWallet();
    const connection = await connectInjectedWallet(provider);
    disconnectedByUser = false;
    connectedAddress = connection.address;
    currentChainId = connection.chainIdHex;
    const chain = { ...sdk.studionet, rpcUrls: { default: { http: [cfg.rpcUrl || 'https://studio.genlayer.com/api'] } }, blockExplorers: { default: { name: 'GenLayer Studionet Explorer', url: cfg.explorerUrl || 'https://explorer-studio.genlayer.com' } } };
    const client = sdk.createClient({ chain, account: connectedAddress, provider });
    return { cfg, sdk, client, provider };
  }
  const chain = { ...sdk.studionet, rpcUrls: { default: { http: [cfg.rpcUrl || 'https://studio.genlayer.com/api'] } }, blockExplorers: { default: { name: 'GenLayer Studionet Explorer', url: cfg.explorerUrl || 'https://explorer-studio.genlayer.com' } } };
  return { cfg, sdk, client: sdk.createClient({ chain }) };
}

async function readCharters() {
  const { cfg, sdk, client } = await context();
  const value = await client.readContract({ address: cfg.contractAddress, functionName: 'get_charters', args: [], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) throw new Error('The configured contract returned an unexpected charter list.');
  records = parsed;
  const publisherValue = await client.readContract({ address: cfg.contractAddress, functionName: 'get_publishers', args: [], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
  publishers = typeof publisherValue === 'string' ? JSON.parse(publisherValue) : publisherValue;
  if (!Array.isArray(publishers)) throw new Error('The configured contract returned an unexpected publisher list.');
}

async function readContractJson(client, sdk, cfg, functionName, args = []) {
  const value = await client.readContract({ address: cfg.contractAddress, functionName, args, transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (parsed == null) throw new Error(`Contract readback failed for ${functionName}.`);
  return parsed;
}

async function verifyWriteReadback(functionName, args, client, sdk, cfg, result) {
  if (!result || result.ok !== true) throw new Error('Contract return data was not a verified { ok: true } result.');
  await readCharters();
  const address = connectedAddress.toLowerCase();
  if (functionName === 'register_publisher' && !publishers.some((p) => p.active && p.owner?.toLowerCase() === address)) throw new Error('Finalized transaction did not create the connected wallet publisher record.');
  if (functionName === 'revoke_publisher' && publishers.some((p) => p.active && p.owner?.toLowerCase() === address)) throw new Error('Publisher revocation was not present in finalized state.');
  if (functionName === 'register' && !records.some((r) => r.owner?.toLowerCase() === address && r.title === args[0] && r.source_url === args[2] && r.promise === args[3])) throw new Error('Finalized transaction did not create the requested commitment.');
  if (functionName === 'deactivate' && records.find((r) => Number(r.id) === Number(args[0]))?.active !== false) throw new Error('Commitment deactivation was not present in finalized state.');
  if (functionName === 'check_source') {
    const rows = await readContractJson(client, sdk, cfg, 'get_checks', [Number(args[0])]);
    const id = Number(result?.checkpoint_id);
    if (!Array.isArray(rows) || !rows.some((row) => Number(row.id) === id && row.digest === result?.digest && row.source_url === args[1])) throw new Error('Checkpoint transaction finalized, but its checkpoint was not verified in state.');
  }
  if (functionName === 'propose_amendment') {
    const rows = await readContractJson(client, sdk, cfg, 'get_amendments', [Number(args[0])]);
    if (!Array.isArray(rows) || !rows.some((row) => row.terms === args[2] && !row.active && (!result?.amendment_id || Number(row.id) === Number(result.amendment_id)))) throw new Error('Amendment was not present in finalized state.');
  }
  if (functionName === 'activate_amendment') {
    let found = false;
    for (const row of records) {
      const items = await readContractJson(client, sdk, cfg, 'get_amendments', [Number(row.id)]);
      if (Array.isArray(items) && items.some((item) => Number(item.id) === Number(args[0]) && item.active)) found = true;
    }
    if (!found) throw new Error('Amendment activation was not present in finalized state.');
  }
  if (functionName === 'open_challenge' || functionName === 'rebut_challenge' || functionName === 'resolve_challenge') {
    const charterIds = functionName === 'open_challenge' ? [Number(args[0])] : records.map((r) => Number(r.id));
    let matched = false;
    for (const charterId of charterIds) {
      const items = await readContractJson(client, sdk, cfg, 'get_challenges', [charterId]);
      if (!Array.isArray(items)) continue;
      matched = items.some((item) => functionName === 'open_challenge'
        ? Number(item.checkpoint_id) === Number(args[1]) && item.challenger?.toLowerCase() === address && item.evidence_quote === args[3]
        : Number(item.id) === Number(args[0]) && (functionName === 'rebut_challenge' ? item.status === 'REBUTTED' && item.rebuttal_quote === args[2] : item.status === 'INCONCLUSIVE'));
      if (matched) break;
    }
    if (!matched) throw new Error('Challenge transaction finalized, but the expected challenge state was not found.');
  }
}

async function recoverPendingTransactions() {
  const pending = transactions.filter((item) => ['PENDING', 'ACCEPTED', 'FINALIZED_READBACK_PENDING', 'FINALIZED_READBACK_UNVERIFIED'].includes(item.status));
  if (!pending.length) return;
  const { cfg, client, sdk } = await context();
  let changed = false;
  const finalized = [];
  for (const item of pending) {
    try {
      const receipt = await client.getTransactionReceipt({ hash: item.hash });
      if (!receipt) continue;
      const status = receipt.statusName || receipt.status_name || (Number(receipt.status) === 7 ? 'FINALIZED' : String(receipt.status || ''));
      if (status !== 'FINALIZED') continue;
      const result = receipt.resultName || receipt.result_name;
      const returned = receipt.txExecutionResultName === 'FINISHED_WITH_RETURN'
        || receipt.consensus_data?.leader_receipt?.some((entry) => entry.execution_result === 'SUCCESS' && entry.result?.status === 'return');
      item.status = result === 'MAJORITY_AGREE' && returned ? 'FINALIZED_READBACK_UNVERIFIED' : 'FAILED';
      if (item.status === 'FINALIZED_READBACK_UNVERIFIED') {
        const value = receipt.consensus_data?.leader_receipt?.find((entry) => entry.result?.status === 'return')?.result?.value;
        let decoded;
        try { decoded = typeof value === 'string' ? JSON.parse(value) : value; } catch { decoded = undefined; }
        finalized.push({ item, decoded });
      }
      changed = true;
    } catch { /* RPC may not have indexed this transaction yet; retry next visit. */ }
  }
  if (changed) {
    await readCharters();
    const previousAddress = connectedAddress;
    for (const { item, decoded } of finalized) {
      if (!item.action || !Array.isArray(item.args) || !item.account) continue;
      connectedAddress = item.account;
      try {
        await verifyWriteReadback(item.action, item.args, client, sdk, cfg, decoded);
        item.status = 'FINALIZED';
      } catch { /* do not promote an unverified readback */ }
    }
    connectedAddress = previousAddress;
    try { localStorage.setItem(TX_KEY, JSON.stringify(transactions)); } catch { /* local recovery remains best effort */ }
  }
}

async function submit(functionName, args) {
  const { cfg, sdk, client } = await context(true);
  operation = { message: 'Waiting for wallet signature. Review the network cost in your wallet…' };
  frame();
  const txHash = await client.writeContract({
    address: cfg.contractAddress,
    functionName,
    args,
    value: 0n,
  });
  rememberTransaction({ hash: txHash, action: functionName, args, status: 'ACCEPTED', at: new Date().toISOString(), account: connectedAddress });
  operation = { message: `Submitted ${txHash}. Waiting for finalization…`, hash: txHash, status: 'PENDING' };
  frame();
  try {
    const receipt = await client.waitForTransactionReceipt({ hash: txHash, status: sdk.TransactionStatus.FINALIZED, interval: 5000, retries: 120 });
    const receiptStatus = receipt.statusName || receipt.status_name || (Number(receipt.status) === 7 ? 'FINALIZED' : String(receipt.status || ''));
    const receiptResult = receipt.resultName || receipt.result_name;
    const consensusAgreed = receiptResult === 'MAJORITY_AGREE';
    const executionReturned = receipt.txExecutionResultName === 'FINISHED_WITH_RETURN'
      || receipt.consensus_data?.leader_receipt?.some((entry) => entry.execution_result === 'SUCCESS' && entry.result?.status === 'return');
    const successful = consensusAgreed && executionReturned;
    const finalized = receiptStatus === sdk.TransactionStatus.FINALIZED;
    if (!finalized || !successful) {
      operation = { hash: txHash, status: finalized ? 'EXECUTION_FAILED' : (receiptStatus || 'UNDETERMINED'), message: `Transaction ${finalized ? 'finalized with failed execution' : (receiptStatus || 'not finalized')}: ${txHash}` };
      rememberTransaction({ hash: txHash, action: functionName, args, status: operation.status, at: new Date().toISOString(), account: connectedAddress });
    } else {
      const returnValue = receipt.consensus_data?.leader_receipt?.find((entry) => entry.result?.status === 'return')?.result?.value;
      let decoded = returnValue && typeof returnValue === 'object' ? returnValue : undefined;
      if (typeof returnValue === 'string') {
        try {
          decoded = JSON.parse(returnValue);
          if (decoded?.ok === false) throw new Error(`Contract rejected the operation: ${decoded.error || 'UNKNOWN'}`);
        } catch (error) {
          if (error instanceof SyntaxError) throw new Error('Finalized receipt did not expose decodable contract return data.');
          else throw error;
        }
      }
      operation = { hash: txHash, status: 'FINALIZED_READBACK_PENDING', message: `Transaction finalized. Verifying contract state for ${txHash}…` };
      rememberTransaction({ hash: txHash, action: functionName, args, status: operation.status, at: new Date().toISOString(), account: connectedAddress });
      frame();
      await verifyWriteReadback(functionName, args, client, sdk, cfg, decoded);
      operation = { hash: txHash, status: 'FINALIZED', message: `Finalized and verified in contract state: ${txHash}` };
      rememberTransaction({ hash: txHash, action: functionName, args, status: 'FINALIZED', at: new Date().toISOString(), account: connectedAddress });
    }
  } catch (error) {
    const status = String(operation?.status || '').startsWith('FINALIZED') ? 'FINALIZED_READBACK_UNVERIFIED' : 'PENDING';
    rememberTransaction({ hash: txHash, action: functionName, args, status, at: new Date().toISOString(), account: connectedAddress });
    operation = { hash: txHash, status, message: status === 'PENDING' ? `Submitted ${txHash}; finalization is still unconfirmed. Refresh to check again. ${error?.message || ''}` : `Transaction finalized, but state readback could not be verified. Check again before treating it as successful. ${error?.message || ''}` };
  }
  frame();
}

export async function mountNetwork(target, notify) {
  mountedTarget = target;
  notifyUser = notify || (() => {});
  try {
    const cfg = await deployment();
    target.dataset.configured = String(cfg.network === 'studionet' && Number(cfg.chainId) === 61999 && allowedAddress(cfg.contractAddress));
    if (target.dataset.configured === 'true') {
      await readCharters();
      await recoverPendingTransactions();
    }
  } catch (error) {
    operation = { message: error?.message || 'Network setup could not be loaded.' };
  }
  frame();
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-network-action],button[data-network-check],button[data-network-history],button[data-network-amend],button[data-network-challenge],button[data-wallet-switch]');
  if (!button || (!mountedTarget?.contains(button) && button.id !== 'wallet-header-action' && button.id !== 'wallet-switch-network')) return;
  try {
    if (button.dataset.walletSwitch !== undefined) {
      operation = { message: 'Switching wallet to GenLayer Studionet…' };
      frame();
      const cfg = await deployment();
      const provider = await discoverWallet();
      const result = await switchInjectedWalletToStudionet(provider, cfg.rpcUrl, cfg.explorerUrl);
      currentChainId = result.chainIdHex;
      operation = { message: `Wallet switched to GenLayer Studionet (61999). Connected as ${connectedAddress}.` };
      await readCharters();
      frame();
    } else if (button.dataset.networkAction === 'connect') {
      operation = { message: 'Connecting wallet and reading finalized registry…' };
      frame();
      await context(true);
      await readCharters();
      operation = null;
      frame();
    } else if (button.dataset.networkAction === 'disconnect') {
      connectedAddress = '';
      currentChainId = '';
      disconnectedByUser = true;
      operation = { message: 'Disconnected from PRIDE on this site. Manage wallet permissions in your wallet settings.' };
      frame();
    } else if (button.dataset.networkAction === 'revoke-publisher') {
      await submit('revoke_publisher', []);
    } else if (button.dataset.networkCheck !== undefined) {
      const source = window.prompt('New commit-pinned raw GitHub .txt source URL in this publisher repository?');
      if (!source) return;
      await submit('check_source', [Number(button.dataset.networkCheck), source.trim()]);
    } else if (button.dataset.networkAmend !== undefined) {
      const id = Number(button.dataset.networkAmend);
      const source = window.prompt('New immutable raw GitHub .txt source URL?');
      if (!source) return;
      const terms = window.prompt('Exact revised commitment terms?');
      if (!terms) return;
      const disclosure = window.prompt('Immutable disclosure notice URL?');
      if (!disclosure) return;
      await submit('propose_amendment', [id, source, terms, disclosure]);
    } else if (button.dataset.networkChallenge !== undefined) {
      const id = Number(button.dataset.networkChallenge);
      const checkpoint = Number(window.prompt('Checkpoint ID to challenge?'));
      if (!Number.isInteger(checkpoint)) return;
      const source = window.prompt('Immutable raw GitHub .txt evidence URL?');
      if (!source) return;
      const quote = window.prompt('Exact supporting quote from that source (max 240 characters)?');
      if (!quote) return;
      await submit('open_challenge', [id, checkpoint, source, quote]);
    } else if (button.dataset.networkHistory !== undefined) {
      const { cfg, sdk, client } = await context();
      const value = await client.readContract({ address: cfg.contractAddress, functionName: 'get_checks', args: [Number(button.dataset.networkHistory)], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
      const history = typeof value === 'string' ? JSON.parse(value) : value;
      const output = mountedTarget.querySelector('#network-checkpoints');
      if (!Array.isArray(history)) throw new Error('The contract returned an invalid checkpoint list.');
      const amendmentsValue = await client.readContract({ address: cfg.contractAddress, functionName: 'get_amendments', args: [Number(button.dataset.networkHistory)], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
      const amendments = typeof amendmentsValue === 'string' ? JSON.parse(amendmentsValue) : amendmentsValue;
      const challengesValue = await client.readContract({ address: cfg.contractAddress, functionName: 'get_challenges', args: [Number(button.dataset.networkHistory)], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
      const challenges = typeof challengesValue === 'string' ? JSON.parse(challengesValue) : challengesValue;
      output.innerHTML = `<div class="section-heading"><div><h2>Verified history for commitment ${Number(button.dataset.networkHistory)}</h2><p>Finalized snapshots include full source text, content digest, outcome, and exact supporting quote.</p></div></div>${history.length ? history.map((item) => `<article class="panel network-record"><div><span class="chip warn">${esc(item.outcome)}</span><p>${esc(item.evidence_excerpt)}</p><code>${esc(item.content_digest)}</code><small>${esc(item.source_url)}</small><details><summary>Inspect captured source</summary><pre>${esc(item.text)}</pre></details></div></article>`).join('') : '<div class="empty">No checkpoints are stored for this commitment.</div>'}<h3>Amendments</h3>${amendments.length ? amendments.map((item) => `<article class="panel"><p>Version ${Number(item.version)} · ${item.active ? 'Activated' : 'Pending activation'}</p><p>${esc(item.terms)}</p><code>Previous ${esc(item.previous_digest)} → next ${esc(item.next_digest)}</code>${!item.active ? `<button class="btn btn-outline" data-network-action="activate-amendment" data-id="${Number(item.id)}">Activate amendment</button>` : ''}</article>`).join('') : '<div class="empty">No amendments.</div>'}<h3>Challenges</h3>${challenges.length ? challenges.map((item) => `<article class="panel"><p>Challenge ${Number(item.id)} · ${esc(item.status)}</p><p>${esc(item.evidence_quote)}</p><small>Evidence SHA-256 ${esc(item.evidence_digest)}</small>${item.status === 'OPEN' ? `<button class="btn btn-outline" data-network-action="rebut-challenge" data-id="${Number(item.id)}">Rebut with evidence</button><button class="btn btn-outline" data-network-action="resolve-challenge" data-id="${Number(item.id)}">Close inconclusive</button>` : ''}</article>`).join('') : '<div class="empty">No challenges.</div>'}`;
    }
  } catch (error) {
    operation = { message: error?.message || 'The network action failed.' };
    frame();
    notifyUser(operation.message);
  }
});

document.addEventListener('submit', async (event) => {
  if (!['network-register-form', 'network-publisher-form'].includes(event.target.id) || !mountedTarget?.contains(event.target)) return;
  event.preventDefault();
  const data = new FormData(event.target);
  if (event.target.id === 'network-publisher-form') {
    try {
      await submit('register_publisher', [String(data.get('label') || '').trim(), String(data.get('repo') || '').trim()]);
    } catch (error) {
      operation = { message: error?.message || 'Publisher registration failed.' };
      frame();
      notifyUser(operation.message);
    }
    return;
  }
  const source = String(data.get('source') || '').trim();
  let parsed;
  try { parsed = new URL(source); } catch { parsed = null; }
  if (!parsed || parsed.protocol !== 'https:' || parsed.username || parsed.password) {
    notifyUser('Use a public HTTPS source URL without embedded credentials.');
    return;
  }
  try {
    await submit('register', [String(data.get('title') || ''), String(data.get('policy') || ''), source, String(data.get('promise') || '')]);
  } catch (error) {
    operation = { message: error?.message || 'The write could not be submitted.' };
    frame();
    notifyUser(operation.message);
  }
});

document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-network-action="activate-amendment"],button[data-network-action="rebut-challenge"],button[data-network-action="resolve-challenge"]');
  if (!button || !mountedTarget?.contains(button)) return;
  try {
    const id = Number(button.dataset.id);
    if (button.dataset.networkAction === 'activate-amendment') await submit('activate_amendment', [id]);
    if (button.dataset.networkAction === 'rebut-challenge') {
      const source = window.prompt('Immutable evidence URL?');
      if (!source) return;
      const quote = window.prompt('Exact quote from the evidence?');
      if (!quote) return;
      await submit('rebut_challenge', [id, source, quote]);
    }
    if (button.dataset.networkAction === 'resolve-challenge') await submit('resolve_challenge', [id, 'INCONCLUSIVE']);
  } catch (error) {
    operation = { message: error?.message || 'The network action failed.' };
    frame();
    notifyUser(operation.message);
  }
});
