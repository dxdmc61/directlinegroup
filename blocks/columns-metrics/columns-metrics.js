export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.classList.add('columns-metrics-grid');

  rows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.classList.add('columns-metrics-card');

    // Detect stat cards by looking for large numbers
    const text = row.textContent.trim();
    const hasLargeNumber = /^\d+[%+]?$/.test(text.split('\n')[0]?.trim());

    if (hasLargeNumber || cols.length === 1) {
      card.classList.add('columns-metrics-stat');
    } else {
      card.classList.add('columns-metrics-case-study');
    }

    while (row.firstElementChild) card.append(row.firstElementChild);
    grid.append(card);
    row.remove();
  });

  block.append(grid);
}
