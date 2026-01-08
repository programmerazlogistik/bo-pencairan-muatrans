import { useEffect, useRef } from "react";

import { fetcherBO } from "@/lib/axios";

import { useMenuPermissionStore } from "@/store/Shared/useMenuPermissionStore";

/**
 * Hook to check menu permissions by calling APIs and detecting 403 responses.
 * Call this hook in the main layout or after login to determine which menu items to show.
 */
export const useCheckMenuPermissions = () => {
  const { setPermission, setLoading, permissions, isLoading } =
    useMenuPermissionStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkPermissions = async () => {
      setLoading(true);

      // Check Master Hak Akses (roles) permission
      try {
        const rolesResponse = await fetcherBO.get(
          "/v1/mytask/role?page=1&limit=1"
        );
        const rolesCode = rolesResponse.data?.Message?.Code;
        if (rolesCode === 403) {
          setPermission("masterHakAkses", false);
        } else {
          setPermission("masterHakAkses", true);
        }
      } catch (error: unknown) {
        // Check if error response has 403 code
        const axiosError = error as {
          response?: { data?: { Message?: { Code?: number } } };
        };
        if (axiosError?.response?.data?.Message?.Code === 403) {
          setPermission("masterHakAkses", false);
        }
      }

      // Check Master User permission
      try {
        const usersResponse = await fetcherBO.get(
          "/v1/mytask/user?page=1&limit=1"
        );
        const usersCode = usersResponse.data?.Message?.Code;
        if (usersCode === 403) {
          setPermission("masterUser", false);
        } else {
          setPermission("masterUser", true);
        }
      } catch (error: unknown) {
        // Check if error response has 403 code
        const axiosError = error as {
          response?: { data?: { Message?: { Code?: number } } };
        };
        if (axiosError?.response?.data?.Message?.Code === 403) {
          setPermission("masterUser", false);
        }
      }

      setLoading(false);
    };

    checkPermissions();
  }, [setPermission, setLoading]);

  return { permissions, isLoading };
};
