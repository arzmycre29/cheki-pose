/**
 * Wishlist, Ticket Manager & Custom Storage
 * Tersimpan lokal di browser (localStorage)
 */

const STORAGE_KEYS = {
  WISHLIST: "cheki_wishlist_tickets",
  CUSTOM_POSES: "cheki_custom_poses",
  CUSTOM_PHOTOS: "cheki_custom_photos",
  SETTINGS: "cheki_app_settings"
};

export class WishlistManager {
  constructor() {
    this.tickets = this.loadTickets();
    this.customPoses = this.loadCustomPoses();
    this.customPhotos = this.loadCustomPhotos();
    this.settings = this.loadSettings();
  }

  loadTickets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (data) return JSON.parse(data);
    } catch (e) {}
    // Default initial template
    return [
      {
        id: "ticket-1",
        ticketNumber: 1,
        poseId: "half-heart",
        oshiName: "Oshi Kesayangan",
        notes: "Tiket pertama, pemanasan yang manis!",
        isDone: false,
        timestamp: Date.now()
      }
    ];
  }

  saveTickets() {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(this.tickets));
    } catch (e) {
      console.warn("Gagal menyimpan tiket ke localStorage", e);
    }
  }

  addTicket(poseId, oshiName = "", notes = "") {
    const nextNum = this.tickets.length > 0 
      ? Math.max(...this.tickets.map(t => t.ticketNumber || 0)) + 1 
      : 1;

    const newTicket = {
      id: "ticket-" + Date.now(),
      ticketNumber: nextNum,
      poseId: poseId,
      oshiName: oshiName || this.settings.defaultOshi || "",
      notes: notes,
      isDone: false,
      timestamp: Date.now()
    };

    this.tickets.push(newTicket);
    this.saveTickets();
    return newTicket;
  }

  toggleTicketDone(ticketId) {
    const t = this.tickets.find(item => item.id === ticketId);
    if (t) {
      t.isDone = !t.isDone;
      this.saveTickets();
    }
    return t;
  }

  removeTicket(ticketId) {
    this.tickets = this.tickets.filter(t => t.id !== ticketId);
    this.saveTickets();
  }

  updateTicket(ticketId, updates) {
    const t = this.tickets.find(item => item.id === ticketId);
    if (t) {
      Object.assign(t, updates);
      this.saveTickets();
    }
    return t;
  }

  clearDoneTickets() {
    this.tickets = this.tickets.filter(t => !t.isDone);
    this.saveTickets();
  }

  // --- Custom Poses ---
  loadCustomPoses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_POSES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  saveCustomPoses() {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_POSES, JSON.stringify(this.customPoses));
    } catch (e) {}
  }

  addCustomPose(pose) {
    const newPose = {
      ...pose,
      id: "custom-" + Date.now(),
      isCustom: true
    };
    this.customPoses.unshift(newPose);
    this.saveCustomPoses();
    return newPose;
  }

  deleteCustomPose(poseId) {
    this.customPoses = this.customPoses.filter(p => p.id !== poseId);
    this.saveCustomPoses();
  }

  // --- Custom Photo References per Pose ---
  loadCustomPhotos() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PHOTOS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  }

  saveCustomPhoto(poseId, dataUrl) {
    try {
      this.customPhotos[poseId] = dataUrl;
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PHOTOS, JSON.stringify(this.customPhotos));
      return true;
    } catch (e) {
      alert("Memori penyimpanan peramban penuh. Gunakan gambar berukuran lebih kecil.");
      return false;
    }
  }

  removeCustomPhoto(poseId) {
    delete this.customPhotos[poseId];
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PHOTOS, JSON.stringify(this.customPhotos));
    } catch (e) {}
  }

  getCustomPhoto(poseId) {
    return this.customPhotos[poseId] || null;
  }

  // --- Settings ---
  loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      defaultOshi: "Oshi-chan",
      eventName: "Chika Idol Live Event",
      soundEnabled: true,
      darkMode: false
    };
  }

  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {}
  }
}

export const wishlist = new WishlistManager();
