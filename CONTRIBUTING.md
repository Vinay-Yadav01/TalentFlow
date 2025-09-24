# Contributing to TalentFlow Jobs Board

First off, thank you for considering contributing to TalentFlow! It's people like you that make TalentFlow such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps** which reproduce the problem
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior** you observed after following the steps
- **Explain which behavior** you expected to see instead and why
- **Include screenshots and animated GIFs** which show you following the described steps

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title** for the issue
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and **explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful** to most TalentFlow users

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setting Up Your Development Environment

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/yourusername/talentflow-jobs-board.git
   cd talentflow-jobs-board
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Initialize MSW**

   ```bash
   npm run msw:init
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Development Guidelines

#### Code Style

- Use TypeScript/JSX for consistency
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic

#### Component Guidelines

- Keep components small and focused
- Use custom hooks for complex state logic
- Follow the existing folder structure
- Export components as default exports

#### Testing

- Write tests for new features and bug fixes
- Use descriptive test names
- Test user interactions, not implementation details
- Ensure all tests pass before submitting PR

### Commit Messages

Use clear and meaningful commit messages:

```
feat: add job search functionality
fix: resolve pagination bug on mobile
docs: update installation instructions
test: add tests for job creation flow
```

### Testing Your Changes

Before submitting a pull request, make sure to:

1. **Run unit tests**

   ```bash
   npm test
   ```

2. **Run E2E tests**

   ```bash
   npm run test:e2e
   ```

3. **Check linting**

   ```bash
   npm run lint
   ```

4. **Test the production build**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

Understanding the project structure will help you contribute more effectively:

```
src/
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── mocks/          # MSW API mocking
├── pages/          # Page components
├── test/           # Test files
└── main.jsx        # App entry point
```

## Getting Help

If you need help, you can:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Join our community discussions

## Recognition

Contributors are recognized in our README.md file and release notes.

Thank you for your contributions! 🙏
