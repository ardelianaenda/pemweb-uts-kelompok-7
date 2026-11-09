CREATE DATABASE IF NOT EXISTS cafe_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE cafe_management;

-- TABEL 1: KATEGORI (ANGGOTA 1)
CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT
) ENGINE=InnoDB;

-- TABEL 2: PELANGGAN (ANGGOTA 3)
CREATE TABLE IF NOT EXISTS pelanggan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- TABEL 3: MEJA (ANGGOTA 4)
CREATE TABLE IF NOT EXISTS meja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_meja VARCHAR(10) NOT NULL UNIQUE,
    kapasitas INT NOT NULL,
    status ENUM('tersedia', 'terisi')
        NOT NULL DEFAULT 'tersedia'
) ENGINE=InnoDB;

-- TABEL 4: MENU (ANGGOTA 2)
CREATE TABLE IF NOT EXISTS menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    harga DECIMAL(10,2) NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    gambar VARCHAR(255) NULL,

    CONSTRAINT fk_menu_kategori
    FOREIGN KEY (kategori_id)
    REFERENCES kategori(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- TABEL 5: PESANAN (ANGGOTA 5)
CREATE TABLE IF NOT EXISTS pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    pelanggan_id INT NOT NULL,
    meja_id INT NOT NULL,
    jumlah INT NOT NULL,
    status ENUM(
        'baru',
        'diproses',
        'selesai',
        'dibatalkan'
    ) NOT NULL DEFAULT 'baru',
    tanggal_pesanan DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pesanan_menu
    FOREIGN KEY (menu_id)
    REFERENCES menu(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_pesanan_pelanggan
    FOREIGN KEY (pelanggan_id)
    REFERENCES pelanggan(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_pesanan_meja
    FOREIGN KEY (meja_id)
    REFERENCES meja(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- DATA AWAL UNTUK PENGUJIAN
-- Jalankan pada database baru/kosong

INSERT INTO kategori (nama, deskripsi) VALUES
('Makanan', 'Daftar makanan cafe'),
('Minuman', 'Daftar minuman cafe'),
('Dessert', 'Daftar makanan penutup');

INSERT INTO pelanggan (nama, no_hp) VALUES
('Andi', '081234567890'),
('Budi', '081234567891'),
('Citra', '081234567892');

INSERT INTO meja (nomor_meja, kapasitas, status) VALUES
('M01', 2, 'tersedia'),
('M02', 4, 'tersedia'),
('M03', 6, 'terisi');

INSERT INTO menu (kategori_id, nama, harga, stok, gambar) VALUES
(1, 'Chicken Katsu', 23000, 15, '/images/chicken-katsu.jpg'),
(1, 'Mie Goreng', 15000, 20, '/images/mie-goreng.jpg'),
(1, 'French Fries', 20000, 25, '/images/french-fries.jpg'),
(2, 'Matcha Latte', 22000, 15, '/images/matcha-latte.jpg'),
(2, 'Kopi Aren Latte', 18000, 20, '/images/kopi-aren-latte.jpg'),
(2, 'Americano', 15000, 15, '/images/americano.jpg'),
(2, 'Lemon Tea', 12000, 25, '/images/lemon-tea.jpg'),
(2, 'Ice Tea', 12000, 25, '/images/ice-tea.jpg'),
(3, 'Ice Cream Waffle', 25000, 10, '/images/ice-cream-waffle.jpg'),
(3, 'Tiramisu Cake', 27000, 12, '/images/tiramisu-cake.jpg');

INSERT INTO pesanan (
    menu_id,
    pelanggan_id,
    meja_id,
    jumlah,
    status
) VALUES
(1, 1, 3, 2, 'baru');
