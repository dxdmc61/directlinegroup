export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: Background image
  const bgRow = rows[0];
  if (bgRow) {
    const pic = bgRow.querySelector('picture');
    if (pic) {
      pic.classList.add('hero-azure-bg');
      block.prepend(pic);
    }
    bgRow.remove();
  }

  // Row 2: Heading + description
  const contentRow = rows[1];
  if (contentRow) {
    const contentDiv = contentRow.querySelector('div') || contentRow;
    contentDiv.classList.add('hero-azure-content');
    if (contentRow !== contentDiv) {
      block.append(contentDiv);
      contentRow.remove();
    } else {
      contentRow.classList.add('hero-azure-content');
    }
  }

  // Row 3: Tab links
  const tabsRow = rows[2];
  if (tabsRow) {
    const tabsDiv = document.createElement('nav');
    tabsDiv.classList.add('hero-azure-tabs');
    tabsDiv.setAttribute('aria-label', 'Page navigation');
    const links = tabsRow.querySelectorAll('a');
    links.forEach((link) => {
      link.classList.add('hero-azure-tab');
      // Mark current page tab as active
      if (link.getAttribute('href') === window.location.pathname
        || link.getAttribute('href') === `${window.location.pathname}/`) {
        link.classList.add('hero-azure-tab-active');
        link.setAttribute('aria-current', 'page');
      }
      tabsDiv.append(link);
    });
    block.append(tabsDiv);
    tabsRow.remove();
  }
}
