/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_COLLEGE_NAME?: string;
  readonly VITE_COLLEGE_SHORT_NAME?: string;
  readonly VITE_PORTAL_TITLE?: string;
  readonly VITE_CAMPUS_PORTAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
