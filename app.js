// countryside

const apiURL = 'https://restcountries.com/v3.1/all';
const countryListElement = document.getElementById('country-list');
const searchInput = document.getElementById('search');
const filterRegion = document.getElementById('filter-region');
const themeToggle = document.getElementById('theme-toggle');
const controls = document.getElementById('controls');

// Fetch countries from API
async function fetchCountries() {
    const response = await fetch(apiURL);
    const countries = await response.json();
    displayCountries(countries)
}

fetchCountries();

// Display countries in the list
function displayCountries(countries) {
    countryListElement.innerHTML = '';
    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country-card');
        countryCard.innerHTML = `
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
            <h2>${country.name.common}</h2>
            <p><strong>Population:</strong> ${country.population.toLocaleString('en').replace(/,/g, ".")}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
        `;
        countryCard.addEventListener('click', () => displayCountryDetails(country));
        countryListElement.appendChild(countryCard);
    });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    fetch(apiURL)
        .then(response => response.json())
        .then(countries => {
            const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(query));
            displayCountries(filteredCountries);
        });
});

// Filter by region
filterRegion.addEventListener('change', (e) => {
    const region = e.target.value;
    fetch(apiURL)
        .then(response => response.json())
        .then(countries => {
            const filteredCountries = region ? countries.filter(country => country.region === region) : countries;
            displayCountries(filteredCountries);
        });
});

// Dark/light mode toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Show detailed country information
function displayCountryDetails(country) {
    const countryDetails = document.getElementById('country-details');
    controls.style.display = 'none';
    countryDetails.innerHTML = `
        <button class="back-btn" onclick="hideDetails()">
            <img src="./images/back.svg" alt="Back Arrow"> Back
        </button>
        <img src="${country.flags.svg}" alt="${country.name.common} flag">
        <div>
            <h2>${country.name.common}</h2>
            <p><strong>Native Name:</strong> ${country.name.nativeName ? country.name.nativeName.common : country.name.common}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString('en').replace(/,/g, '.')}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Subregion:</strong> ${country.subregion}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Top Level Domain:</strong> ${country.tld[0]}</p>
            <p><strong>Currencies:</strong> ${Object.values(country.currencies).map(c => c.name).join(', ')}</p>
            <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
            <h3>Border Countries:</h3>
            <div class="border-buttons">
                ${country.borders ? country.borders.map(border => `<button onclick="fetchBorderCountry('${border}')">${border}</button>`).join('') : 'No borders'}
            </div>
        </div>
    `;
    countryListElement.style.display = 'none';
    countryDetails.style.display = 'flex';
}

// Fetch border country details
function fetchBorderCountry(countryCode) {
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then(response => response.json())
        .then(data => {
            displayCountryDetails(data[0]);
        });
}

// Hide details and show country list
function hideDetails() {
    document.getElementById('country-details').style.display = 'none';
    countryListElement.style.display = 'grid';
    controls.style.display = 'flex';
}