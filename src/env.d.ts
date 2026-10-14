interface ImportMetaEnv {
  /** "false" oculta el switch de paletas en el build final. */
  readonly PUBLIC_SHOW_PALETTE_SWITCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
