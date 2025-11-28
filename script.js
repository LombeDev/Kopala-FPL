// --- 1. SHEETS CONFIG ---
const mySheets = [
    { name: "FPL Standings", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=1209971248&single=true&output=csv", menuName: "FPL Standings" },
    { name: "Paid", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=2125414706&single=true&output=csv", menuName: "Paid" },
    { name: "Fixtures", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=1206177471&single=true&output=csv", menuName: "Fixtures" },
    { name: "EPL Table", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=354834265&single=true&output=csv", menuName: "EPL Table" },
    { name: "Prices", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLnwzzchPmS_XsOfbDhpmthovFZ8ZA-Q5n924xmqLCHU8SikjO57XNl_iVqxgHq402-fcXGomwNOAz/pub?gid=534532114&single=true&output=csv", menuName: "Prices" }
];

// ⚠️ Note: Your mySheets config only has 5 items, but your visual menu has 17.
// I recommend updating mySheets to include all 17 items if they link to data,
// or deciding which of the 17 links correspond to which of the 5 sheets.
// For this script, I will only bind the first 5 visual links to the 5 sheets.

// DOM
const grid = document.getElementById('data-grid');
const navBtns = document.getElementById('nav-btns');
const sheetTitle = document.getElementById('current-sheet-name');

// New DOM elements from the updated HTML
const mobileDropdownMenu = document.getElementById('mobile-dropdown-menu');
const mobileMenuItems = mobileDropdownMenu ? mobileDropdownMenu.querySelectorAll('.menu-item') : [];


let currentSheetIndex = 0;

// Since the toggle logic is now in the HTML on the .menu-button, 
// we remove the old hamburger toggle logic:
// hamburger.onclick = () => { ... }
// We also remove the mobileMenu and mobileMenuBtns constants.

/**
 * Renders the desktop navigation buttons and marks the current one as active.
 * We only need to render for the desktop nav now.
 */
function renderNavButtons(container) {
    container.innerHTML = '';
    mySheets.forEach((sheet, idx) => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn' + (idx === currentSheetIndex ? ' active' : '');
        btn.innerText = sheet.name;

        btn.onclick = () => {
            loadSheet(idx);
            // No need to hide the mobile menu here since this is desktop nav
        };

        container.appendChild(btn);
    });
}

/**
 * Binds the click event to the new visual mobile menu items.
 * Only binds the first N items, where N is the length of mySheets.
 */
function bindMobileMenuListeners() {
    mobileMenuItems.forEach((item, idx) => {
        // Only bind listeners for the sheets we actually have data for
        if (idx < mySheets.length) {
            item.onclick = (e) => {
                e.preventDefault(); // Prevent default anchor link behavior
                loadSheet(idx);
                // Hide the menu after selection
                mobileDropdownMenu.style.display = "none"; 
            };
        } else {
            // Optional: Handle the other 12 links (e.g., if they are external or static pages)
            item.onclick = (e) => {
                e.preventDefault();
                alert(`Clicked: ${item.innerText.trim()}. This item does not have a sheet assigned.`);
                mobileDropdownMenu.style.display = "none";
            };
        }
    });
}
// Function to handle the phone call
function initiateSubscriptionCall() {
    // ⚠️ REPLACE THIS WITH THE ACTUAL PHONE NUMBER
    const phoneNumber = '+1234567890'; 
    window.location.href = `tel:${phoneNumber}`;
}

// Find the subscribe button in the DOM
const subscribeButton = document.querySelector('.subscribe-button');

// Add the click listener
if (subscribeButton) {
    subscribeButton.addEventListener('click', initiateSubscriptionCall);
}

function loadSheet(idx) {
    currentSheetIndex = idx;

    // Update the active state for the desktop nav
    renderNavButtons(navBtns); 
    
    // Optional: Visually mark the active mobile link (if needed, this requires more CSS/JS)

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
    // 1. Initialize desktop nav
    renderNavButtons(navBtns);
    // 2. Bind listeners to the new mobile menu items
    bindMobileMenuListeners();
    // 3. Load the default sheet
    loadSheet(0);
}

initMenu();
