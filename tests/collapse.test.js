import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('skills list collapse styling', () => {
  it('hides skill items after the first three until expanded', async () => {
    const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

    // renderSkills() creates .skill-item siblings; .skill-bar is nested inside
    // each item, so applying nth-child to .skill-bar never limits the list.
    expect(css).toContain(
      '#skills-container:not(.expanded) .skill-item:nth-child(n + 4)'
    );
    expect(css).not.toContain(
      '#skills-container:not(.expanded) .skill-bar:nth-child(n + 4)'
    );
  });
});
