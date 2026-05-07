export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.classList.add('columns-metrics-grid');

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.classList.add('columns-metrics-card');

    // Detect image cards vs stat cards
    const pic = row.querySelector('picture');
    const text = row.textContent.trim();
    const hasLargeNumber = /^\d+[%+]?/.test(text.split('\n')[0]?.trim());

    if (pic && !hasLargeNumber) {
      card.classList.add('columns-metrics-case-study');
    } else {
      card.classList.add('columns-metrics-stat');
    }

    while (row.firstElementChild) card.append(row.firstElementChild);
    grid.append(card);
  });

  // Remove original rows
  while (block.firstChild) block.firstChild.remove();
  block.append(grid);
}
