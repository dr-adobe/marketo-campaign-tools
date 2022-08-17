import {
    decorateMain,
    loadBlocks,
  // eslint-disable-next-line import/no-unresolved
  } from '../../scripts/scripts.js';

export default async function decorate(block) {

    const tabs = block.querySelectorAll(':scope > div');

    let headings = document.createElement("div");
    headings.classList.add("tab-headings");
    headings.style.setProperty('--num-tabs', tabs.length);
    block.prepend(headings);
    let firstTab = true;

    for(let tab of tabs) {
        const content = tab.querySelector(":scope > div > a");
        // TODO: Create the clickable title
        const title = content.getAttribute("title");
        const tabClass = `tab-${title.toLowerCase().replace(/\s/g, '')}`;
        tab.classList.add("tab-content", tabClass);

        let titleDiv = document.createElement("div");
        titleDiv.innerHTML = title;
        titleDiv.classList.add('tab-title', tabClass);
        titleDiv.addEventListener("click", () => {
            titleDiv.classList.add("active");
            collapseAllExcept(block, tabClass);
        })
        headings.append(titleDiv);
        
        // Hide other tabs
        if (!firstTab) {
            tab.classList.add("collapsed");
        } else {
            titleDiv.classList.add("active");
        }
        firstTab = false;

        // Fetch and load content for the tab
        const path = new URL(content.getAttribute("href"), window.location.origin).pathname.split(".")[0];
        const resp = await fetch(`${path}.plain.html`);
        if (resp.ok) {
            const fragment = document.createElement('div');
            fragment.classList.add("fragment-wrapper");
            fragment.innerHTML = await resp.text();
            decorateMain(fragment);
            await loadBlocks(fragment);
            tab.innerHTML = '';
            tab.prepend(fragment);
        }
    }
}

function collapseAllExcept(block, tab) {
    block.querySelectorAll(`:scope > div.tab-content:not(.${tab})`)
        .forEach(tab => {
            tab.classList.add("collapsed");
        })

    block.querySelectorAll(`:scope > .tab-headings > .tab-title:not(.${tab})`)
        .forEach(tab => {
            tab.classList.remove("active");
        })

    block.querySelector(`:scope > div.tab-content.${tab}`).classList.remove("collapsed");
}