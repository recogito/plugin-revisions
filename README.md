# Revisions Plugin

A plugin for Recogito Studio that adds lightweight revision capabilities to the annotation workflow.

![A screenshot of the Recogito Revisions plugin](/screenshot.png "A screenshot of the Recogito Revisions plugin")

## Usage

- Click an existing **read-only annotation**. The plugin provides a new option: **"Make Editable."**
- This action creates a **clone** of the annotation in your current active layer.
- The cloned version is fully editable—you can update tags, edit comments, and add replies.
- The original (read-only) annotation is **visually hidden** while the clone is active.
  - Deleting the clone will restore the original.
  - Filtering to hide the active layer will also reveal the original.

💡 Tip: This allows users to revise automatically generated annotations (e.g. from NER tools) without losing the original data — ideal for correction workflows and clean TEI export using the [TEI Inline Plugin](https://github.com/recogito/plugin-tei-inliner).

## Installation

1. **Change into your Recogito Client folder.** To install the plugin package, run:

```sh
npm install @recogito/plugin-revisions
```

2. **Update your astro.config.mjs to include the plugin:**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

+ import RevisionsPlugin from '@recogito/plugin-revisions';

export default defineConfig({
  integrations: [
    react(),
+   RevisionsPlugin()
  ],
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      noExternal: ['clsx', '@phosphor-icons/*', '@radix-ui/*']
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    }
  }
});
```

3. **Restart the Recogito Client.**