/**
 * Cards block
 *
 * Authored table (one row per card):
 *   | Cards |
 *   | <picture> | <h3>Title</h3><p>Description</p><p><a href="…">CTA</a></p> |
 *
 * Reuses platform-delivered <picture> and <a> nodes — no recreation.
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Move original row children into the <li> so we preserve <picture>/<a>.
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.classList.add('cards-card-image');
      } else {
        cell.classList.add('cards-card-body');
      }
      li.append(cell);
    });

    ul.append(li);
  });

  // Optimise images — keep existing <img> but ensure dimensions/lazy attrs
  // are present (platform usually sets these; this is defence-in-depth).
  ul.querySelectorAll('img').forEach((img) => {
    if (!img.loading) img.loading = 'lazy';
    if (!img.decoding) img.decoding = 'async';
  });

  block.replaceChildren(ul);
}
