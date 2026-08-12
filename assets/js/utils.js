// ========== STOCKAGE LOCAL ==========
function getReservations() {
    return JSON.parse(localStorage.getItem('reservations') || '[]');
}
function saveReservations(reservations) {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}
function getContrats() {
    return JSON.parse(localStorage.getItem('contrats') || '[]');
}
function saveContrats(contrats) {
    localStorage.setItem('contrats', JSON.stringify(contrats));
}
function getContratsByClient(clientId) {
    return getContrats().filter(c => c.clientId === clientId);
}

// ✅ FIX: Date validation added — prevents past dates and end-before-start
function validateReservationDates(dateDebut, dateFin) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(dateDebut);
    const end = new Date(dateFin);

    if (start < today) {
        return { valid: false, message: "La date de début ne peut pas être dans le passé." };
    }
    if (end <= start) {
        return { valid: false, message: "La date de fin doit être après la date de début." };
    }
    return { valid: true };
}

function createReservation(client, voiture, dateDebut, dateFin, assuranceIncluse, prixParJour, prixAssurance) {
    if (prixAssurance === undefined) prixAssurance = 50;

    // ✅ FIX: Validate dates before creating
    const validation = validateReservationDates(dateDebut, dateFin);
    if (!validation.valid) {
        alert(validation.message);
        return null;
    }

    const days = Math.ceil((new Date(dateFin) - new Date(dateDebut)) / (1000 * 60 * 60 * 24));
    const montantTotal = days * prixParJour + (assuranceIncluse ? days * prixAssurance : 0);

    const reservation = {
        id: 'RES-' + Date.now(),
        clientId: client.id,
        voitureId: voiture.id,
        voitureNom: `${voiture.marque} ${voiture.modele}`,
        dateDebut, dateFin,
        assuranceIncluse,
        prixParJourApplique: prixParJour,
        prixAssuranceApplique: assuranceIncluse ? prixAssurance : null,
        montantTotal,
        statut: "Confirmée",
        dateReservation: new Date().toISOString()
    };

    let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    return reservation;
}

