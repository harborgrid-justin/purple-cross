/**
 * WF-COMP-XXX | useUIStore.ts - UI Store
 * Purpose: Zustand store for managing UI/client state (sidebar, notifications, modals, theme, loading)
 * Dependencies: zustand
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  type: string;
  props?: Record<string, unknown>;
}

export interface UIStore {
  // Sidebar State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Notifications State
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Modals State
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Theme State
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Loading State
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // Sidebar State
        sidebarOpen: true,
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),

        // Notifications State
        notifications: [],
        addNotification: (notification: Omit<Notification, 'id'>) =>
          set(
            (state) => ({
              notifications: [
                ...state.notifications,
                {
                  id: Date.now().toString(),
                  ...notification,
                },
              ],
            }),
            false,
            'addNotification'
          ),
        removeNotification: (id: string) =>
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            'removeNotification'
          ),
        clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),

        // Modals State
        modals: [],
        openModal: (modal: Omit<Modal, 'id'>) =>
          set(
            (state) => ({
              modals: [
                ...state.modals,
                {
                  id: Date.now().toString(),
                  ...modal,
                },
              ],
            }),
            false,
            'openModal'
          ),
        closeModal: (id: string) =>
          set(
            (state) => ({
              modals: state.modals.filter((m) => m.id !== id),
            }),
            false,
            'closeModal'
          ),
        closeAllModals: () => set({ modals: [] }, false, 'closeAllModals'),

        // Theme State
        theme: 'light',
        setTheme: (theme: 'light' | 'dark') => set({ theme }, false, 'setTheme'),

        // Loading State
        loading: {
          global: false,
        },
        setGlobalLoading: (loading: boolean) =>
          set(
            (state) => ({
              loading: { ...state.loading, global: loading },
            }),
            false,
            'setGlobalLoading'
          ),
        setLoading: (key: string, loading: boolean) =>
          set(
            (state) => ({
              loading: { ...state.loading, [key]: loading },
            }),
            false,
            'setLoading'
          ),
      }),
      {
        name: 'purple-cross-ui',
        // Only persist theme and sidebar state
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// ============================================================================
// Typed Selector Hooks (for optimal re-render performance)
// ============================================================================

/**
 * Hook to get sidebar state and actions
 * Only re-renders when sidebar state changes
 */
export const useSidebar = () =>
  useUIStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
  }));

/**
 * Hook to get notifications state and actions
 * Only re-renders when notifications change
 */
export const useNotifications = () =>
  useUIStore((state) => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
  }));

/**
 * Hook to get modals state and actions
 * Only re-renders when modals change
 */
export const useModals = () =>
  useUIStore((state) => ({
    modals: state.modals,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
  }));

/**
 * Hook to get theme state and actions
 * Only re-renders when theme changes
 */
export const useTheme = () =>
  useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));

/**
 * Hook to get loading state and actions
 * Only re-renders when loading state changes
 */
export const useLoading = () =>
  useUIStore((state) => ({
    loading: state.loading,
    setGlobalLoading: state.setGlobalLoading,
    setLoading: state.setLoading,
  }));
