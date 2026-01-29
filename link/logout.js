document.getElementById("btn_logout").addEventListener("click", async function (e) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found, please login");
        window.location.href = "../pharmceistspages/index.html";

    }

    try {
        const res = await fetch("http://majd.shooubadvance.com/api/admin/logout", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        localStorage.removeItem("token");

        window.location.href = "../pharmceistspages/index.html";

    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
});
