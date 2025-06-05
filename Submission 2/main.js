document.addEventListener('DOMContentLoaded', function () {
    const formBuku = document.getElementById('inputBook');
    const listBelumSelesai = document.getElementById('incompleteBookshelfList');
    const listSelesai = document.getElementById('completeBookshelfList');

    // Cek apakah ada data buku di localStorage saat halaman dimuat
    const dataBuku = localStorage.getItem('dataBuku');
    if (dataBuku) {
        const bukuArray = JSON.parse(dataBuku);
        bukuArray.forEach(function (buku) {
            tambahkanBukuKeRak(buku, buku.isComplete ? listSelesai : listBelumSelesai);
        });
    }

    formBuku.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahBukuBaru();
    });

    function simpanDataBuku() {
        const semuaBuku = [...listBelumSelesai.children, ...listSelesai.children];
        const bukuArray = [];
        semuaBuku.forEach(function (bukuItem) {
            const judul = bukuItem.querySelector('h3').innerText;
            const penulis = bukuItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', '');
            const tahun = parseInt(bukuItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', ''), 10);
            const isComplete = bukuItem.querySelector('.green').innerText === 'Belum selesai di Baca';

            const buku = {
                id: +new Date(), // Tambahkan ID menggunakan timestamp
                title: judul,
                author: penulis,
                year: tahun,
                isComplete: isComplete
            };

            bukuArray.push(buku);
        });

        localStorage.setItem('dataBuku', JSON.stringify(bukuArray));
    }

    function tambahBukuBaru() {
        const judul = document.getElementById('inputBookTitle').value;
        const penulis = document.getElementById('inputBookAuthor').value;
        const tahun = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        // Validasi tahun menggunakan regex agar hanya menerima angka
        const yearRegex = /^\d+$/;
        if (!yearRegex.test(tahun)) {
            alert("Tahun harus berupa angka.");
            return;
        }

        const bukuBaru = {
            id: +new Date(), // Tambahkan ID menggunakan timestamp
            title: judul,
            author: penulis,
            year: parseInt(tahun, 10), // Ubah tahun menjadi integer
            isComplete: isComplete
        };

        tambahkanBukuKeRak(bukuBaru, isComplete ? listSelesai : listBelumSelesai);

        // Simpan data buku setiap kali buku baru ditambahkan
        simpanDataBuku();

        // Clear form input fields
        formBuku.reset();
    }

    function tambahkanBukuKeRak(buku, rak) {
        const artikelBuku = document.createElement('article');
        artikelBuku.classList.add('book_item');
        artikelBuku.innerHTML = `
            <h3>${buku.title}</h3>
            <p>Penulis: ${buku.author}</p>
            <p>Tahun: ${buku.year}</p>
            
            <div class="action">
                <button class="green" onclick="pindahkanBuku(this, ${buku.isComplete})">${buku.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}</button>
                <button class="red" onclick="hapusBuku(this)">Hapus buku</button>
            </div>
        `;

        rak.appendChild(artikelBuku);

        // Simpan data buku setiap kali buku ditambahkan ke rak
        simpanDataBuku();
    }

    window.pindahkanBuku = function (elemenTombol, isComplete) {
        const rakTujuan = isComplete ? listBelumSelesai : listSelesai;
        const bukuItem = elemenTombol.parentElement.parentElement;
        rakTujuan.appendChild(bukuItem);
        elemenTombol.innerText = isComplete ? 'Selesai dibaca' : 'Belum selesai di Baca';
        elemenTombol.onclick = function () {
            pindahkanBuku(this, !isComplete);
        };

        // Simpan data buku setiap kali buku dipindahkan antar rak
        simpanDataBuku();
    };

    window.hapusBuku = function (elemenTombol) {
        const bukuItem = elemenTombol.parentElement.parentElement;
        bukuItem.remove();

        // Simpan data buku setiap kali buku dihapus
        simpanDataBuku();
    };
});
