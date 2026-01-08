"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// Default breakpoint (matches Tailwind's md breakpoint)
const DEFAULT_MOBILE_BREAKPOINT = 768;

// Debounce delay in milliseconds
const DEFAULT_DEBOUNCE_MS = 100;

export interface DeviceInfo {
  /** Whether the viewport is mobile-sized (< breakpoint) */
  isMobile: boolean;
  /** Whether the viewport is desktop-sized (>= breakpoint) */
  isDesktop: boolean;
  /** Whether the component has mounted (always true on client after hydration) */
  mounted: boolean;
}

export interface UseDeviceOptions {
  /** Custom breakpoint in pixels. Default: 768 */
  breakpoint?: number;
  /** Debounce delay in ms. Set to 0 to disable. Default: 100 */
  debounceMs?: number;
}

// Cache for subscribers to avoid recreating on each render
const subscriberCache = new Map<
  string,
  {
    subscribe: (callback: () => void) => () => void;
    getSnapshot: () => boolean;
  }
>();

/**
 * Creates a cached subscriber for a specific breakpoint and debounce config
 */
const getSubscriber = (breakpoint: number, debounceMs: number) => {
  const cacheKey = `${breakpoint}-${debounceMs}`;

  if (!subscriberCache.has(cacheKey)) {
    let currentValue = false;
    let listeners: Set<() => void> = new Set();
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Initialize value if window is available
    if (typeof window !== "undefined") {
      currentValue = window.innerWidth < breakpoint;
    }

    const getSnapshot = (): boolean => {
      if (typeof window === "undefined") return false;
      return currentValue;
    };

    const updateValue = () => {
      const newValue = window.innerWidth < breakpoint;
      if (newValue !== currentValue) {
        currentValue = newValue;
        listeners.forEach((listener) => listener());
      }
    };

    const debouncedUpdate = () => {
      if (debounceMs === 0) {
        updateValue();
        return;
      }

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(updateValue, debounceMs);
    };

    const subscribe = (callback: () => void): (() => void) => {
      listeners.add(callback);

      // Set up event listeners on first subscriber
      if (listeners.size === 1 && typeof window !== "undefined") {
        // Initial sync
        currentValue = window.innerWidth < breakpoint;

        // Use matchMedia for efficient media query listening
        const mediaQuery = window.matchMedia(
          `(max-width: ${breakpoint - 1}px)`
        );

        const handleChange = () => debouncedUpdate();

        // Modern API (preferred)
        mediaQuery.addEventListener("change", handleChange);
        // Fallback for resize (catches edge cases)
        window.addEventListener("resize", handleChange);

        // Store cleanup in a way we can access it
        const cleanup = () => {
          mediaQuery.removeEventListener("change", handleChange);
          window.removeEventListener("resize", handleChange);
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
        };

        // Return cleanup wrapped in listener removal
        return () => {
          listeners.delete(callback);
          if (listeners.size === 0) {
            cleanup();
          }
        };
      }

      return () => {
        listeners.delete(callback);
      };
    };

    subscriberCache.set(cacheKey, { subscribe, getSnapshot });
  }

  return subscriberCache.get(cacheKey)!;
};

/**
 * SSR-safe snapshot that defaults to desktop view
 * This ensures consistent hydration - server always renders desktop,
 * then client will update if actually mobile
 */
const getServerSnapshot = (): boolean => false;

/**
 * A robust hook for detecting device viewport size.
 *
 * Features:
 * - Uses `useSyncExternalStore` for React 18 compatibility
 * - Handles SSR/hydration correctly without flash
 * - Debounces resize events for performance
 * - Uses `matchMedia` for efficient media query listening
 * - Supports custom breakpoints
 *
 * @example
 * ```tsx
 * const { isMobile, mounted } = useDevice();
 *
 * if (!mounted) return <Loading />;
 * if (isMobile) return <MobileView />;
 * return <DesktopView />;
 * ```
 *
 * @example With custom breakpoint
 * ```tsx
 * const { isMobile } = useDevice({ breakpoint: 1024 });
 * ```
 */
export const useDevice = (options: UseDeviceOptions = {}): DeviceInfo => {
  const {
    breakpoint = DEFAULT_MOBILE_BREAKPOINT,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const { subscribe, getSnapshot } = getSubscriber(breakpoint, debounceMs);

  const isMobile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Track mounted state for SSR compatibility
  // This is needed because useSyncExternalStore returns serverSnapshot during SSR
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  // For the mounted value, we need to track it separately since
  // useSyncExternalStore handles the isMobile value
  // We use a simple check that's true after first client render
  const mounted = typeof window !== "undefined";

  return {
    isMobile,
    isDesktop: !isMobile,
    mounted,
  };
};

/**
 * Hook that returns true only after hydration is complete and
 * the device type matches the expected type.
 * Useful for avoiding hydration mismatches.
 *
 * @example
 * ```tsx
 * const shouldShowMobile = useIsMobile();
 * // Returns false during SSR, true on client if actually mobile
 * ```
 */
export const useIsMobile = (options: UseDeviceOptions = {}): boolean => {
  const { isMobile, mounted } = useDevice(options);
  return mounted && isMobile;
};

/**
 * Hook that returns true only after hydration is complete and
 * the device type matches desktop.
 *
 * @example
 * ```tsx
 * const shouldShowDesktop = useIsDesktop();
 * ```
 */
export const useIsDesktop = (options: UseDeviceOptions = {}): boolean => {
  const { isDesktop, mounted } = useDevice(options);
  return mounted && isDesktop;
};
