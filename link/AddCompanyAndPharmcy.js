document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://backendpharm-production.up.railway.app/api/admin";
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // ---------------------------------------
    // دالة تحميل بيانات الأدمن وعدد الشركات والصيدليات
    // ---------------------------------------
    async function loadAdminInfo() {
        try {
            const response = await fetch(`${API_URL}/getinfo`, {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // تحديث عناصر DOM
            const adminName = document.getElementById("admin_name");
            const adminEmail = document.getElementById("admin_email");
            const numComp = document.getElementById("number_of_comp");
            const numPharm = document.getElementById("number_of_pharm");

            if (adminName) adminName.value = data.name;
            if (adminEmail) adminEmail.value = data.email;
            if (numComp) numComp.innerText = data.num_of_company;
            if (numPharm) numPharm.innerText = data.num_of_pharmcy;

        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    }

    // تحميل البيانات عند بدء الصفحة
    loadAdminInfo();

    // ---------------------------------------
    // إضافة شركة
    // ---------------------------------------
    const btnAddComp = document.getElementById("btn_add_comp");
    if (btnAddComp) {
        btnAddComp.addEventListener("click", async function (e) {
            e.preventDefault();

            const email = document.getElementById("comp_email").value.trim();
            const password = document.getElementById("comp_password").value.trim();

            if (!email || !password) {
                alert("Please enter email and password");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/addcompany`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        name: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                alert("Company added successfully!");
                document.getElementById("comp_email").value = "";
                document.getElementById("comp_password").value = "";

                loadAdminInfo(); // تحديث العدد

            } catch (err) {
                alert("Error connecting to server");
                console.log(err);
            }
        });
    }

    // ---------------------------------------
    // إضافة صيدلية
    // ---------------------------------------
    const btnAddPharm = document.getElementById("btn_add_pharm");
    if (btnAddPharm) {
        btnAddPharm.addEventListener("click", async function (e) {
            e.preventDefault();

            const email = document.getElementById("pharm_email").value.trim();
            const password = document.getElementById("pharm_password").value.trim();
            const location = document.getElementById("pharm_location").value.trim();

            if (!email || !password || !location) {
                alert("Please enter all fields");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/addpharmacy`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        name: email,
                        password: password,
                        location: location
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                alert("Pharmacy added successfully!");
                document.getElementById("pharm_email").value = "";
                document.getElementById("pharm_password").value = "";
                document.getElementById("pharm_location").value = "";

                loadAdminInfo(); // تحديث العدد

            } catch (err) {
                alert("Error connecting to server");
                console.log(err);
            }
        });
    }
});
