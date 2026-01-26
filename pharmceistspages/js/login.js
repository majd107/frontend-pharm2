document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://backendpharm-production.up.railway.app/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role_id", data.user.role_id);

        if (data.user.role_id == 1) {
            window.location.href = "../admin/index.html";
        }
        else if (data.user.role_id == 2) {
            window.location.href = "../pharmceistspages/pharmciestHome.html";
        }
        else if (data.user.role_id == 3) {
            window.location.href = "../companypages/companyHome.html";
        }
        else {
            alert("Unknown role!");
        }

    } catch (error) {
        console.log(error);
        alert("Error connecting to the server");
    }
})

