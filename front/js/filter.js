import { getAndShowAllCamers } from "./camera.js";

const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    getAndShowAllCamers(searchTerm);
});

// Функція для сортування
const sortSelect = document.querySelector(".sort-select");

sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;
    getAndShowAllCamers("", sortBy);
});

const typeCheckboxes = document.querySelectorAll(".filter-type");

typeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const checkedTypes = Array.from(typeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        getAndShowAllCamers("", "", checkedTypes);
    });
});

// Функція для фільтрації за брендом
const brandCheckboxes = document.querySelectorAll(".filter-brand");

brandCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const checkedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        getAndShowAllCamers("", "", [], checkedBrands);
    });
});