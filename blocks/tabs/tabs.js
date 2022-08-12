import { loadFragment } from "../fragment/fragment";

export default function decorate(block) {

    const tabs = block.querySelectorAll(':scope > div');

    let headings = document.createElement("div");
    headings.classList.add("tab-headings");
    headings.style.setProperty('--num-tabs', tabs.length);
    block.prepend(headings);

    tabs.forEach(tab => {
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
        // TODO: Fetch and populate the content
        loadFragment(content, tabClass);
    })
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