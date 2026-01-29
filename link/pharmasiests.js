const token = localStorage.getItem("token");
const API_URL = "http://majd.shooubadvance.com/api/admin/allpharmacy";

async function loadPharmacies() {
    try {
        const response = await fetch(API_URL, {
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

        const container = document.getElementById("pharm-cards");
        container.innerHTML = "";

        data.data.forEach(pharm => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="content">
                    <div class="details">
                        <div class="name">
                            <i class="fa fa-user-circle" style="margin: 10px;"></i>
                            <h3>name: <span>${pharm.name}</span></h3>
                        </div>
                        <div class="place">
                            <i class="fa fa-map-marker" style="margin: 10px;"></i>
                            <h3>location: <span>${pharm.location}</span></h3>
                        </div>
                        <div class="profit">
                            <i class="fa fa-dollar" style="margin: 10px;"></i>
                            <h3>profit: <span>${pharm.total_prof}</span></h3>
                        </div>
                        <div class="sals">
                            <i class="fa fa-line-chart" style="margin: 10px;"></i>
                            <h3>sales: <span>${pharm.quantity_sales}</span></h3>
                        </div>
                    </div>
                    <div class="btns">
                        <button class="delete" data-id="${pharm.id}">Delete</button>
                        <button class="details"><a href="PharmacyDetails.html?id=${pharm.id}">Details</a></button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                if (confirm("Are you sure you want to delete this pharmacy?")) {
                    await deletePharmacy(id);
                    loadPharmacies();
                }
            });
        });

    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
}

// delete pharm
const API_URL2 = "http://majd.shooubadvance.com/api/admin/deletepharmacy";

async function deletePharmacy(id) {
    try {
        const response = await fetch(`${API_URL2}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
        } else {
            alert("Pharmacy deleted successfully!");
        }
    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
}

loadPharmacies();