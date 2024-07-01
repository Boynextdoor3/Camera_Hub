import { getAndShowAllCamers } from "./camera.js";
import { sendData } from "./camera.js";

export function collectFormData() {
    const cameraForm = document.forms["cameraForm"];
    let formData = new FormData(cameraForm);
    document.getElementById("cameraId").removeAttribute('value');
    document.getElementById("oldCloudinaryPublicId").removeAttribute("value");
    document.getElementById("oldImagePath").removeAttribute("value");
    cameraForm.reset();
    return formData;
}

export function buildModal(params) {
    const modalContaiter = document.querySelector(".modal-container");
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.classList.add("modal-close");
    modalOverlay.dataset.close = "true";
    modalOverlay.setAttribute("id", "modalOverlay");
    modalOverlay.innerHTML = `
    <div class="modal-window">
    
        <div class="modal-header">
            <span class="modal-title">Camera Options</span>
            <span class="modal-close-btn" data-close="true">&times;</span>
        </div>
    
        <div class="modal-content">
            <form name="cameraForm" enctype="multipart/form-data" method="post">
                <input type="hidden" name="cameraId" id="cameraId">
                <input type="hidden" name="oldCloudinaryPublicId" id="oldCloudinaryPublicId">
                <input type="hidden" name="oldImagePath" id="oldImagePath">
                <table class="form-table">
                    <tr>
                        <td class="form-label"><label for="cameraName">Camera name:</label> </td>
                        <td class="form-input"><input type="text" name="cameraName" id="cameraName" class="form-control" required></td>
                    </tr>
                    <tr>
                        <td class="form-label"><label for="cameraType">Camera type:</label> </td>
                        <td class="form-input">
                            <select name="cameraType" id="cameraType" class="form-select" >
                                <option>Digital compacts</option>
                                <option>Mirrorless camers</option>
                                <option>DSLR camers</option>
                            </select>
                        </td>
                    </tr>
                     <tr>
                        <td class="form-label"><label for="cameraBrand">Camera brand:</label> </td>
                        <td class="form-input"><input type="text" name="cameraBrand" id="cameraBrand" class="form-control" required></td>
                    </tr>
                     <tr>
                        <td class="form-label"><label for="cameraVideo">Camera video:</label> </td>
                        <td class="form-input"><input type="text" name="cameraVideo" id="cameraVideo" class="form-control" required></td>
                    </tr>
                    <tr>
                        <td class="form-label"><label for="cameraPanel">Camera panel:</label> </td>
                        <td class="form-input"><input type="number" name="cameraPanel" id="cameraPanel" class="form-control" min="1" max="100" required></td>
                    </tr>
                    <tr>
                        <td class="form-label"><label for="cameraWeight">Camera weight:</label> </td>
                        <td class="form-input"><input type="number" name="cameraWeight" id="cameraWeight" class="form-control" min="100" max="1000" required></td>
                    </tr>
                    <tr>
                        <td colspan="2" class="form-image-container">
                            <img class="form-image" id="formImage" >
                        </td>
                    </tr>
                    <tr>
                        <td class="form-label"><label for="cameraImage">Camera image:</label> </td>
                        <td class="form-input"><input type="file" name="cameraImage" id="cameraImage" class="form-control" ></td>
                    </tr>
                </table>
                <div class="modal-footer">
                    <input type="submit" class="btn btn-success" id="submitBtn" value="Confirm">
                    <input type="reset" class="btn btn-danger" id="cancelBtn" data-close="true" value="Cancel">
                </div>
            </form>
        </div>
</div>`;
    modalContaiter.appendChild(modalOverlay);
    modalOverlay.addEventListener("click", listener);

    const cameraImage = document.getElementById("cameraImage");
    cameraImage.addEventListener("change", function () {
        document.getElementById("formImage").src = window.URL.createObjectURL(
            this.files[0]
        );
    });

    const cameraForm = document.forms["cameraForm"];
    cameraForm.addEventListener("submit", (e) => {
        e.preventDefault();

        modalClose();
        sendData().then(() => {
            getAndShowAllCamers();
        });
    });
}

export const modalOpen = () => {
    modalOverlay.classList.remove("modal-close");
    modalOverlay.classList.add("modal-open");
};

function modalClose() {
    modalOverlay.classList.remove("modal-open");
    modalOverlay.classList.add("modal-close");
    document.getElementById("formImage").removeAttribute("src");
}

const listener = (event) => {
    if (event.target.dataset.close) {
        modalClose();
    }
};
