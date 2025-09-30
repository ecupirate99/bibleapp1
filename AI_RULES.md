# AI Development Rules for Bible Explanation App

This document outlines the technical stack and specific library usage guidelines for developing this application. Adhering to these rules ensures consistency, maintainability, and efficient development.

## Tech Stack Overview

*   **Frontend Framework**: React (version 18.x) for building the user interface.
*   **Language**: TypeScript for type safety and improved code quality.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for utility-first styling, enabling rapid and consistent UI development.
*   **UI Component Library**: shadcn/ui for pre-built, accessible, and customizable UI components.
*   **Icons**: Lucide React for a comprehensive set of SVG icons.
*   **AI Integration**: Google Gemini API (`@google/generative-ai`) for generating Bible verse interpretations.
*   **Routing**: React Router for client-side navigation and managing application routes.
*   **Code Quality**: ESLint for enforcing coding standards and identifying potential issues.

## Library Usage Rules

To maintain a consistent and efficient codebase, please follow these guidelines when choosing and implementing libraries:

*   **UI Components**:
    *   **Primary Choice**: Always prioritize `shadcn/ui` components for building the user interface. These components are pre-configured with Tailwind CSS and provide a consistent look and feel.
    *   **Custom Components**: If a specific UI component is not available in `shadcn/ui` or requires significant customization that deviates from its design, create a new custom component in `src/components/`. These custom components must be styled exclusively with Tailwind CSS.
*   **Styling**:
    *   **Exclusive Use**: Use `Tailwind CSS` for all styling purposes. Avoid writing custom CSS classes in separate `.css` or `.module.css` files, except for global base styles defined in `src/index.css`.
    *   **Responsive Design**: All components and layouts must be designed to be responsive using Tailwind's utility classes.
*   **Icons**:
    *   **Standard**: Use `lucide-react` for all icons throughout the application.
*   **Routing**:
    *   **Implementation**: Use `react-router-dom` for all client-side navigation.
    *   **Route Definition**: All main application routes should be defined and managed within `src/App.tsx`.
*   **AI Interactions**:
    *   **API Client**: Utilize the `@google/generative-ai` library for all interactions with the Google Gemini API, as demonstrated in `src/lib/gemini.ts`.
*   **State Management**:
    *   **Local State**: For component-specific state, use React's built-in `useState` and `useReducer` hooks.
    *   **Global State**: For simple global state management, the React Context API is preferred. Avoid introducing external state management libraries (e.g., Redux, Zustand) unless explicitly required for complex, large-scale state needs.
*   **File Structure**:
    *   **New Components**: Always create new components in `src/components/`. Each component should reside in its own dedicated `.tsx` file.
    *   **New Pages**: Create new application pages in `src/pages/`.