/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Direct Line Group cleanup.
 * Selectors from captured DOM of https://www.directlinegroup.co.uk/en/index.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent dialogs and overlays (OneTrust)
    // Found in DOM: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '[class*="cookie"]',
    ]);

    // Remove alert banner (fraud warning)
    // Found in DOM: <div class="dg-alert">
    WebImporter.DOMUtils.remove(element, ['.dg-alert']);

    // Remove mobile menu (duplicates desktop nav)
    // Found in DOM: <div id="navmenumobile">
    WebImporter.DOMUtils.remove(element, ['#navmenumobile']);

    // Remove hidden backing panel
    // Found in DOM: <div id="backingpanel">
    WebImporter.DOMUtils.remove(element, ['#backingpanel', '.backinghighlight']);
  }

  if (hookName === H.after) {
    // Remove header and footer (global chrome, not authorable)
    // Found in DOM: <header class="site-header-wrapper fixed-header">
    // Found in DOM: <footer class="site-footer-wrapper">
    WebImporter.DOMUtils.remove(element, [
      'header.site-header-wrapper',
      'footer.site-footer-wrapper',
      'header',
      'footer',
    ]);

    // Remove navigation elements
    // Found in DOM: <nav> with topnavmultimenu
    WebImporter.DOMUtils.remove(element, [
      'nav',
      '.topnavmultimenu',
      '.mobilemenu',
    ]);

    // Remove share price widget
    // Found in DOM: <div class="shareprice parbase">
    WebImporter.DOMUtils.remove(element, ['.shareprice']);

    // Remove search field
    // Found in DOM: <div class="searchfield">
    WebImporter.DOMUtils.remove(element, ['.searchfield']);

    // Remove scroll-down anchor
    // Found in DOM: <a href="#brandsectionhomepage" id="downbutton">
    WebImporter.DOMUtils.remove(element, ['#downbutton']);

    // Remove insights section (dynamic feed, not statically importable)
    // Found in DOM: <section class="insights-section">
    WebImporter.DOMUtils.remove(element, ['section.insights-section']);

    // Remove safe elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-emptytext');
    });
  }
}
