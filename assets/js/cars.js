// ========== DONNÉES MOCKÉES (VOITURES) ==========
const cars = [
    { id: 4, marque: "Porsche", modele: "Taycan", prix_par_jour: 750, carburant: "Electrique", boite: "Automatique", statut: "Disponible", img: '../assets/images/featured4.png' },
    { id: 5, marque: "Audi", modele: "A4", prix_par_jour: 500, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/Audi_A4.png' },
    { id: 6, marque: "Audi", modele: "Q8", prix_par_jour: 800, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/Audi_Q8.png' },
    { id: 7, marque: "BMW", modele: "Série 3", prix_par_jour: 550, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: '../assets/images/BMW_3.png' },
    { id: 8, marque: "BMW", modele: "Série 5", prix_par_jour: 650, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/BMW_5.png' },
    { id: 9, marque: "BMW", modele: "X5", prix_par_jour: 850, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/BMW_X5.png' },
    { id: 10, marque: "Mercedes", modele: "CLA", prix_par_jour: 550, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: '../assets/images/Mercedes-CLA.png' },
    { id: 11, marque: "Mercedes", modele: "Classe E", prix_par_jour: 700, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/Mercedes-E.png' },
    { id: 12, marque: "Porsche", modele: "Cayenne", prix_par_jour: 900, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: '../assets/images/Porsche_cayan.png' },
    { id: 13, marque: "Porsche", modele: "Macan", prix_par_jour: 800, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: '../assets/images/Porsche_macan.png' },
    { id: 14, marque: "Range Rover", modele: "Evoque", prix_par_jour: 700, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/RR_Evoque.png' },
    { id: 15, marque: "Range Rover", modele: "Vogue", prix_par_jour: 950, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/RR_Vouge.png' },
    { id: 16, marque: "Volkswagen", modele: "Tiguan", prix_par_jour: 450, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: '../assets/images/Volk_Tiguan.png' }
];

function displayCars() {
    const wrapper = document.getElementById('carsList');
    if (!wrapper) {
        console.error("#carsList non trouvé");
        return;
    }
    if (typeof cars === 'undefined') {
        console.error("La variable 'cars' n'est pas définie. Vérifiez script.js");
        return;
    }
    const swiperWrapper = document.querySelector('#cars-list');
    if (!swiperWrapper) return;
    swiperWrapper.innerHTML = '';
    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'popular__card swiper-slide';
        card.innerHTML = '<div class="shape__smaller shapeX"></div><h3 class="popular__title">' + car.marque + '</h3><span class="popular__subtitle">' + car.modele + '</span><img src="' + car.img + '" alt="' + car.modele + '" class="popular__img"><div class="popular__data"><div class="popular__data-group"><i class="ri-flashlight-line"></i> ' + car.carburant + '</div><div class="popular__data-group"><i class="ri-settings-3-line"></i> ' + car.boite + '</div></div><div class="popular__price">' + car.prix_par_jour + ' MAD/jour</div><button class="popular__button" data-id="' + car.id + '"><i class="ri-shopping-cart-line"></i></button>';
        swiperWrapper.appendChild(card);
    });
    new Swiper('.popular__container', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
    document.querySelectorAll('.popular__button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const carId = parseInt(btn.getAttribute('data-id'));
            const car = cars.find(c => c.id === carId);
            if (car) {
                document.getElementById('voitureId').value = carId;
                document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
                updateEstimation();
            }
        });
    });
}

function fillCarSelect() {
    const select = document.getElementById('voitureId');
    if (!select) return;
    select.innerHTML = '<option value="">Choisissez une voiture</option>';
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = car.marque + ' ' + car.modele + ' - ' + car.prix_par_jour + ' MAD/jour';
        select.appendChild(option);
    });
}

function updateEstimation() {
    const carId = parseInt(document.getElementById('voitureId')?.value);
    const start = document.getElementById('dateDebut')?.value;
    const end = document.getElementById('dateFin')?.value;
    const assurance = document.getElementById('assuranceCheck')?.checked;
    if (!carId || !start || !end) {
        if (document.getElementById('estimation')) document.getElementById('estimation').innerText = '0';
        return;
    }
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return;
    let total = days * car.prix_par_jour;
    if (assurance) total += days * 50;
    document.getElementById('estimation').innerText = total;
}

function displayClientContracts() {
    const container = document.getElementById('contractsList');
    if (!container) return;
    const currentClient = getCurrentClient();
    if (!currentClient) return;
    const contrats = getContratsByClient(currentClient.id);
    if (contrats.length === 0) {
        container.innerHTML = '<p>Aucun contrat pour le moment.</p>';
        return;
    }
    container.innerHTML = '';
    contrats.forEach(contrat => {
        const div = document.createElement('div');
        div.className = 'contract-item';
        div.innerHTML = '<div><strong>Contrat ' + contrat.id + '</strong><br>' + contrat.voitureNom + '<br>Du ' + contrat.dateDebutEffective + ' au ' + contrat.dateFinEffective + '</div><div>' + contrat.montantTotal + ' MAD<br>' + contrat.statut + '</div>';
        container.appendChild(div);
    });
}

function initIndexPage() {
    const currentClient = getCurrentClient();
    if (!currentClient) {
        window.location.href = "login.html";
        return;
    }
    document.getElementById('userName').innerText = currentClient.prenom + ' ' + currentClient.nom;
    document.getElementById('logoutBtn').addEventListener('click', logout);
    displayCars();
    fillCarSelect();
    displayClientContracts();
    document.getElementById('voitureId')?.addEventListener('change', updateEstimation);
    document.getElementById('dateDebut')?.addEventListener('change', updateEstimation);
    document.getElementById('dateFin')?.addEventListener('change', updateEstimation);
    document.getElementById('assuranceCheck')?.addEventListener('change', updateEstimation);
    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const dateDebut = document.getElementById('dateDebut').value;
            const dateFin = document.getElementById('dateFin').value;
            const carId = parseInt(document.getElementById('voitureId').value);
            const assurance = document.getElementById('assuranceCheck').checked;
            const car = cars.find(c => c.id === carId);
            if (!car) return;
            const days = Math.ceil((new Date(dateFin) - new Date(dateDebut)) / (1000 * 60 * 60 * 24));
            if (days <= 0) {
                alert("Dates invalides");
                return;
            }
            createReservation(currentClient, car, dateDebut, dateFin, assurance, car.prix_par_jour, 50);
            alert("Réservation créée ! En attente de confirmation.");
            form.reset();
            updateEstimation();
        });
    }
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle) navToggle.onclick = () => navMenu.classList.add('show-menu');
    if (navClose) navClose.onclick = () => navMenu.classList.remove('show-menu');
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) header.classList.add('scroll-header');
        else header.classList.remove('scroll-header');
        const scrollUp = document.getElementById('scroll-up');
        if (window.scrollY > 300) scrollUp.classList.add('show-scroll');
        else scrollUp.classList.remove('show-scroll');
    });
}
