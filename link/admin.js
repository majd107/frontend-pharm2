
// update form
document.getElementById("btn_edit_admin").addEventListener("click", async function (e) {
    e.preventDefault();

    // const token = localStorage.getItem("token");

    const name = document.getElementById("admin_name").value.trim();
    const email = document.getElementById("admin_email").value.trim();

    

    let bodyData = {};

    if (name !== "") bodyData.name = name;
    if (email !== "") bodyData.email = email;

    try {
        const response = await fetch("http://majd.shooubadvance.com/api/admin/updateAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + window.token,
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Admin updated successfully!");

    } catch (error) {
        console.error(error);
        alert("Error connecting to server");
    }
});


document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    const res = await fetch("http://majd.shooubadvance.com/api/admin/allPharmaciesProfit", {
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        }
    });

    const data = await res.json();

    const ctx = document.getElementById('profitChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'profit of pharmacies',
                data: data.profits,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'profit'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'name\'s pharmcy '
                    }
                }
            }
        }
    });
});
