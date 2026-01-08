# Responsive Navigation System Documentation

## Overview

The Responsive Navigation System is a comprehensive navigation solution for Next.js applications that provides:

- Virtual navigation stack management for mobile-like navigation experience
- URL synchronization for mobile browsers to maintain navigation state
- Safe handling of frozen objects in SSR environments
- TypeScript support with comprehensive type definitions
- Mobile-responsive navigation behavior

## Core Concepts

### Navigation Stack

The system uses a stack-based navigation model similar to mobile apps, where each screen is pushed onto the stack and can be popped off to navigate back.

### URL Synchronization

On mobile devices, the navigation state is synchronized with URL search parameters (`?screen=path`) to maintain state across browser refreshes and back/forward navigation.

## Installation

Make sure the package is available in your project:

```bash
# If using in a monorepo, ensure the package is linked properly
npm install @packages/lib
```

## Quick Start

### 1. Set up the Provider

Wrap your application with the `ResponsiveProvider`:

```tsx
// app/layout.tsx
import { ResponsiveProvider } from "@muatmuat/lib/responsive-navigation";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ResponsiveProvider>{children}</ResponsiveProvider>
      </body>
    </html>
  );
}
```

Note: `ResponsiveSearchParamsSync` is already handled in the layout, so you don't need to include it manually.

````

### 2. Define Routes

Use the `ResponsiveRoute` component to define your routes:

```tsx
// app/page.tsx
import { ResponsiveRoute } from "@muatmuat/lib/responsive-navigation";

import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <>
      <ResponsiveRoute path="/" component={<HomeScreen />} />
      <ResponsiveRoute path="/about" component={<AboutScreen />} />
      <ResponsiveRoute path="/contact" component={<ContactScreen />} />
    </>
  );
}
````

### 3. Navigate Between Screens

Use the navigation hooks to navigate:

```tsx
// screens/HomeScreen.tsx
import { useResponsiveNavigation } from "@muatmuat/lib/responsive-navigation";

