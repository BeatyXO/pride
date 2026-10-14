export const STUDIONET_CHAIN_ID = 61999;
export const STUDIONET_CHAIN_HEX = '0xf22f';

export function isInjectedProvider(provider) {
  return Boolean(provider && typeof provider.request === 'function');
}

export async function connectInjectedWallet(provider) {
  if (!isInjectedProvider(provider)) throw new Error('No injected EIP-1193 wallet was found.');
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const address = String(Array.isArray(accounts) ? accounts[0] || '' : '');
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) throw new Error('The wallet did not return a valid account.');
  const rawChainId = String(await provider.request({ method: 'eth_chainId' }) || '').toLowerCase();
  const chainId = rawChainId.startsWith('0x') ? Number.parseInt(rawChainId.slice(2), 16) : Number(rawChainId);
  if (chainId !== STUDIONET_CHAIN_ID) throw new Error('Wrong wallet network. Switch the wallet to GenLayer Studionet (chain 61999) and retry.');
  return { address, chainId, chainIdHex: STUDIONET_CHAIN_HEX };
}

export function subscribeWallet(provider, handlers) {
  if (typeof provider?.on !== 'function') return () => {};
  const accountsChanged = (accounts) => handlers.accountsChanged?.(String(accounts?.[0] || ''));
  const chainChanged = (chainId) => handlers.chainChanged?.(String(chainId || '').toLowerCase());
  const disconnect = () => handlers.disconnect?.();
  provider.on('accountsChanged', accountsChanged);
  provider.on('chainChanged', chainChanged);
  provider.on('disconnect', disconnect);
  return () => {
    provider.removeListener?.('accountsChanged', accountsChanged);
    provider.removeListener?.('chainChanged', chainChanged);
    provider.removeListener?.('disconnect', disconnect);
  };
}
