/// <reference types="vite/client" />

// Vite's built-in ImportMetaEnv type only knows about its own reserved
// fields (MODE, DEV, PROD, etc.) — it has no way to know about custom env
// vars unless told explicitly. This augments that interface via TypeScript
// declaration merging so sanity/env.ts's `import.meta.env.SANITY_STUDIO_*`
// references type-check correctly instead of erroring as unknown
// properties. Purely a typing fix — doesn't change runtime behavior at
// all; Vite already provided these values at build time regardless.
interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string;
  readonly SANITY_STUDIO_DATASET: string;
  readonly SANITY_STUDIO_API_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
