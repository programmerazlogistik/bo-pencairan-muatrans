import { create } from "zustand";

export interface MenuPermissions {
  masterUser: boolean;
  masterHakAkses: boolean;
}

interface MenuPermissionState {
  permissions: MenuPermissions;
  isLoading: boolean;
  setPermission: (key: keyof MenuPermissions, value: boolean) => void;
  setLoading: (loading: boolean) => void;
  resetPermissions: () => void;
}

const defaultPermissions: MenuPermissions = {
  masterUser: true,
  masterHakAkses: true,
};

export const useMenuPermissionStore = create<MenuPermissionState>((set) => ({
  permissions: { ...defaultPermissions },
  isLoading: true,
  setPermission: (key, value) =>
    set((state) => ({
      permissions: { ...state.permissions, [key]: value },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  resetPermissions: () =>
    set({ permissions: { ...defaultPermissions }, isLoading: true }),
}));
