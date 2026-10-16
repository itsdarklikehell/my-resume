# Contributing

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/REPO_NAME.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Run tests/linting if available
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation for changes
- Keep commits focused and atomic
- Keep all README translations (EN/NL/DE/FR) in sync
- Keep CHANGELOG.md updated with new features

## Pull Requests

- Describe what changed and why
- Reference related issues
- Ensure CI passes before requesting review

## Internationalization (i18n)

- All user-facing text must use `data-i18n` keys in `index.html`.
- When adding new translatable text, add the key to all 4 translation objects (nl, en, de, fr) in `index.html`.
- The NL translation must have 100% coverage of all HTML `data-i18n` keys.
- Use `toggleLang()` to cycle nl → en → de → fr.
- URL parameter `?lang=<code>` overrides auto-detection and persistence.

## Color palettes

- Palettes are defined as `data-palette` CSS overrides in the `<style>` block.
- New palettes must be added to both the CSS (`[data-palette="name"]`) and the JS `togglePalette()` order array.
- Palette choice is persisted via `localStorage`.

## Download CV section

- Download/print buttons use `.lang-nl` / `.lang-en` classes for language-aware visibility.
- Only NL and EN buttons are shown for CV print/download (matching the available CV languages).
- JSON download button is shown for all languages.
- Keep visibility logic in `applyLang()` consistent with the number of language classes.

## Language-aware download block

If you modify the Download CV section, remember to add the appropriate `.lang-nl` or `.lang-en` classes to each button and keep the visibility logic in `applyLang()`.
