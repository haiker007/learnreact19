# GEMINI.MD: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

*   **Primary Goal:** This is a modern frontend application for a Content Management System (CMS), built to manage dynamic content models, user administration, and general system settings. It features a drag-and-drop schema builder and dynamic field rendering.
*   **Business Domain:** Enterprise Content Management / Administration Interfaces.

## 2. Core Technologies & Stack

*   **Languages:** TypeScript 5.x (Target ES2022).
*   **Frameworks & Runtimes:** React 19.2, Vite 7.2 (Build Tool), Node.js (Development Runtime).
*   **UI System:** Ant Design 6.x.
*   **State Management:** Redux Toolkit (Feature-sliced pattern).
*   **Routing:** React Router DOM 7.9.
*   **Internationalization:** i18next, react-i18next (Dynamic resource loading).
*   **Key Libraries:**
    *   `@dnd-kit/core`: Drag and drop functionality.
    *   `dayjs`: Date manipulation.
    *   `uuid`: Unique identifier generation.
    *   `axios`: HTTP Client (Inferred standard, though not explicitly seen in dependencies, `fetch` might be used or axios is a transitive/dev dependency or to be added). *Correction: Not in top-level deps, verify usage if implementing API calls.*
*   **Package Manager:** pnpm.

## 3. Architectural Patterns

*   **Overall Architecture:** Single Page Application (SPA) using Client-Side Rendering (CSR).
*   **Directory Structure Philosophy (`cms-fe/src`):**
    *   `@/components`: Reusable, presentational UI components (e.g., `DynamicFieldRenderer`, `AdminLayout`).
    *   `@/features`: Business logic isolated by domain, containing Redux slices (e.g., `auth`, `tab`).
    *   `@/pages`: Top-level route components acting as views (e.g., `DashboardPage`, `CmsPage`).
    *   `@/store`: Redux store configuration and typed hooks.
    *   `@/locales`: I18n JSON translation files structured by language code (e.g., `cn`, `en`).
    *   `@/hooks`: Shared custom React hooks.
    *   `@/assets`: Static assets like SVGs.

## 4. Coding Conventions & Style Guide

*   **Formatting:** Enforced via Prettier.
    *   Indentation: 2 spaces.
    *   Quotes: Single quotes.
    *   Semi-colons: Yes.
    *   Trailing Commas: All.
    *   Print Width: 150 characters.
*   **Naming Conventions:**
    *   **Components:** PascalCase (e.g., `ModelBasicSettings.tsx`).
    *   **Hooks/Functions:** camelCase (e.g., `useContentForm.ts`, `configureStore`).
    *   **Redux Slices:** camelCase, suffixed with `Slice` (e.g., `authSlice.ts`).
    *   **Files:** Generally PascalCase for components, camelCase for logic/utils.
*   **State Management:**
    *   Use Redux Toolkit `createSlice`.
    *   Use typed hooks `useAppDispatch` and `useAppSelector` from `@/store/hooks`.
    *   Avoid direct `useDispatch` or `useSelector` imports from `react-redux` in components.
*   **Import Aliases:**
    *   Use `@/` to refer to the `src` directory (e.g., `import ... from '@/components/...'`).
*   **Internationalization:**
    *   Use `useTranslation` hook.
    *   Keys should be organized in `src/locales/{lang}/translation.json`.

## 5. Key Files & Entrypoints

*   **Main Entrypoint:** `cms-fe/src/main.tsx` (Bootstraps React and Redux).
*   **App Root:** `cms-fe/src/App.tsx`.
*   **Routing:** `cms-fe/src/router.tsx` (Route definitions).
*   **Store Config:** `cms-fe/src/store/store.ts`.
*   **Build Config:** `cms-fe/vite.config.ts`.
    *   **Note:** Custom manual chunking is implemented for build optimization (splitting `react`, `antd`, `redux`, etc.).
*   **TypeScript Config:** `cms-fe/tsconfig.app.json` (Application logic) and `cms-fe/tsconfig.node.json` (Build scripts).

## 6. Development & Testing Workflow

*   **Local Development:**
    *   Run `pnpm install` to install dependencies.
    *   Run `pnpm dev` to start the Vite development server.
*   **Building:**
    *   Run `pnpm build` for production builds (includes type checking via `tsc`).
*   **Linting & Formatting:**
    *   `pnpm lint`: Runs ESLint.
    *   `pnpm format:write`: Runs Prettier to fix formatting issues.
    *   **Note:** The project uses the flat ESLint config format (`eslint.config.js`).

## 7. Specific Instructions for AI Collaboration

*   **React 19:** This project uses React 19. Ensure any suggested code patterns (especially regarding refs, context, and server components if applicable) are compatible with React 19.
    *   *Note:* The "React Compiler" babel plugin is present in the build config.
*   **Ant Design:** Prefer using Ant Design components for UI elements. Check strictly for v6.x API compatibility.
*   **Path Resolution:** ALWAYS use the `@/` alias for imports within the `src` directory. Do not use relative paths like `../../` unless strictly necessary for sibling files.
*   **Strict Mode:** TypeScript `strict` mode is enabled. Ensure all code is fully typed. Avoid `any`.
*   **I18n:** When adding user-facing text, always wrap it in translation calls and suggest adding keys to the `locales` files.
