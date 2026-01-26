const btnCompany = document.getElementById('btnCompany');
const btnPharmacist = document.getElementById('btnPharmacist');

const companyForm = document.getElementById('companyForm');
const pharmacistForm = document.getElementById('pharmacistForm');

btnCompany.onclick = () => {
    companyForm.style.display = 'block';
    pharmacistForm.style.display = 'none';
};

btnPharmacist.onclick = () => {
    pharmacistForm.style.display = 'block';
    companyForm.style.display = 'none';
};
