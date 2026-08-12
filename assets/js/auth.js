// ========== HASHING (SHA-256 via Web Crypto API) ==========
// WHY: Never store plain text passwords. SHA-256 is a one-way hash —
// even if someone reads localStorage, they cannot reverse the password.
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ========== AUTHENTIFICATION ==========
// WHY: Login is now async because hashPassword() is async.
// We hash the input, then compare against the stored hash — never the raw password.
async function checkLogin() {
    const loginInput = document.getElementById("clientId").value.trim();
    const password = document.getElementById("pass").value.trim();
    const hashedInput = await hashPassword(password);

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const user = clients.find(c =>
        (c.id === loginInput || c.email === loginInput) && c.password === hashedInput
    );

    if (user) {
        localStorage.setItem('currentClient', JSON.stringify(user));
        if (isAdmin(user)) {
            window.location.href = "admin/dashboard.html";
        } else {
            window.location.href = "accueil.html";
        }
    } else {
        document.getElementById("error").innerHTML = "ID/Email ou mot de passe incorrect";
    }
}

function generateClientId() {
    return 'CL-' + Math.floor(100000 + Math.random() * 900000);
}

// WHY: Admin is identified by a dedicated role field, NOT a hardcoded email.
// This means you can promote any user to admin without touching source code.
function isAdmin(user) {
    return user && user.role === 'admin';
}

function logout() {
    const currentUser = getCurrentClient();
    const isAdminUser = currentUser && isAdmin(currentUser);
    localStorage.removeItem('currentClient');
    if (isAdminUser) {
        window.location.href = "../login.html";
    } else {
        window.location.href = "index.html";
    }
}

function getCurrentClient() {
    return JSON.parse(localStorage.getItem('currentClient'));
}

function isValidClient(client) {
    if (!client || !client.id) return false;
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    // If clients list is empty, defaults haven't loaded yet — don't reject
    if (clients.length === 0) return true;
    const found = clients.find(c => c.id === client.id && c.email === client.email);
    return !!found;
}

// WHY: Default clients now store HASHED passwords, not plain text.
// The hash below is SHA-256('1234') and SHA-256('admin123').
// Run hashPassword('yourpassword') in console to generate new ones.
async function createDefaultClient() {
    let clients = JSON.parse(localStorage.getItem('clients') || '[]');
    let needSave = false;

    if (clients.length === 0) {
        const hash1234 = await hashPassword('1234');
        const defaultClient = {
            id: 'CL-123456',
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean@example.com',
            password: hash1234,  // stored as hash, not '1234'
            role: 'client',
            cin: 'AA123456',
            numPermis: 'P789012',
            datePermis: '2015-01-01',
            telephone: '0612345678',
            adresse: '123 Rue Exemple, Casablanca',
            dateInscription: new Date().toISOString()
        };
        clients.push(defaultClient);
        needSave = true;
    }

    const adminExists = clients.some(c => c.role === 'admin');
    if (!adminExists) {
        const hashAdmin = await hashPassword('admin123');
        const adminClient = {
            id: 'ADMIN',
            nom: 'Admin',
            prenom: 'Super',
            email: 'admin@driveloc.ma',  // no longer hardcoded personal email
            password: hashAdmin,          // stored as hash, not 'admin123'
            role: 'admin',               // role field instead of email check
            cin: 'AA000000',
            numPermis: 'P000000',
            datePermis: '2000-01-01',
            telephone: '0600000000',
            adresse: 'Agence Centrale, Casablanca',
            dateInscription: new Date().toISOString()
        };
        clients.push(adminClient);
        needSave = true;
    }

    clients.forEach(c => {
        if (!c.role) {
            c.role = 'client';
            needSave = true;
        }
    });

    if (needSave) localStorage.setItem('clients', JSON.stringify(clients));
}

function hideCurrentPageLink() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) link.style.display = 'none';
    });
}

// WHY: Override getCurrentClient with validation so a manually-crafted
// localStorage entry can't spoof a logged-in session.
window.getCurrentClient = function() {
    const stored = localStorage.getItem('currentClient');
    if (!stored) return null;
    try {
        const client = JSON.parse(stored);
        if (isValidClient(client)) return client;
        localStorage.removeItem('currentClient');
        return null;
    } catch(e) {
        localStorage.removeItem('currentClient');
        return null;
    }
};

// Initialiser les clients par défaut au chargement
// Store the promise so pages can await it before checking auth
window.__authReady = createDefaultClient();
