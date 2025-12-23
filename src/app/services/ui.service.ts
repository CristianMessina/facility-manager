import { Injectable, signal } from '@angular/core';

export interface Snackbar {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export interface ConfirmDialog {
  title: string;
  message: string;
  onConfirm: () => void;
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class UiService {
  // Signals per lo stato globale
  snackbar = signal<Snackbar>({ message: '', type: 'info', visible: false });
  dialog = signal<ConfirmDialog>({ title: '', message: '', onConfirm: () => {}, visible: false });
  loading = signal<boolean>(false);

  showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.snackbar.set({ message, type, visible: true });
    setTimeout(() => this.snackbar.update(s => ({ ...s, visible: false })), 3000);
  }

  showConfirm(title: string, message: string, onConfirm: () => void) {
    this.dialog.set({ title, message, onConfirm, visible: true });
  }

  closeConfirm() {
    this.dialog.update(d => ({ ...d, visible: false }));
  }

  setLoading(state: boolean) {
    this.loading.set(state);
  }
}