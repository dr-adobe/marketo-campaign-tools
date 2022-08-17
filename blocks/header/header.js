import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // TODO: Restructure HTML (linked image, inline nav)
  // TODO: Create structure for mobile (hamburger)

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const content = new DOMParser().parseFromString(html, "text/html");

    // decorate nav DOM
    const nav = document.createElement('nav');
    
    // Create Clickable Logo
    const homeLink = content.querySelector("p:nth-child(2) > a");
    const logo = content.querySelector("p > picture");
    const img = logo.querySelector(':scope > img');
    img.removeAttribute("width");
    img.removeAttribute("height");
    homeLink.innerHTML = logo.outerHTML;
    const logoDiv = document.createElement('div');
    logoDiv.innerHTML = homeLink.outerHTML;
    nav.prepend(logoDiv);

    // Create Menu Items
    const menu = content.querySelector("ul");
    menu.setAttribute("style", `--num-menu-items:${menu.querySelectorAll(':scope > li').length}`);
    nav.append(menu);
    decorateIcons(nav);

    block.append(nav);
  }
}
