# Deployment Guide

This site is hosted on GitHub Pages from the `main` branch.

## Local Preview

1. Clone the repository.
2. Ensure you have a recent version of Python (or any static server).
3. Run a local server in the repository root:

   ```bash
   python -m http.server 8000
   ```

4. Open <http://localhost:8000> in your browser.

## Publishing

Changes pushed to the `main` branch are automatically built and deployed by GitHub Pages.

### Manual Trigger (if needed)

- Go to the repository Settings → Pages.
- Under “Source”, ensure `main` branch is selected.
- Click “Deploy site”.

## Testing

- Verify language toggle works (NL/EN).
- Verify theme toggle works (dark/light).
- Check that PDF, JSON, and print buttons appear only for the selected language.
- Open DevTools → Console to ensure no errors.
- Run Lighthouse (Chrome DevTools) for performance, accessibility, SEO, and best practices.