import { getAndShowAllCamers } from "./camera.js";

const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    getAndShowAllCamers(searchTerm);
});