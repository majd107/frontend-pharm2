const container = document.querySelector(".cards2");
const searchButton = document.querySelector(".search button");
const searchInput = document.querySelector(".search input");


async function fetchDrugs() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://majd.shooubadvance.com/api/pharmacy/getdrugs", {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        displayDrugs(data);
    } catch (err) {
        console.error("Error fetching drugs:", err);
    }
}


searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return alert("Enter drug name");

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://majd.shooubadvance.com/api/pharmacy/search_drug?query=${query}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        console.log("All drugs from API:", data);

        displayDrugs(data.results);
    } catch (err) {
        console.error("Error searching drug:", err);
    }
});


function displayDrugs(drugs) {
    if (!container) return;
    container.innerHTML = "";

    drugs.forEach(drug => {
        console.log("===== Drug Card Data =====");
        console.log("ID:", drug.id);
        console.log("Name:", drug.name);
        console.log("Price:", drug.price);
        console.log("Image:", drug.image);
        console.log("Company User:", drug.user_name);
        console.log("Full Drug Object:", drug);
        console.log("==========================");

        const html = `
        <div class="card" data-id="${drug.id}">
            <div class="content">
                <div class="details">
                    <div class="image" style="width: 50%; margin: auto;">
                        <img src="http://majd.shooubadvance.com/storage/${drug.image}" width="100%">
                    </div>

                    <div class="name">
                        <i class="fa fa-building" style="margin: 10px;"></i>
                        <h3>company's name:<span>${drug.user_name}</span></h3>
                    </div>

                    <div class="name">
                        <i class="fa fa-box" style="margin: 10px;"></i>
                        <h3>medicine's name:<span>${drug.name}</span></h3>
                    </div>

                    <div class="price">
                        <i class="fa fa-dollar" style="margin: 10px;"></i>
                        <h3>price:<span>${drug.price}</span></h3>
                    </div>

                    <div class="counter_sales">
                        <span class="inc">-</span>
                        <span>1</span>
                        <span class="dec">+</span>
                    </div>

                    <div class="btn_med2">
<button class="buyBtn" data-id="${drug.id}">buy</button>
                    </div>
                </div>
            </div>
        </div>`;
        container.insertAdjacentHTML("beforeend", html);
    });

    activateBuyButtons();
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
    }
});



fetchDrugs();

let allDrugs = [];

async function fetchDrugs() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://majd.shooubadvance.com/api/pharmacy/getdrugs", {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });
        const data = await res.json();

        allDrugs = data; 
        displayDrugs(data);

    } catch (err) {
        console.error("Error fetching drugs:", err);
    }
}
document.getElementById("addOrderBtn").addEventListener("click", async () => {
    const name = document.getElementById("drugName").value.trim();
    const quantity = document.getElementById("drugQty").value;

    if (!name) return alert("Enter medicine name");
    if (!quantity) return alert("Enter quantity");

    const drug = allDrugs.find(d => d.name.toLowerCase() === name.toLowerCase());

    if (!drug) {
        alert("Drug not found!");
        return;
    }

    console.log("Found Drug ID:", drug.id);

    await sendOrder(drug.id, quantity);
});
async function sendOrder(drugId, quantity) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://majd.shooubadvance.com/api/pharmacy/order_drug", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                drug_id: drugId,
                quantity: quantity
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Order created successfully!");
        } else {
            alert(data.message || "Error creating order");
        }

    } catch (err) {
        console.error("Order error:", err);
    }
}
function activateBuyButtons() {
    const buttons = document.querySelectorAll(".buyBtn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            const id = btn.getAttribute("data-id");

            const card = btn.closest(".card");

            const counter = card.querySelector(".counter_sales span:nth-child(2)");

            const qty = parseInt(counter.textContent);

            if (!qty || qty < 1) {
                alert("Invalid quantity");
                return;
            }

            sendOrder(id, qty);
        });
    });
}
