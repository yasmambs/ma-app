// SPMB 2026-2027 - Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    checkExistingSession();
});

// ==================== TAB SWITCHING ====================

function initTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update forms
            forms.forEach(f => f.classList.remove('active'));
            document.getElementById(`form${target.charAt(0).toUpperCase() + target.slice(1)}`).classList.add('active');
            
            // Hide alert
            hideAlert();
        });
    });
}

// ==================== FORM HANDLING ====================

function handleSiswaLogin(e) {
    e.preventDefault();
    hideAlert();
    
    const btn = document.getElementById('btnSiswa');
    const noDaftar = document.getElementById('noDaftar').value.trim();
    const nik = document.getElementById('nik').value.trim();
    
    // Validation
    if (!validateNoDaftar(noDaftar)) {
        showAlert('Format nomor pendaftaran tidak valid (SPMB######)');
        return;
    }
    
    if (!validateNIK(nik)) {
        showAlert('NIK harus 16 digit angka');
        return;
    }
    
    // Loading state
    setLoading(btn, true);
    
    // Simulate API call
    setTimeout(() => {
        setLoading(btn, false);
        
        // Success - redirect to dashboard
        // In production: validate with Firebase
        localStorage.setItem('spmb_user', JSON.stringify({
            type: 'siswa',
            noDaftar: noDaftar,
            nama: 'Budi Santoso'
        }));
        
        window.location.href = 'siswa/dashboard.html';
    }, 1500);
}

function handleAdminLogin(e) {
    e.preventDefault();
    hideAlert();
    
    const btn = document.getElementById('btnAdmin');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('roleType').value;
    
    if (!email || !password) {
        showAlert('Email dan password wajib diisi');
        return;
    }
    
    setLoading(btn, true);
    
    setTimeout(() => {
        setLoading(btn, false);
        
        localStorage.setItem('spmb_user', JSON.stringify({
            type: role,
            email: email,
            nama: role === 'admin' ? 'Admin Dinas' : 'Operator Sekolah'
        }));
        
        window.location.href = '../admin/dashboard.html';
    }, 1500);
}

// ==================== UTILITIES ====================

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

function showAlert(message) {
    const alert = document.getElementById('authAlert');
    const msg = document.getElementById('alertMessage');
    msg.textContent = message;
    alert.classList.add('show');
}

function hideAlert() {
    document.getElementById('authAlert').classList.remove('show');
}

function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.classList.toggle('loading', loading);
}

function validateNoDaftar(noDaftar) {
    return /^SPMB\d{6}$/i.test(noDaftar);
}

function validateNIK(nik) {
    return /^\d{16}$/.test(nik);
}

function checkExistingSession() {
    const user = localStorage.getItem('spmb_user');
    if (user) {
        const data = JSON.parse(user);
        if (data.type === 'siswa') {
            window.location.href = 'siswa/dashboard.html';
        } else {
            window.location.href = '../admin/dashboard.html';
        }
    }
}
