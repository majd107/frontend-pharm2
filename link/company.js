document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("https://backendpharm-production.up.railway.app/api/admin/allcompany", {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        const companies = data.data;
        const container = document.querySelector(".cards");

        container.innerHTML = ""; 

        companies.forEach(company => {

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="content">
                    <div class="details">

                        <div class="name">
                            <i class="fa fa-user-circle" style="margin: 10px;"></i>
                            <h3>Name: <span>${company.name}</span></h3>
                        </div>

                        <div class="place">
                            <i class="fa fa-map-marker" style="margin: 10px;"></i>
                            <h3>location: <span>${company.location}</span></h3>
                        </div>

                        <div class="profit">
                            <i class="fas fa-box-open" style="margin: 10px;"></i>
                            <h3>Medicines: <span>${company.drugs_num}</span></h3>
                        </div>

                    </div>

                    <div class="btns">
                        <button class="details">
                            <a href="MedicinesCompany.html?id=${company.id}">Details</a>
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.log(error);
        alert("Error connecting to server");
    }
});

