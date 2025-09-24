# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-24

### Added

- **Core Features**
  - Paginated job listing (8 jobs per page)
  - Search functionality by title and tags
  - Status filtering (active/archived)
  - Create and edit job functionality with modal forms
  - Archive/unarchive job capability
  - Deep linking to job details (`/jobs/:jobId` or `/jobs/:slug`)
- **Advanced Features**
  - Drag and drop job reordering with optimistic UI
  - Automatic rollback on server failure
  - Unique slug generation from job titles
  - Form validation with error handling
  - Responsive design for all screen sizes
- **Technical Implementation**
  - MSW (Mock Service Worker) for API mocking
  - LocalForage for data persistence
  - React Router for navigation
  - @dnd-kit for accessible drag and drop
  - Tailwind CSS for styling
  - Lucide React for icons
- **Testing**
  - Comprehensive unit tests with Vitest and React Testing Library
  - End-to-end tests with Playwright
  - Deterministic test mode with data seeding
  - Test coverage for all major user flows
- **Developer Experience**
  - Hot module replacement with Vite
  - ESLint configuration
  - Loading skeleton states
  - Error boundaries and handling
  - TypeScript-ready architecture

### Technical Details

- **Frontend**: React 18.2.0, Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **Routing**: React Router DOM 6.20.1
- **State Management**: React Hooks with custom hooks
- **API Mocking**: MSW 2.0.11
- **Testing**: Vitest, React Testing Library, Playwright
- **Build Tool**: Vite with HMR support
