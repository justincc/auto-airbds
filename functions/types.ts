import type { KVNamespace } from "@cloudflare/workers-types";

export interface UploadEntry {
  id: string;
  timestamp: string;
  data: unknown;
}

export interface Env {
  UPLOADS: KVNamespace;
}
