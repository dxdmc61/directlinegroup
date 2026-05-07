export default function decorate(block) {
  const rows = [...block.children];
  const accordion = document.createElement('div');
  accordion.classList.add('accordion-list');

  rows.forEach((row, index) => {
    const cols = [...row.children];
    const item = document.createElement('details');
    item.classList.add('accordion-item');

    // Question (column 1)
    const summary = document.createElement('summary');
    summary.classList.add('accordion-question');
    const questionContent = cols[0]?.innerHTML || '';
    summary.innerHTML = `<span class="accordion-number">${String(index + 1).padStart(2, '0')}</span><span class="accordion-question-text">${questionContent}</span><span class="accordion-icon" aria-hidden="true"></span>`;
    item.append(summary);

    // Answer (column 2)
    if (cols[1]) {
      const answer = document.createElement('div');
      answer.classList.add('accordion-answer');
      answer.innerHTML = cols[1].innerHTML;
      item.append(answer);
    }

    accordion.append(item);
    row.remove();
  });

  block.append(accordion);
}
