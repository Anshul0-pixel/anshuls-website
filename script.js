let websites = JSON.parse(localStorage.getItem("websites")) || [];


// ============================
// ADD WEBSITE
// ============================

function addWebsite() {

    const name = document.getElementById("websiteName").value.trim();
    const url = document.getElementById("websiteURL").value.trim();
    const purpose = document.getElementById("websitePurpose").value.trim();
    const category = document.getElementById("websiteCategory").value;

    if (!name || !url || !purpose) {
        alert("Please fill in all fields.");
        return;
    }

    const website = {
        id: Date.now(),
        name: name,
        url: url,
        purpose: purpose,
        category: category,
        favorite: false,
        createdAt: Date.now()
    };

    websites.push(website);

    saveWebsites();

    document.getElementById("websiteName").value = "";
    document.getElementById("websiteURL").value = "";
    document.getElementById("websitePurpose").value = "";

    displayWebsites();
}


// ============================
// SAVE
// ============================

function saveWebsites() {

    localStorage.setItem(
        "websites",
        JSON.stringify(websites)
    );
}


// ============================
// DELETE
// ============================

function deleteWebsite(id) {

    websites = websites.filter(function(website) {

        return website.id !== id;

    });

    saveWebsites();

    displayWebsites();
}


// ============================
// FAVORITE
// ============================

function toggleFavorite(id) {

    const website = websites.find(function(website) {

        return website.id === id;

    });

    if (website) {

        website.favorite = !website.favorite;

    }

    saveWebsites();

    displayWebsites();
}


// ============================
// EDIT
// ============================

function editWebsite(id) {

    const website = websites.find(function(website) {

        return website.id === id;

    });

    if (!website) {
        return;
    }

    const newName = prompt(
        "Website name:",
        website.name
    );

    if (newName === null) {
        return;
    }

    const newURL = prompt(
        "Website URL:",
        website.url
    );

    if (newURL === null) {
        return;
    }

    const newPurpose = prompt(
        "Website purpose:",
        website.purpose
    );

    if (newPurpose === null) {
        return;
    }


    // Choose category

    const newCategory = prompt(
        "Category:\n\n" +
        "Study\n" +
        "Entertainment\n" +
        "Tools\n" +
        "Social Media\n" +
        "Work\n" +
        "Other",
        website.category || "Other"
    );

    if (newCategory === null) {
        return;
    }


    if (
        !newName.trim() ||
        !newURL.trim() ||
        !newPurpose.trim()
    ) {

        alert("All fields are required.");

        return;
    }


    website.name = newName.trim();
    website.url = newURL.trim();
    website.purpose = newPurpose.trim();
    website.category = newCategory.trim() || "Other";


    saveWebsites();

    displayWebsites();
}


// ============================
// DISPLAY WEBSITES
// ============================

function displayWebsites() {

    const list = document.getElementById(
        "websiteList"
    );

    const search = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        ).value;


    list.innerHTML = "";


    // SEARCH

    let filteredWebsites = websites.filter(
        function(website) {

            const matchesSearch =
                website.name
                    .toLowerCase()
                    .includes(search) ||

                website.purpose
                    .toLowerCase()
                    .includes(search) ||

                website.url
                    .toLowerCase()
                    .includes(search);


            // CATEGORY

            const matchesCategory =
                selectedCategory === "All" ||
                (website.category || "Other")
                    === selectedCategory;


            return matchesSearch &&
                   matchesCategory;
        }
    );


    // NEWEST FIRST

    filteredWebsites.sort(
        function(a, b) {

            return b.createdAt - a.createdAt;

        }
    );


    // FAVORITES FIRST

    filteredWebsites.sort(
        function(a, b) {

            return Number(b.favorite) -
                   Number(a.favorite);

        }
    );


    // CREATE CARDS

    filteredWebsites.forEach(
        function(website) {

            const card =
                document.createElement("div");

            card.className =
                "website-card";


            if (website.favorite) {

                card.classList.add(
                    "favorite-card"
                );

            }


            const category =
                website.category || "Other";


            card.innerHTML = `

                <div class="category-badge">
                    ${getCategoryIcon(category)}
                    ${escapeHTML(category)}
                </div>

                <h2>
                    ${website.favorite ? "⭐ " : ""}
                    ${escapeHTML(website.name)}
                </h2>

                <a
                    href="${escapeAttribute(website.url)}"
                    target="_blank">

                    ${escapeHTML(website.url)}

                </a>

                <p>
                    <strong>Purpose:</strong>
                    ${escapeHTML(website.purpose)}
                </p>

                <div class="card-buttons">

                    <button
                        class="open-btn"
                        onclick="openWebsite(${website.id})">

                        🔗 Open

                    </button>

                    <button
                        class="favorite-btn"
                        onclick="toggleFavorite(${website.id})">

                        ${
                            website.favorite
                            ? "⭐ Unfavorite"
                            : "☆ Favorite"
                        }

                    </button>

                    <button
                        class="edit-btn"
                        onclick="editWebsite(${website.id})">

                        ✏️ Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteWebsite(${website.id})">

                        🗑️ Delete

                    </button>

                </div>
            `;


            list.appendChild(card);

        }
    );


    updateCounter();
}


// ============================
// CATEGORY ICON
// ============================

function getCategoryIcon(category) {

    const icons = {

        "Study": "📚",

        "Entertainment": "🎬",

        "Tools": "🛠️",

        "Social Media": "📱",

        "Work": "💻",

        "Other": "🌐"

    };

    return icons[category] || "🌐";
}


// ============================
// OPEN WEBSITE
// ============================

function openWebsite(id) {

    const website =
        websites.find(
            function(website) {

                return website.id === id;

            }
        );


    if (website) {

        window.open(
            website.url,
            "_blank"
        );

    }
}


// ============================
// COUNTER
// ============================

function updateCounter() {

    const counter =
        document.getElementById(
            "websiteCounter"
        );

    const count = websites.length;


    if (count === 1) {

        counter.textContent =
            "1 website saved";

    } else {

        counter.textContent =
            count + " websites saved";

    }
}


// ============================
// DARK MODE
// ============================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const darkMode =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        darkMode
    );


    updateDarkModeButton();
}


function updateDarkModeButton() {

    const button =
        document.getElementById(
            "darkModeBtn"
        );


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        button.textContent =
            "☀️ Light Mode";

    } else {

        button.textContent =
            "🌙 Dark Mode";

    }
}


// ============================
// SAFE TEXT
// ============================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(text) {

    return escapeHTML(text);
}


// ============================
// START
// ============================

if (
    localStorage.getItem("darkMode")
    === "true"
) {

    document.body.classList.add("dark");

}


displayWebsites();

updateDarkModeButton();           
/* ===== OPENING ANIMATION ===== */

const introText = document.getElementById("introText");
const intro = document.getElementById("intro");
const mainWebsite = document.getElementById("mainWebsite");

const websiteName = "Anshul's Website";
let letter = 0;

function typeWebsiteName() {
    if (letter < websiteName.length) {
        introText.textContent += websiteName[letter];
        letter++;

        setTimeout(typeWebsiteName, 120);
    } else {
        setTimeout(() => {
            intro.style.opacity = "0";
            mainWebsite.classList.add("show");

            setTimeout(() => {
                intro.style.display = "none";
            }, 800);

        }, 1000);
    }
}

window.addEventListener("load", typeWebsiteName);