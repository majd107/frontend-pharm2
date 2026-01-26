const searchButton = document.querySelector(".search button");
const searchInput = document.querySelector(".search input");
const container = document.querySelector(".cards2");


searchButton.addEventListener("click", searchDrug);

async function searchDrug() {
    const token = localStorage.getItem("token");
    const query = searchInput.value.trim();

    if (!query) {
        alert("Enter drug name");
        return;
    }

    try {
        const response = await fetch(`https://backendpharm-production.up.railway.app/api/pharmacy/search_drug?query=${query}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await response.json();
        if (data.results) {
            displayDrugs(data.results);
        }
    } catch (err) {
        console.error("Error searching drug:", err);
    }
}


async function fetchDrugs() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("https://backendpharm-production.up.railway.app/api/pharmacy/getinfo", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        displayDrugs(data.drugs);
    } catch (err) {
        console.error("Error fetching drugs:", err);
    }
}


function displayDrugs(drugs) {
    if (!container) return;
    container.innerHTML = "";

    let html = "";
    drugs.forEach(drug => {
        html += `
        <div class="card" data-id="${drug.id}">
            <div class="content">
                <div class="details">
                    <div class="image" style="width: 50%; margin: auto;">
                        <img src="https://backendpharm-production.up.railway.app/storage/${drug.image}" width="100%">
                    </div>

                    <div class="name">
                        <i class="fa fa-box" style="margin: 10px;"></i>
                        <h3>name:<span>${drug.name}</span></h3>
                    </div>

                    <div class="price">
                        <i class="fa fa-dollar" style="margin: 10px;"></i>
                        <h3>price:<span>${drug.price}</span></h3>
                    </div>

                    <div class="quantity">
                        <i class="fa fa-list" style="margin: 10px;"></i>
                        <h3>quantity:<span>${drug.quantity}</span></h3>
                    </div>

                    <div class="counter_sales">
                        <span class="inc">-</span>
                        <span>1</span>
                        <span class="dec">+</span>
                    </div>

                    <div class="btn_med2">
                        <button>sale</button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}


container.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;

    const counter = card.querySelector(".counter_sales span:nth-child(2)");

    if (e.target.classList.contains("inc")) {
        let value = parseInt(counter.textContent);
        if (value > 1) counter.textContent = value - 1;
    } else if (e.target.classList.contains("dec")) {
        counter.textContent = parseInt(counter.textContent) + 1;
    } else if (e.target.tagName === "BUTTON") {

        const drugId = parseInt(card.dataset.id);
        const quantity = parseInt(counter.textContent);
        makeSale([{ drug_id: drugId, quantity }]);
    }
});

async function makeSale(salesArray) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://backendpharm-production.up.railway.app/api/pharmacy/sale_drug_array", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                drug_id: salesArray.map(item => item.drug_id),
                quantity: salesArray.map(item => item.quantity)
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Sale successful!");
            fetchDrugs();
        } else {
            alert("Error: " + (data.message || "Sale failed"));
        }
    } catch (err) {
        console.error("Error making sale:", err);
    }
}

fetchDrugs();
