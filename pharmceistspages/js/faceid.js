document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const faceBtn = document.getElementById("faceBtn");
    const faceModal = document.getElementById("faceModal");
    const video = document.getElementById("video");

    await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("./models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

    faceBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        faceModal.style.display = "flex";

        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => video.srcObject = stream);
    });

    document.getElementById("captureFace").addEventListener("click", async () => {

        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            alert("Face not detected, try again.");
            return;
        }

        const descriptor = Array.from(detection.descriptor);

        const res = await fetch("https://backendpharm-production.up.railway.app/api/pharmacy/saveFace", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                face_descriptor: descriptor
            })
        });

        const data = await res.json();
        alert(data.message);

        faceModal.style.display = "none";
    });

});


