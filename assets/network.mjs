let sdkPromise;
let configPromise;
let mountedTarget;
let notifyUser = () => {};
let records = [];
let connectedAddress = '';
let operation = null;

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

function frame() {
  if (!mountedTarget) return;
  const configured = mountedTarget.dataset.configured === 'true';
  mountedTarget.innerHTML = `
    <section class="network-hero panel">
      <span class="eyebrow">REAL NETWORK</span>
      <h1 class="title">Verified chain <span class="gradient-text">records.</span></h1>
      <p class="lead">This view reads only the configured GenLayer contract. Its data stays separate from the local showcase.</p>
      <div class="network-state" role="status" aria-live="polite">${esc(operation?.message || (!configured ? 'Deployment is not configured.' : (connectedAddress ? `Wallet connected: ${connectedAddress}` : 'Connect a wallet to read the public registry.')))}</div>
      <div class="form-actions">
        ${configured ? `<button class="btn btn-primary" data-network-action="connect">${connectedAddress ? 'Refresh registry' : 'Connect wallet and read'}</button>` : ''}
        ${connectedAddress ? `<span class="chip neutral">${esc(connectedAddress.slice(0, 8))}…${esc(connectedAddress.slice(-6))}</span>` : ''}
      </div>
    </section>
    ${!configured ? `<section class="section banner">No contract address is set in <code>assets/deployment.json</code>. PRIDE will not show demo records in Real Network mode or pretend a deployment exists.</section>` : ''}
    ${configured ? `<section class="section"><div class="section-heading"><div><h2>Public charters</h2><p>Read at the latest finalized state.</p></div><span class="chip neutral">${records.length} records</span></div>
      <div class="network-register panel"><h3>Register a charter on chain</h3><p class="hint">The wallet will prompt you to sign and submit a GenLayer transaction. Review the network cost in your wallet before approving.</p>
        <form id="network-register-form" class="form-grid">
          <div class="field"><label for="network-title">Charter title *</label><input id="network-title" name="title" maxlength="100" required /></div>
          <div class="field"><label for="network-policy">Policy type *</label><select id="network-policy" name="policy"><option value="TOKENOMICS">Tokenomics</option><option value="FEES">Public fee policy</option></select></div>
          <div class="field"><label for="network-source">HTTPS source URL *</label><input id="network-source" name="source" type="url" placeholder="https://…" required /></div>
          <div class="field"><label for="network-promise">Exact commitment *</label><textarea id="network-promise" name="promise" maxlength="1600" required></textarea></div>
          <div class="form-actions"><button class="btn btn-primary" type="submit">Register on GenLayer</button></div>
        </form>
      </div>
      <div class="network-records">${records.length ? records.map((row) => `<article class="panel network-record"><div><span class="chip neutral">${esc(row.policy_type)}</span> ${row.active ? '<span class="chip good">Active</span>' : '<span class="chip">Inactive</span>'}<h3>${esc(row.title)}</h3><p>${esc(row.promise)}</p><a href="${esc(row.source_url)}" target="_blank" rel="noopener noreferrer">Open recorded source</a><small>Signer ${esc(row.owner)} · Charter ${Number(row.id)}</small></div><div class="network-record-actions"><button class="btn btn-outline" data-network-check="${Number(row.id)}" ${row.active ? '' : 'disabled'}>Check source</button><button class="btn btn-outline" data-network-history="${Number(row.id)}">View checkpoints</button></div></article>`).join('') : '<div class="empty">No finalized charters are recorded at this contract.</div>'}</div>
      <div id="network-checkpoints" class="section" aria-live="polite"></div>
    </section>` : ''}`;
}

async function context(requireWallet = false) {
  const [cfg, sdk] = await Promise.all([deployment(), loadSdk()]);
  if (cfg.network !== 'studionet' || !allowedAddress(cfg.contractAddress)) {
    throw new Error('The deployment manifest needs a verified Studionet contract address.');
  }
  if (requireWallet) {
    if (!window.ethereum?.request) throw new Error('No EIP-1193 wallet is available in this browser.');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedAddress = String(accounts?.[0] || '');
    if (!connectedAddress) throw new Error('The wallet did not provide an account.');
    const client = sdk.createClient({ chain: sdk.studionet, account: connectedAddress, provider: window.ethereum });
    await client.connect('studionet');
    return { cfg, sdk, client };
  }
  return { cfg, sdk, client: sdk.createClient({ chain: sdk.studionet }) };
}

async function readCharters() {
  const { cfg, sdk, client } = await context();
  const value = await client.readContract({ address: cfg.contractAddress, functionName: 'get_charters', args: [], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) throw new Error('The configured contract returned an unexpected charter list.');
  records = parsed;
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
    operation = {
      hash: txHash,
      status: !finalized ? (receiptStatus || 'UNDETERMINED') : (successful ? 'FINALIZED' : 'ERROR'),
      message: `Transaction ${!finalized ? (receiptStatus || 'UNDETERMINED') : (successful ? 'FINALIZED' : 'ERROR')}: ${txHash}`,
    };
    if (finalized && successful) await readCharters();
  } catch (error) {
    operation = { hash: txHash, status: 'PENDING', message: `Submitted ${txHash}; finalization is still unconfirmed. Refresh to check again. ${error?.message || ''}` };
  }
  frame();
}

export async function mountNetwork(target, notify) {
  mountedTarget = target;
  notifyUser = notify || (() => {});
  try {
    const cfg = await deployment();
    target.dataset.configured = String(cfg.network === 'studionet' && allowedAddress(cfg.contractAddress));
    if (target.dataset.configured === 'true') await readCharters();
  } catch (error) {
    operation = { message: error?.message || 'Network setup could not be loaded.' };
  }
  frame();
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-network-action],button[data-network-check],button[data-network-history]');
  if (!button || !mountedTarget?.contains(button)) return;
  try {
    if (button.dataset.networkAction === 'connect') {
      operation = { message: 'Connecting wallet and reading finalized registry…' };
      frame();
      await context(true);
      await readCharters();
      operation = null;
      frame();
    } else if (button.dataset.networkCheck !== undefined) {
      await submit('check_source', [Number(button.dataset.networkCheck)]);
    } else if (button.dataset.networkHistory !== undefined) {
      const { cfg, sdk, client } = await context();
      const value = await client.readContract({ address: cfg.contractAddress, functionName: 'get_checks', args: [Number(button.dataset.networkHistory)], transactionHashVariant: sdk.TransactionHashVariant.LATEST_FINAL });
      const history = typeof value === 'string' ? JSON.parse(value) : value;
      const output = mountedTarget.querySelector('#network-checkpoints');
      if (!Array.isArray(history)) throw new Error('The contract returned an invalid checkpoint list.');
      output.innerHTML = `<div class="section-heading"><div><h2>Finalized checkpoints for charter ${Number(button.dataset.networkHistory)}</h2><p>Evidence digest and exact stored excerpt from contract state.</p></div></div>${history.length ? history.map((item) => `<article class="panel network-record"><div><span class="chip warn">${esc(item.outcome)}</span><p>${esc(item.evidence_excerpt)}</p><code>${esc(item.content_digest)}</code><small>${esc(item.source_url)}</small></div></article>`).join('') : '<div class="empty">No checkpoints are stored for this charter.</div>'}`;
    }
  } catch (error) {
    operation = { message: error?.message || 'The network action failed.' };
    frame();
    notifyUser(operation.message);
  }
});

document.addEventListener('submit', async (event) => {
  if (event.target.id !== 'network-register-form' || !mountedTarget?.contains(event.target)) return;
  event.preventDefault();
  const data = new FormData(event.target);
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
