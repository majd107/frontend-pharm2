document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(`http://majd.shooubadvance.com/api/admin/details_company/${id}`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        }
    });

    const data = await res.json();
    const drugs = data.drugs;

    const container = document.querySelector(".cards");
    container.innerHTML = "";

    drugs.forEach(drug => {
        container.innerHTML += `
        <div class="card">
            <div class="content">
                <div class="details">

                    <div class="image" ">
                        <img src="${drug.image}" ">
                    </div>

                    <div class="name">
                        <h3>Name: <span>${drug.name}</span></h3>
                    </div>

                    <div class="price">
                        <h3>Price: <span>${drug.price}</span></h3>
                    </div>

                </div>
            </div>
        </div>`;
    });
});