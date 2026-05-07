export default function decorate(block) {
  const rows = [...block.children];
  const accordion = document.createElement('div');
  accordion.classList.add('accordion-faq-list');

  rows.forEach((row, index) => {
    const cols = [...row.children];
    const item = document.createElement('details');
    item.classList.add('accordion-faq-item');

    // Question (column 1)
    const summary = document.createElement('summary');
    summary.classList.add('accordion-faq-question');
    const questionContent = cols[0]?.innerHTML || '';
    summary.innerHTML = `<span class="accordion-faq-number">${String(index + 1).padStart(2, '0')}</span>${questionContent}`;
    item.append(summary);

    // Answer (column 2)
    if (cols[1]) {
      const answer = document.createElement('div');
      answer.classList.add('accordion-faq-answer');
      answer.innerHTML = cols[1].innerHTML;
      item.append(answer);
    }

    accordion.append(item);
    row.remove();
  });

  block.append(accordion);
}
