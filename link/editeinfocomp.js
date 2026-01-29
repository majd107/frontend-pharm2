
document.getElementById("btn_edit_company").addEventListener("click", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const name = document.getElementById("company_name").value.trim();
    const email = document.getElementById("company_email").value.trim();
    const location = document.getElementById("location").value.trim();
 

    let bodyData = {};

    if (name !== "") bodyData.name = name;
    if (email !== "") bodyData.email = email;
    if (location !== "") bodyData.location = location;

    try {
        const response = await fetch("http://majd.shooubadvance.com/api/company/updatecompany", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("company updated successfully!");

    } catch (error) {
        console.error(error);
        alert("Error connecting to server");
    }
});