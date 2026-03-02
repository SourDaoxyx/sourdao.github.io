/**
 * Mobile wallet detection & deep-link helpers.
 *
 * On mobile browsers (Safari / Chrome), there is no Phantom or Solflare
 * browser extension. The user must open the dApp inside the wallet's
 * **in-app browser** for `window.phantom` / `window.solflare` to exist.
 *
 * These helpers detect mobile and generate universal links that open the
 * current page inside the wallet app.
 */

/** Returns true when running on a mobile device (phone / tablet). */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

/** Returns true when the Phantom provider is already injected (desktop ext or in-app browser). */
export function isPhantomInstalled(): boolean {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!((window as Record<string, any>).phantom?.solana?.isPhantom);
}

/** Returns true when the Solflare provider is already injected. */
export function isSolflareInstalled(): boolean {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!((window as Record<string, any>).solflare?.isSolflare);
}

/**
 * True when on mobile AND no wallet provider is injected.
 * This means the user is in a regular mobile browser and needs to be
 * redirected to a wallet's in-app browser via deep link.
 */
export function isMobileWithoutProvider(): boolean {
  return isMobile() && !isPhantomInstalled() && !isSolflareInstalled();
}

/**
 * Phantom universal link — opens the given URL inside Phantom's in-app browser.
 * @see https://docs.phantom.app/phantom-deeplinks/provider/browse
 */
export function getPhantomBrowseLink(url?: string): string {
  const target = url ?? (typeof window !== "undefined" ? window.location.href : "https://sourdao.xyz/crust");
  return `https://phantom.app/ul/browse/${encodeURIComponent(target)}?ref=${encodeURIComponent("https://sourdao.xyz")}`;
}

/**
 * Solflare universal link — opens the given URL inside Solflare's in-app browser.
 * @see https://docs.solflare.com/solflare/technical/deeplinks
 */
export function getSolflareBrowseLink(url?: string): string {
  const target = url ?? (typeof window !== "undefined" ? window.location.href : "https://sourdao.xyz/crust");
  return `https://solflare.com/ul/v1/browse/${encodeURIComponent(target)}`;
}
