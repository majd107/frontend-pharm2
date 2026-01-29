async function loadAdminInfo() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://majd.shooubadvance.com/api/pharmacy/getinfo", {
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        }
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("company_name").value = data.name;
        document.getElementById("company_email").value = data.email;
        document.getElementById("company_password").value = "";
        document.getElementById("company_confirm_password").value = "";
        document.getElementById("location").value = data.location;



    } else {
        alert(data.message);
    }
}

loadAdminInfo();
