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
    contentRow.classList.add('hero-azure-content');
  }

  // Row 3: Tab links
  const tabsRow = rows[2];
  if (tabsRow) {
    tabsRow.classList.add('hero-azure-tabs');
    const links = tabsRow.querySelectorAll('a');
    links.forEach((link) => {
      link.classList.add('hero-azure-tab');
    });
  }
}
