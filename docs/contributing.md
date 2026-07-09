# Contributing

Guidelines for contributing to PokeWeak.

## Getting Started

### Prerequisites

- Node.js ≥ 22.12.0
- Git
- Code editor (VS Code recommended)

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/your-username/pokeweak.git
cd pokeweak
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/original-username/pokeweak.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## Development Workflow

### 1. Create Branch

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/your-feature upstream/main
```

### 2. Make Changes

Follow the coding standards below.

### 3. Test Changes

```bash
# Run linter
npm run lint

# Run tests
npm run test

# Build production
npm run build
```

### 4. Commit

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, etc.) |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

### 5. Push & Create PR

```bash
git push origin feature/your-feature
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### File Structure

```
src/
├── components/        # Preact (.jsx) or Astro (.astro) components
├── data/              # Static JSON data
├── layouts/           # Astro layouts
├── pages/             # Astro pages (routes)
├── styles/            # Global CSS
├── types/             # TypeScript interfaces
└── utils/             # Utility functions
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SearchIsland.jsx` |
| Utilities | camelCase | `typeCalc.ts` |
| Data files | kebab-case | `pokemon.json` |
| Pages | kebab-case | `cheatsheet.astro` |
| CSS classes | kebab-case | `.pk-list-item` |
| CSS variables | kebab-case | `--bg-body` |
| Types/Interfaces | PascalCase | `Pokemon`, `WeaknessResult` |

### Component Guidelines

#### Preact Components (.jsx)

```jsx
// Component structure
import { useState, useMemo } from 'preact/hooks';
import TypeIcon from './TypeIcon.jsx';
import { calculateWeaknesses } from '@utils/typeCalc';

export default function MyComponent() {
  // State
  const [query, setQuery] = useState('');
  
  // Derived state
  const results = useMemo(() => {
    // computation
  }, [query]);
  
  // Event handlers
  const handleClick = (e) => {
    // handler
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Astro Components (.astro)

```astro
---
// Frontmatter (server-side)
import MainLayout from '@layouts/MainLayout.astro';
import MyComponent from '@components/MyComponent.jsx';

const title = "Page Title";
---

<MainLayout title={title}>
  <!-- Static content -->
  <h1>{title}</h1>
  
  <!-- Interactive Preact component -->
  <MyComponent client:load />
</MainLayout>
```

### TypeScript

Use TypeScript for utility functions and type definitions.

```typescript
// src/types/pokemon.ts
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  speed: number;
  sprite?: string;
}

// src/utils/typeCalc.ts
export function calculateWeaknesses(
  types: string[],
  typeChart: Record<string, Record<string, number>>
): WeaknessResult {
  // implementation
}
```

### CSS

Use CSS variables for theming. Avoid hardcoded colors.

```css
/* Good */
.my-component {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* Bad */
.my-component {
  background: #1E1E1E;
  color: #FFFFFF;
}
```

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels to icon buttons
- Ensure keyboard navigation works
- Test with screen readers
- Respect `prefers-reduced-motion`

---

## Pull Request Guidelines

### PR Title

Follow conventional commits:

```
feat: add new type filter
fix: resolve search autocomplete issue
docs: update component documentation
```

### PR Description

Include:

1. **What** — Brief description of changes
2. **Why** — Reason for changes
3. **How** — Implementation details (if complex)
4. **Screenshots** — For UI changes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Tested on mobile devices
- [ ] Accessibility verified

---

## Reporting Issues

### Bug Reports

Include:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots** (if applicable)
5. **Environment** (browser, OS, device)

### Feature Requests

Include:

1. **Problem** — What problem does this solve?
2. **Solution** — Proposed solution
3. **Alternatives** — Other solutions considered
4. **Context** — Additional context or screenshots

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project conventions

---

## Questions?

Open a discussion on GitHub or reach out to the maintainers.