export default function HomeScreen() {
  const { push, pop } = useResponsiveNavigation();

  const navigateToAbout = () => {
    push("/about", { from: "home" });
  };

  const goBack = () => {
    pop();
  };

  return (
    <div>
      <h1>Home Screen</h1>
      <button onClick={navigateToAbout}>Go to About</button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}
```

## API Reference

### Components

#### ResponsiveProvider

The main provider component that enables responsive navigation throughout your app.

```tsx
<ResponsiveProvider>{children}</ResponsiveProvider>
```

**Props:**

- `children: React.ReactNode` - Your application components

#### ResponsiveRoute

Conditionally renders components based on the current navigation path.

```tsx
<ResponsiveRoute path="/about" component={<AboutScreen />} />
```

**Props:**

- `path: string` - The route path this component responds to
- `component: React.ReactNode` - The component to render when the path matches

#### ResponsiveSearchParamsSync

Synchronizes navigation state with URL search parameters.

Note: This component is automatically handled in the layout and doesn't need to be included manually.

**Props:**

- `basePath: string` - Base path for your application (use empty string for root)

### Hooks

#### useResponsiveNavigation

Main hook for navigation actions.

```tsx
const { push, pop, popTo, popToTop, replace } = useResponsiveNavigation();
```

**Returns:**

- `push(path: string, params?: Record<string, any>)` - Navigate to a new screen
- `pop()` - Go back to the previous screen
- `popTo(path: string)` - Pop screens until reaching the specified path
- `popToTop()` - Pop all screens except the first one
- `replace(path: string, params?: Record<string, any>)` - Replace the current screen

#### useNavigationState

Access the current navigation state.

```tsx
const { stack, isHydrated, isReady, isDoingRealNavigation } =
  useNavigationState();
```

**Returns:**

- `stack: StackEntry[]` - Current navigation stack
- `isHydrated: boolean` - Whether the store has been hydrated from persisted storage
- `isReady: boolean` - Whether the navigation system is ready
- `isDoingRealNavigation: boolean` - Whether real browser navigation is in progress

#### useNavigationActions

Access navigation actions without the router integration.

```tsx
const { push, pop, popTo, popToTop, replace, setHasHydrated, setHasReady } =
  useNavigationActions();
```

#### useResponsiveRouteParams

Get parameters for the current route.

```tsx
const params = useResponsiveRouteParams();
```

**Returns:**

- `Record<string, any>` - Parameters for the current screen

### Types

#### StackEntry

Represents an entry in the navigation stack.

```tsx
interface StackEntry {
  path: string; // The route path (e.g., "/about")
  component?: React.ReactNode; // Optional React component
  params: Record<string, any>; // Optional parameters
}
```

#### NavigationActions

Available navigation actions.

```tsx
interface NavigationActions {
  push: (path: string, params?: Record<string, any>) => void;
  pop: () => void;
  popTo: (path: string) => void;
  popToTop: () => void;
  replace: (path: string, params?: Record<string, any>) => void;
}
```

### Utility Functions

#### Path Validation

```tsx
import {
  createScreenSearchParam,
  isValidScreenPath,
  parseScreenSearchParam,
} from "@muatmuat/lib/responsive-navigation";

// Validate a path
const isValid = isValidScreenPath("/about"); // true or false

// Create URL-safe search parameter
const searchParam = createScreenSearchParam("/about"); // "%2Fabout"

// Parse search parameter back to path
const path = parseScreenSearchParam("%2Fabout"); // "/about"
```

## Advanced Usage

### Custom Navigation Logic

You can create custom navigation hooks by combining the provided hooks:

```tsx
import {
  useNavigationState,
  useResponsiveNavigation,
} from "@muatmuat/lib/responsive-navigation";

export const useCustomNavigation = () => {
  const { push, pop } = useResponsiveNavigation();
  const { stack } = useNavigationState();

  const navigateWithAnimation = (
    path: string,
    params?: Record<string, any>
  ) => {
    // Add animation logic here
    push(path, params);
  };

  const canGoBack = () => {
    return stack.length > 1;
  };

  return { navigateWithAnimation, canGoBack, pop };
};
```

### Route Guards

Implement route guards using the navigation state:

```tsx
import { useEffect } from "react";

import {
  useNavigationState,
  useResponsiveNavigation,
} from "@muatmuat/lib/responsive-navigation";

export const useAuthGuard = (requiredAuth: boolean) => {
  const { push } = useResponsiveNavigation();
  const { stack } = useNavigationState();

  useEffect(() => {
    const currentPath = stack[stack.length - 1]?.path;

    if (requiredAuth && !isAuthenticated()) {
      push("/login", { redirectTo: currentPath });
    }
  }, [requiredAuth, push, stack]);
};
```

### Deep Linking

Handle deep links by parsing URL parameters:

```tsx
import { useEffect } from "react";

import { useResponsiveNavigation } from "@muatmuat/lib/responsive-navigation";

export const useDeepLinkHandler = () => {
  const { replace } = useResponsiveNavigation();

  useEffect(() => {
    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const deepLinkPath = urlParams.get("deepLink");

      if (deepLinkPath) {
        replace(deepLinkPath);
      }
    };

    handleDeepLink();
  }, [replace]);
};
```

## Best Practices

1. **Always wrap your app with ResponsiveProvider** at the root level
2. **ResponsiveSearchParamsSync** is automatically handled in the layout
3. **Prefer useResponsiveNavigation** over direct store access for navigation actions
4. **Validate paths** using `isValidScreenPath` when working with external input
5. **Keep params serializable** as they are persisted to local storage
6. **Handle hydration states** before rendering navigation-dependent UI

## Troubleshooting

### Navigation Not Working

- Ensure `ResponsiveProvider` is wrapping your entire application
- ResponsiveSearchParamsSync is automatically handled in the layout
- Verify the navigation state is hydrated (`isHydrated: true`)

### URL Not Syncing

- ResponsiveSearchParamsSync is automatically handled
- Check that you're on a mobile device (syncing is mobile-only)
- Verify the navigation system is ready (`isReady: true`)

### Performance Issues

- Use the shallow comparison hooks when accessing navigation state
- Avoid excessive re-renders by memoizing components that use navigation
- Check for infinite loops in navigation effects

## Migration Guide

If you're migrating from another navigation system:

1. Replace route definitions with `ResponsiveRoute` components
2. Update navigation calls to use `useResponsiveNavigation` hook
3. URL synchronization with `ResponsiveSearchParamsSync` is automatically handled
4. Test mobile navigation behavior thoroughly

## Browser Compatibility

- Modern browsers with ES6+ support
- Next.js 13+ with App Router
- React 18+ with concurrent features
