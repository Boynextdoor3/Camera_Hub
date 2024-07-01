import { modalOpen } from "./modal.js";
import { collectFormData } from "./modal.js";

export async function sendData() {
    await fetch("http://localhost:4000/camera/create", {
        method: "POST",
        body: collectFormData(),
    });
}

async function removeCamera(id, cloudinaryPublicId) {
    let deleteParams = JSON.stringify({ _id: id, cloudinaryPublicId });
    await fetch("http://localhost:4000/camera/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: deleteParams,
    }).then(() => {
        getAndShowAllCamers(); 
    });
}

export const getAndShowAllCamers = async (searchTerm = "") => {
    try {
      const response = await fetch(`http://localhost:4000/camera/list?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      const dataContainer = document.querySelector(".dataContainer");
      dataContainer.innerHTML = ""; 
      const { camers } = data;
      camers.forEach((camera) => {
        let cameraCard = document.createElement("div");
        cameraCard.classList.add("element");
  
        cameraCard.innerHTML = `
          <img src="${camera.image}" class="element-img">
          <div class="element-data">
            <div class="element-name">${camera.name}</div>
            <p class="element-text">Type: <span class="element-type">${camera.type}</span></p>
            <p class="element-text">Brand: <span class="element-brand">${camera.brand}</span></p>
            <p class="element-text">Video: <span class="element-video">${camera.video}</span></p>
            <p class="element-text">Panel: <span class="element-panel">${camera.panel}</span> MP</p>
            <p class="element-text">Weight: <span class="element-weight">${camera.weight}</span> g</p>
            <div class="element-footer">
              <button class="btn btn-primary" id="edit${camera._id}">Edit</button>
              <button class="btn btn-danger" id="remove${camera._id}">Delete</button>
            </div>
          </div>
        `;
  
        dataContainer.appendChild(cameraCard);
  
        const editBtn = document.getElementById(`edit${camera._id}`);
        editBtn.addEventListener("click", () => {
          editCamera(
            camera._id,
            camera.name,
            camera.type,
            camera.brand,
            camera.video,
            camera.panel,
            camera.weight,
            camera.image,
            camera.cloudinaryPublicId
          );
        });
        const removeBtn = document.getElementById(`remove${camera._id}`);
        removeBtn.addEventListener("click", () => {
          if (confirm(`Do you really want to remove camera ${camera.name}`)) {
            removeCamera(camera._id, camera.cloudinaryPublicId);
          }
        });
      });
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

export const editCamera = (id, name, type, brand, video, panel, weight, img, cloud) => {
    document.getElementById("cameraId").value = id;
    document.getElementById("cameraName").value = name;
    document.getElementById("cameraType").value = type;
    document.getElementById("cameraBrand").value = brand;
    document.getElementById("cameraVideo").value = video;
    document.getElementById("cameraPanel").value = panel;
    document.getElementById("cameraWeight").value = weight;
    document.getElementById("formImage").setAttribute("src", img);
    document.getElementById("oldCloudinaryPublicId").value = cloud;
    document.getElementById("oldImagePath").value = img;
    modalOpen();
};