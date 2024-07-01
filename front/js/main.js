import { modalOpen } from "./modal.js";
import { getAndShowAllCamers } from "./camera.js";
import { buildModal } from "./modal.js";

const createBtn = document.getElementById("createBtn");
createBtn.addEventListener("click", modalOpen);

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value;
  getAndShowAllCamers(searchTerm);
});

buildModal();
getAndShowAllCamers();