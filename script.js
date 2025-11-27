// --- 1. SHEETS CONFIG ---
const mySheets = [
    { name: "FPL Standings", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=1209971248&single=true&output=csv" },
    { name: "Paid", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=2125414706&single=true&output=csv" },
    { name: "Fixtures", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=1206177471&single=true&output=csv" },
    { name: "EPL Table", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=354834265&single=true&output=csv" },
    { name: "Prices", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=534532114&single=true&output=csv" }
];

// DOM
const grid = document.getElementById('data-grid');
const navBtns = document.getElementById('nav-btns');
const sheetTitle = document.getElementById('current-sheet-name');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtns = document.getElementById('mobile-menu-btns');
const hamburger = document.getElementById("hamburger");

let currentSheetIndex = 0;

// Hamburger toggle
hamburger.onclick = () => {
    mobileMenu.style.display = 
        mobileMenu.style.display === "block" ? "none" : "block";
};

function renderNavButtons(container) {
    container.innerHTML = '';
    mySheets.forEach((sheet, idx) => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn' + (idx === currentSheetIndex ? ' active' : '');
        btn.innerText = sheet.name;

        btn.onclick = () => {
            loadSheet(idx);
            mobileMenu.style.display = "none";
        };

        container.appendChild(btn);
    });
}

function loadSheet(idx) {
    currentSheetIndex = idx;

    renderNavButtons(navBtns);
    renderNavButtons(mobileMenuBtns);

    sheetTitle.innerText = mySheets[idx].name;
    grid.innerHTML = '<div class="spinner"></div>';


    fetch(mySheets[idx].url)
        .then(res => res.text())
        .then(csv => {
            const rows = csv.split('\n').map(r => r.trim()).filter(r => r.length > 0);
            const headers = rows[0].split(',');

            grid.innerHTML = '';
            const table = document.createElement('table');
            table.className = 'fpl-table';

            table.innerHTML = `
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>
                    ${rows.slice(1).map(row => {
                        const cols = row.split(',');
                        return `<tr>${cols.map((val, j) => `<td>${val || '-'}</td>`).join('')}</tr>`;
                    }).join('')}
                </tbody>
            `;

            grid.appendChild(table);
        })
        .catch(() => grid.innerHTML = '<div class="loading">Error loading data</div>');
}

function initMenu() {
    renderNavButtons(navBtns);
    renderNavButtons(mobileMenuBtns);
    loadSheet(0);
}
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuBtns = document.getElementById("mobile-menu-btns");

// Reuse your function to generate buttons
function renderMobileMenu() {
    mobileMenuBtns.innerHTML = '';
    mySheets.forEach((sheet, idx) => {
        const btn = document.createElement("button");
        btn.className = "nav-btn" + (idx === currentSheetIndex ? " active" : "");
        btn.innerText = sheet.name;
        btn.onclick = () => {
            loadSheet(idx);
            mobileMenu.classList.remove("active"); // Close menu
        };
        mobileMenuBtns.appendChild(btn);
    });
}

// Toggle panel
hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove("active");
    }
});

initMenu();
