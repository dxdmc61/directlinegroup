/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.directlinegroup.co.uk/en/index.html
 * DOM: div.banner.imagecarousel > div.carousel.image-carousel > ul.carousel > li.slide-image
 * Each slide has: background-image in .slideinner, h1 heading, h2 subheading, CTA links
 * Target: 2-column table per slide: [image | heading + subheading + CTAs]
 */
export default function parse(element, { document }) {
  // Find all slides in the carousel
  // DOM: <li class="slide-image dark|light"> > <div class="slideinner" style="background-image: url(...)">
  const slides = element.querySelectorAll('li.slide-image, .slick-slide');
  const cells = [];

  slides.forEach((slide) => {
    // Extract background image from slideinner div
    const slideInner = slide.querySelector('.slideinner, [style*="background-image"]');
    let imageCell = [];

    if (slideInner) {
      const bgStyle = slideInner.getAttribute('style') || '';
      const bgMatch = bgStyle.match(/url\(([^)]+)\)/);
      if (bgMatch) {
        const imgUrl = bgMatch[1].replace(/['"]/g, '');
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = '';
        imageCell.push(img);
      }
    }

    // Fallback: check for regular img elements
    if (imageCell.length === 0) {
      const img = slide.querySelector('img');
      if (img) imageCell.push(img);
    }

    // Extract text content: h1 heading, h2 subheading, CTA links
    // DOM: .carousel-text h1, .carousel-text-2 h2, .carousel-links a
    const contentCell = [];

    const heading = slide.querySelector('.carousel-text h1, .carousel-text-inner h1, h1');
    if (heading) contentCell.push(heading);

    const subheading = slide.querySelector('.carousel-text-2 h2, .carousel-text-inner h2, h2');
    if (subheading) contentCell.push(subheading);

    const ctaLinks = slide.querySelectorAll('.carousel-links a, .link1 a, .link2 a');
    ctaLinks.forEach((link) => {
      const p = document.createElement('p');
      p.appendChild(link.cloneNode(true));
      contentCell.push(p);
    });

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
