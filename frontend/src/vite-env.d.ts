/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other variables here as you add them to your .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}