// ========== CAR SYNC ==========
// ✅ FIX: syncCars no longer tries to mutate the cars array from cars.js.
// Instead it just ensures localStorage has defaults and returns the data.
// cars.js and utils.js no longer conflict.
function syncCars() {
    let storedCars = localStorage.getItem('cars');
    if (storedCars) {
        const parsed = JSON.parse(storedCars);
        // If old vehicles exist (ids 1-3) or count is wrong, re-sync
        const hasOld = parsed.some(c => c.id === 1 || c.id === 2 || c.id === 3);
        if (hasOld || parsed.length !== 13) {
            localStorage.removeItem('cars');
            storedCars = null;
        }
    }
    if (!storedCars) {
        const defaultCars = [
            { id: 4, immatriculation: "101JKL", marque: "Porsche", modele: "Taycan", prix_par_jour: 750, kilometrage: 3000, carburant: "Electrique", boite: "Automatique", statut: "Disponible", img: "../assets/images/featured4.png" },
            { id: 5, immatriculation: "102MNO", marque: "Audi", modele: "A4", prix_par_jour: 500, kilometrage: 18000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/Audi_A4.png" },
            { id: 6, immatriculation: "103PQR", marque: "Audi", modele: "Q8", prix_par_jour: 800, kilometrage: 8000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/Audi_Q8.png" },
            { id: 7, immatriculation: "104STU", marque: "BMW", modele: "Série 3", prix_par_jour: 550, kilometrage: 12000, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: "../assets/images/BMW_3.png" },
            { id: 8, immatriculation: "105VWX", marque: "BMW", modele: "Série 5", prix_par_jour: 650, kilometrage: 10000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/BMW_5.png" },
            { id: 9, immatriculation: "106YZA", marque: "BMW", modele: "X5", prix_par_jour: 850, kilometrage: 7000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/BMW_X5.png" },
            { id: 10, immatriculation: "107BCD", marque: "Mercedes", modele: "CLA", prix_par_jour: 550, kilometrage: 14000, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: "../assets/images/Mercedes-CLA.png" },
            { id: 11, immatriculation: "108EFG", marque: "Mercedes", modele: "Classe E", prix_par_jour: 700, kilometrage: 9000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/Mercedes-E.png" },
            { id: 12, immatriculation: "109HIJ", marque: "Porsche", modele: "Cayenne", prix_par_jour: 900, kilometrage: 6000, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: "../assets/images/Porsche_cayan.png" },
            { id: 13, immatriculation: "110KLM", marque: "Porsche", modele: "Macan", prix_par_jour: 800, kilometrage: 8000, carburant: "Essence", boite: "Automatique", statut: "Disponible", img: "../assets/images/Porsche_macan.png" },
            { id: 14, immatriculation: "111NOP", marque: "Range Rover", modele: "Evoque", prix_par_jour: 700, kilometrage: 11000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/RR_Evoque.png" },
            { id: 15, immatriculation: "112QRS", marque: "Range Rover", modele: "Vogue", prix_par_jour: 950, kilometrage: 5000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/RR_Vouge.png" },
            { id: 16, immatriculation: "113TUV", marque: "Volkswagen", modele: "Tiguan", prix_par_jour: 450, kilometrage: 20000, carburant: "Diesel", boite: "Automatique", statut: "Disponible", img: "../assets/images/Volk_Tiguan.png" }
        ];
        localStorage.setItem('cars', JSON.stringify(defaultCars));
        return defaultCars;
    }
    return JSON.parse(storedCars);
}

// Always read cars from localStorage (single source of truth)
// Use getCars() instead of the global `cars` variable
function getCars() {
    return syncCars();
}

window.addEventListener('storage', function(e) {
    if (e.key === 'cars') syncCars();
});

syncCars();

// ========== UX FEEDBACK SYSTEM ==========
const uxStyles = `
    .ux-toast-container { position:fixed; bottom:20px; right:20px; z-index:10000; display:flex; flex-direction:column; gap:10px; }
    .ux-toast { min-width:250px; padding:12px 20px; border-radius:8px; background:#1f2937; color:white; box-shadow:0 4px 12px rgba(0,0,0,0.3); display:flex; align-items:center; gap:12px; animation:ux-slide-in 0.3s ease-out forwards; border-left:4px solid #3b82f6; }
    .ux-toast.success { border-left-color:#10b981; }
    .ux-toast.error   { border-left-color:#ef4444; }
    .ux-toast.warning { border-left-color:#f59e0b; }
    .ux-toast.info    { border-left-color:#3b82f6; }
    @keyframes ux-slide-in { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
    .ux-toast.fade-out { animation:ux-fade-out 0.3s ease-in forwards; }
    @keyframes ux-fade-out { from { transform:translateX(0); opacity:1; } to { transform:translateX(100%); opacity:0; } }
    .ux-modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:10001; opacity:0; animation:ux-fade-in 0.2s forwards; }
    .ux-modal { background:#111827; border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:12px; max-width:400px; width:90%; color:white; transform:scale(0.9); animation:ux-zoom-in 0.2s forwards; }
    .ux-modal-title { font-size:1.25rem; font-weight:600; margin-bottom:12px; }
    .ux-modal-body { margin-bottom:24px; color:#9ca3af; line-height:1.5; }
    .ux-modal-actions { display:flex; justify-content:flex-end; gap:12px; }
    .ux-btn { padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:500; border:none; transition:0.2s; }
    .ux-btn-secondary { background:#374151; color:white; }
    .ux-btn-secondary:hover { background:#4b5563; }
    .ux-btn-primary { background:#3b82f6; color:white; }
    .ux-btn-primary:hover { background:#2563eb; }
    @keyframes ux-fade-in { to { opacity:1; } }
    @keyframes ux-zoom-in { to { transform:scale(1); } }
    .ux-loader-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(10,10,26,0.5); display:flex; align-items:center; justify-content:center; z-index:10002; }
    .ux-loader { width:48px; height:48px; border:5px solid #FFF; border-bottom-color:#3b82f6; border-radius:50%; display:inline-block; animation:ux-rotation 1s linear infinite; }
    @keyframes ux-rotation { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    .ux-empty-state { padding:40px; text-align:center; color:#9ca3af; background:rgba(255,255,255,0.02); border-radius:12px; border:2px dashed rgba(255,255,255,0.05); margin:20px 0; }
    .ux-empty-state i { font-size:3rem; display:block; margin-bottom:1rem; opacity:0.5; }
`;

const injectStyles = () => {
    if (document.getElementById('ux-styles')) return;
    const styleTag = document.createElement('style');
    styleTag.id = 'ux-styles';
    styleTag.textContent = uxStyles;
    document.head.appendChild(styleTag);
};

window.showToast = (message, type = 'info') => {
    let container = document.querySelector('.ux-toast-container');
    if (!container) { container = document.createElement('div'); container.className = 'ux-toast-container'; document.body.appendChild(container); }
    const toast = document.createElement('div');
    toast.className = 'ux-toast ' + type;
    const icons = { success:'ri-checkbox-circle-line', error:'ri-error-warning-line', warning:'ri-alert-line', info:'ri-information-line' };
    toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 4000);
};

window.showConfirm = (message, title = 'Confirmation') => new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'ux-modal-overlay';
    overlay.innerHTML = `<div class="ux-modal"><div class="ux-modal-title">${title}</div><div class="ux-modal-body">${message}</div><div class="ux-modal-actions"><button class="ux-btn ux-btn-secondary" id="ux-cancel">Annuler</button><button class="ux-btn ux-btn-primary" id="ux-confirm">Confirmer</button></div></div>`;
    document.body.appendChild(overlay);
    const close = result => { overlay.remove(); resolve(result); };
    overlay.querySelector('#ux-cancel').onclick = () => close(false);
    overlay.querySelector('#ux-confirm').onclick = () => close(true);
});

window.showLoading = () => {
    if (document.querySelector('.ux-loader-overlay')) return;
    const loader = document.createElement('div');
    loader.className = 'ux-loader-overlay';
    loader.innerHTML = '<span class="ux-loader"></span>';
    document.body.appendChild(loader);
};

window.hideLoading = () => {
    const loader = document.querySelector('.ux-loader-overlay');
    if (loader) loader.remove();
};

window.renderEmptyState = (container, message = 'Aucune donnée trouvée', icon = 'ri-inbox-line') => {
    if (!container) return;
    container.innerHTML = `<div class="ux-empty-state"><i class="${icon}"></i><p>${message}</p></div>`;
};

// ── Alert override ──
const nativeAlert = window.alert;
window.alert = (msg) => {
    let type = 'info';
    const m = msg.toLowerCase();
    if (m.includes('succès') || msg.includes('✅') || m.includes('confirmée')) type = 'success';
    if (m.includes('erreur') || m.includes('impossible') || m.includes('incorrect') || m.includes('invalide')) type = 'error';
    if (m.includes('attention') || m.includes('vouliez-vous')) type = 'warning';
    window.showToast(msg, type);
};

document.addEventListener('DOMContentLoaded', () => { injectStyles(); });
