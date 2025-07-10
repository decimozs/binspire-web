/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly ORG_ID: string;
  readonly NODE_ENV: "development" | "production" | "testing";
  readonly VITE_MAP_TILER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
