// ─────────────────────────────────────────────
// Helper: format waktu relatif
// ─────────────────────────────────────────────
export function formatRelativeTime(dateString) {
  if (!dateString) return '-';
  const diff = Math.round((new Date(dateString) - Date.now()) / 60000); // menit
  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
  if (Math.abs(diff) < 60) return rtf.format(diff, 'minute');
  if (Math.abs(diff) < 1440) return rtf.format(Math.round(diff / 60), 'hour');
  return rtf.format(Math.round(diff / 1440), 'day');
}

// ─────────────────────────────────────────────
// Helper: format alert dari API
// Response: { id, type, title, message, price, created_at }
// ─────────────────────────────────────────────
export function formatAlert(alert) {
  const status =
    alert.type === 'critical' ? 'danger' :
    alert.type === 'warning'  ? 'warning' : 'success';

  return {
    id: alert.id,
    region: alert.region || alert.region_name || '-',
    commodity: alert.title || alert.commodity || alert.commodity_name || '-',
    price: alert.price ? `Rp ${Number(alert.price).toLocaleString('id-ID')}` : '-',
    change: alert.message || (status === 'success' ? 'Normal' : '-'),
    status,
    time: formatRelativeTime(alert.created_at),
  };
}

// ─────────────────────────────────────────────
// Helper: label aksi log → teks Indonesia
// ─────────────────────────────────────────────
const ACTION_LABELS = {
  ADD_PRICE: 'Menambah Data Harga',
  UPDATE_PRICE: 'Memperbarui Data Harga',
  DELETE_PRICE: 'Menghapus Data Harga',
  ADD_COMMODITY: 'Menambah Komoditas',
  UPDATE_COMMODITY: 'Memperbarui Komoditas',
  DELETE_COMMODITY: 'Menghapus Komoditas',
  CREATE_USER: 'Menambah Admin Baru',
  UPDATE_USER: 'Memperbarui Pengguna',
  DELETE_USER: 'Menghapus Pengguna',
  LOGIN: 'Login ke Sistem',
  LOGOUT: 'Logout dari Sistem',
};

export function getActionLabel(action) {
  return ACTION_LABELS[action] || (action ? action.replace(/_/g, ' ') : '-');
}

// ─────────────────────────────────────────────
// Helper: format log dari API
// Response: { id, fullname, action, details, created_at }
// ─────────────────────────────────────────────
export function formatLog(log) {
  return {
    id: log.id,
    user: log.fullname || '-',
    action: getActionLabel(log.action),
    time: formatRelativeTime(log.created_at),
  };
}

// ─────────────────────────────────────────────
// Helper: salam berdasarkan waktu
// ─────────────────────────────────────────────
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}
