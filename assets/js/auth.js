// Sistem Autentikasi SPMB 2026-2027

const Auth = {
    // Data admin default (untuk demo)
    admins: [
        { username: 'admin', password: 'admin123', role: 'admin', nama: 'Admin Dinas' },
        { username: 'operator1', password: 'op123', role: 'operator', nama: 'Operator SDN 1', sekolahId: 1 },
        { username: 'operator2', password: 'op123', role: 'operator', nama: 'Operator SMPN 1', sekolahId: 3 }
    ],
    
    // Login siswa dengan nomor pendaftaran dan NIK
    loginSiswa: function(noDaftar, nik) {
        const pendaftar = JSON.parse(localStorage.getItem('spmb_pendaftar') || '[]');
        const siswa = pendaftar.find(p => p.noDaftar === noDaftar && p.nik === nik);
        
        if (!siswa) {
            return { success: false, message: 'Nomor pendaftaran atau NIK tidak ditemukan' };
        }
        
        // Set session
        sessionStorage.setItem('spmb_user', JSON.stringify({
            type: 'siswa',
            noDaftar: siswa.noDaftar,
            nama: siswa.namaLengkap,
            data: siswa
        }));
        
        return { success: true, data: siswa };
    },
    
    // Login admin/operator
    loginAdmin: function(username, password, role) {
        const admin = this.admins.find(a => 
            a.username === username && 
            a.password === password && 
            a.role === role
        );
        
        if (!admin) {
            return { success: false, message: 'Username atau password salah' };
        }
        
        // Set session
        sessionStorage.setItem('spmb_user', JSON.stringify({
            type: 'admin',
            username: admin.username,
            nama: admin.nama,
            role: admin.role,
            sekolahId: admin.sekolahId || null
        }));
        
        return { success: true, data: admin };
    },
    
    // Cek status login
    checkAuth: function(requiredType) {
        const user = JSON.parse(sessionStorage.getItem('spmb_user'));
        
        if (!user) {
            window.location.href = '/pages/login.html';
            return false;
        }
        
        if (requiredType && user.type !== requiredType) {
            window.location.href = '/pages/login.html';
            return false;
        }
        
        return user;
    },
    
    // Logout
    logout: function() {
        sessionStorage.removeItem('spmb_user');
        window.location.href = '/index.html';
    },
    
    // Get current user
    getCurrentUser: function() {
        return JSON.parse(sessionStorage.getItem('spmb_user'));
    },
    
    // Update data siswa
    updateSiswa: function(noDaftar, newData) {
        let pendaftar = JSON.parse(localStorage.getItem('spmb_pendaftar') || '[]');
        const index = pendaftar.findIndex(p => p.noDaftar === noDaftar);
        
        if (index !== -1) {
            pendaftar[index] = { ...pendaftar[index], ...newData };
            localStorage.setItem('spmb_pendaftar', JSON.stringify(pendaftar));
            return true;
        }
        return false;
    }
};

// Proteksi halaman admin
function protectAdminPage() {
    const user = Auth.checkAuth('admin');
    if (user) {
        // Update UI dengan nama user
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = user.nama;
        });
    }
}

// Proteksi halaman siswa
function protectSiswaPage() {
    const user = Auth.checkAuth('siswa');
    if (user) {
        return user.data;
    }
    return null;
}
