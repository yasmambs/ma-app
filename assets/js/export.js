// Modul Export Data SPMB 2026-2027

const ExportModule = {
    // Export ke Excel (CSV format)
    toExcel: function(data, filename = 'data-spmb-2026-2027') {
        if (!data || data.length === 0) {
            SPMB.toast('Tidak ada data untuk diekspor', 'error');
            return;
        }
        
        // Header CSV
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    let cell = row[header] || '';
                    // Escape quotes and wrap in quotes if contains comma
                    if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                        cell = '"' + cell.replace(/"/g, '""') + '"';
                    }
                    return cell;
                }).join(',')
            )
        ].join('\n');
        
        // Download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        SPMB.toast('File Excel berhasil diunduh', 'success');
    },
    
    // Export ke PDF (menggunakan jsPDF - perlu include library)
    toPDF: function(elementId, filename = 'dokumen-spmb') {
        // Cek apakah jsPDF tersedia
        if (typeof jspdf === 'undefined') {
            // Load jsPDF dari CDN
            this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => {
                this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', () => {
                    this.generatePDF(elementId, filename);
                });
            });
        } else {
            this.generatePDF(elementId, filename);
        }
    },
    
    generatePDF: function(elementId, filename) {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById(elementId);
        
        if (!element) {
            SPMB.toast('Elemen tidak ditemukan', 'error');
            return;
        }
        
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
            SPMB.toast('File PDF berhasil diunduh', 'success');
        });
    },
    
    // Export data pendaftar lengkap
    exportPendaftar: function(filter = {}) {
        let data = JSON.parse(localStorage.getItem('spmb_pendaftar') || '[]');
        
        // Apply filters
        if (filter.status) {
            data = data.filter(p => p.status === filter.status);
        }
        if (filter.jalur) {
            data = data.filter(p => p.jalur === filter.jalur);
        }
        if (filter.sekolah) {
            data = data.filter(p => p.sekolahPilihan1 == filter.sekolah);
        }
        
        // Format data untuk export
        const formattedData = data.map((p, index) => ({
            'No': index + 1,
            'No. Pendaftaran': p.noDaftar,
            'Nama Lengkap': p.namaLengkap,
            'NIK': p.nik,
            'Jenis Kelamin': p.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            'Tempat Lahir': p.tempatLahir,
            'Tanggal Lahir': p.tanggalLahir,
            'Nama Ayah': p.namaAyah,
            'Nama Ibu': p.namaIbu,
            'No. HP': p.noHp,
            'Jenjang': p.jenjang,
            'Jalur': p.jalur,
            'Sekolah Pilihan 1': p.sekolahPilihan1,
            'Sekolah Pilihan 2': p.sekolahPilihan2 || '-',
            'Status': p.status,
            'Tanggal Daftar': new Date(p.tanggalDaftar).toLocaleDateString('id-ID')
        }));
        
        this.toExcel(formattedData, 'data-pendaftar-spmb-2026-2027');
    },
    
    // Export laporan ringkasan
    exportLaporan: function() {
        const pendaftar = JSON.parse(localStorage.getItem('spmb_pendaftar') || '[]');
        
        // Hitung statistik
        const stats = {
            total: pendaftar.length,
            byStatus: {},
            byJalur: {},
            byJenjang: {}
        };
        
        pendaftar.forEach(p => {
            stats.byStatus[p.status] = (stats.byStatus[p.status] || 0) + 1;
            stats.byJalur[p.jalur] = (stats.byJalur[p.jalur] || 0) + 1;
            stats.byJenjang[p.jenjang] = (stats.byJenjang[p.jenjang] || 0) + 1;
        });
        
        // Buat data laporan
        const laporan = [
            { 'Kategori': 'TOTAL PENDAFTAR', 'Jumlah': stats.total, 'Persentase': '100%' },
            { 'Kategori': '', 'Jumlah': '', 'Persentase': '' },
            { 'Kategori': 'BERDASARKAN STATUS', 'Jumlah': '', 'Persentase': '' },
            ...Object.entries(stats.byStatus).map(([status, jumlah]) => ({
                'Kategori': `  - ${status}`,
                'Jumlah': jumlah,
                'Persentase': ((jumlah / stats.total) * 100).toFixed(1) + '%'
            })),
            { 'Kategori': '', 'Jumlah': '', 'Persentase': '' },
            { 'Kategori': 'BERDASARKAN JALUR', 'Jumlah': '', 'Persentase': '' },
            ...Object.entries(stats.byJalur).map(([jalur, jumlah]) => ({
                'Kategori': `  - ${jalur}`,
                'Jumlah': jumlah,
                'Persentase': ((jumlah / stats.total) * 100).toFixed(1) + '%'
            })),
            { 'Kategori': '', 'Jumlah': '', 'Persentase': '' },
            { 'Kategori': 'BERDASARKAN JENJANG', 'Jumlah': '', 'Persentase': '' },
            ...Object.entries(stats.byJenjang).map(([jenjang, jumlah]) => ({
                'Kategori': `  - ${jenjang}`,
                'Jumlah': jumlah,
                'Persentase': ((jumlah / stats.total) * 100).toFixed(1) + '%'
            }))
        ];
        
        this.toExcel(laporan, 'laporan-ringkasan-spmb-2026-2027');
    },
    
    // Helper: Load script dynamically
    loadScript: function(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    },
    
    // Print halaman
    print: function(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            window.print();
            return;
        }
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Cetak Dokumen</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                ${element.innerHTML}
                <div class="no-print" style="margin-top: 20px; text-align: center;">
                    <button onclick="window.print()">Cetak</button>
                    <button onclick="window.close()">Tutup</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
};

// Export untuk global access
window.ExportModule = ExportModule;
