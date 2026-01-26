
// for login by faceId
document.addEventListener("DOMContentLoaded", async () => {

    const faceLoginBtn = document.getElementById("faceLoginBtn");
    const faceModal = document.getElementById("faceModal");
    const video = document.getElementById("video");

    await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("./models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("./models");

    faceLoginBtn.addEventListener("click", async () => {

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

        const res = await fetch("https://backendpharm-production.up.railway.app//api/loginFace2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                face_descriptor: descriptor
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem("token", data.token);
        alert("Login successful!");

        faceModal.style.display = "none";

        window.location.href = "../pharmceistspages/pharmciestHome.html";
    });

});


document.getElementById("cancel").addEventListener("click", () => {

    const video = document.getElementById("video");
    const stream = video.srcObject;

    if (stream) {
        stream.getTracks().forEach(track => track.stop()); 
        video.srcObject = null;
    }

    const faceModal = document.getElementById("faceModal");
    faceModal.style.display = "none";

    window.location.href = "../pharmceistspages/login.html";
});
