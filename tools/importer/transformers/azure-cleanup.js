/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for Azure pages.
 * Removes header, footer, nav, cookie consent, tracking pixels, and Microsoft universal header/footer.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    const { document } = payload;

    // Remove header, footer, nav elements
    const removeSelectors = [
      'header',
      'footer',
      'nav',
      // Cookie consent
      '.oc-cookie-consent',
      '#cookie-consent',
      '#msccBannerV2',
      '#uhfCookieAlert',
      '[class*="cookie"]',
      // Microsoft universal header/footer
      '[class*="c-uhf"]',
      '.c-uhfh',
      '#headerArea',
      '#headerRegion',
      '#headerUniversalHeader',
      '.universalheader',
      '#uhf-footer',
      '[class*="uhf"]',
      // Tracking pixels
      'img[src*="demdex"]',
      'img[src*="everesttech"]',
      'img[src*="doubleclick"]',
      'img[src*="facebook"]',
      'img[src*="analytics"]',
      'img[width="1"][height="1"]',
      'img[width="0"][height="0"]',
      // Script remnants
      'script',
      'noscript',
      'link[rel="stylesheet"]',
      'style',
      // Skip to main content links
      '.m-skip-to-main',
      '#uhfSkipToMain',
      // Hidden/utility elements
      '.d-none',
      '.x-hidden',
      '.geo-info',
      '#modalsRenderedAfterPageLoad',
      '#page-top',
    ];

    removeSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Remove empty divs that are just wrappers
    document.querySelectorAll('div:empty').forEach((el) => el.remove());
  }
}
