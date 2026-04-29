async function loadCountry() {
    const countryName = document.getElementById("countryInputName").value.trim();
    const status = document.getElementById("status");
    const card = document.getElementById("countryCard");

    // Validate input
    if (!countryName) {
        status.textContent = "Please enter a country name";
        card.classList.add("hidden");
        return;
    }

    try {
        status.textContent = "Loading...";
        card.classList.add("hidden");

        const response = await fetch(`/api/country/${countryName.toLowerCase()}`);

        if (!response.ok) {
            throw new Error("Country not found!");
        }

        const country = await response.json();

        // Populate the card
        document.getElementById("countryFlag").src = country.flag;
        document.getElementById("countryFlag").alt = country.flagAlt;
        document.getElementById("countryName").textContent = country.country;
        document.getElementById("countryRegion").textContent = country.region;
        document.getElementById("countryCapital").textContent = country.capital;

        const languages = []

        for (const value of Object.values(country.languages)) {
            languages.push(value);
        }

        document.getElementById("countryLanguages").textContent = languages.join(", ")

        status.textContent = "";
        card.classList.remove("hidden");

    } catch (error) {
        status.textContent = "Error: " + error.message;
        card.classList.add("hidden");
        console.error(error);
    }
}

// Allow pressing Enter to search
document.getElementById("countryInputName").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        loadCountry();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("countryInputName").focus();
})