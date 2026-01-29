document.getElementById('addDrugBtn').addEventListener('click', async function () {

    let name = document.getElementById('drug_name').value;
    let price = document.getElementById('drug_price').value;
    let image = document.getElementById('drug_image').files[0];

    let formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    let token = localStorage.getItem("token"); 

    try {
        let res = await fetch("http://majd.shooubadvance.com/api/company/add_drugs", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        let data = await res.json();

        if (res.status === 201) {
            alert("Medicine added successfully");
            document.getElementById("drug_name").value = "";
            document.getElementById("drug_price").value = "";
            document.getElementById("drug_image").value = "";
        } else {
            alert(data.message);
        }

    } catch (e) {
        console.log(e);
        alert("Error while adding drug");
    }
});

// for medecine
document.addEventListener("DOMContentLoaded", () => {
    loadCompanyInfo();
});

async function loadCompanyInfo() {
    const token = localStorage.getItem("token");

    let response = await fetch("http://majd.shooubadvance.com/api/company/getinfo", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    let data = await response.json();

    showDrugs(data.drugs);
}

function showDrugs(drugs) {
    const container = document.getElementById("drugCards");
    container.innerHTML = "";

    drugs.forEach(drug => {
        const card = `
            <div class="card">
                <div class="content">
                    <div class="details">

                        <div class="image" style="width: 50%; margin: auto;">
                            <img src="http://majd.shooubadvance.com/storage/${drug.image}" width="100%">
                        </div>

                        <div class="name">
                            <i class="fa fa-box" style="margin: 10px;"></i>
                            <h3>name: <span>${drug.name}</span></h3>
                        </div>

                        <div class="price">
                            <i class="fa fa-dollar" style="margin: 10px;"></i>
                            <h3>price: <span>${drug.price}</span></h3>
                        </div>

                        <div class="btn_med">
                            <button onclick="deleteDrug(${drug.id})">delete</button>
                        </div>

                    </div>
                </div>
            </div>`;

        container.innerHTML += card;
    });
}

// for search
document.querySelector(".search button").addEventListener("click", searchDrug);

async function searchDrug() {
    const token = localStorage.getItem("token");
    const query = document.querySelector(".search input").value.trim();

    if (query === "") {
        alert("Enter drug name");
        return;
    }

    let response = await fetch(`http://majd.shooubadvance.com/api/company/search_drug?query=${query}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();

    if (data.results) {
        showDrugs(data.results); 
    }
}

// for delete
function deleteDrug(id) {
    if (!confirm("Do u want to delete this Drug")) {
        return;
    }

    fetch(`http://majd.shooubadvance.com/api/company/del_drug/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token") 
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);

                loadCompanyInfo();
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("there is an error");
        });
}
