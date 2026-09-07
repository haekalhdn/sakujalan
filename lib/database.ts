import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type Row = { owner: string; version: number; state: string; updated_at: string };

// ponytail: JSON file in tmpdir — ephemeral on Vercel (per-lambda, resets on cold
// start). Swap for Vercel KV/Postgres if persistence across sessions matters.
class LocalD1Database {
  private file = path.join(os.tmpdir(), 'sakujalan-db.json');
  private store = new Map<string, Row>();

  constructor() {
    this.load();
  }

  private load() {
    this.store.clear();
    try {
      if (fs.existsSync(this.file)) {
        const raw = fs.readFileSync(this.file, 'utf-8');
        const parsed = JSON.parse(raw);
        for (const [k, v] of Object.entries(parsed)) {
          this.store.set(k, v as Row);
        }
      }
    } catch {}
  }

  private save() {
    try {
      const obj: Record<string, Row> = {};
      for (const [k, v] of this.store.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(this.file, JSON.stringify(obj, null, 2), 'utf-8');
    } catch {}
  }

  prepare(query: string) {
    this.load();
    let boundArgs: unknown[] = [];
    return {
      bind: (...args: unknown[]) => {
        boundArgs = args;
        return {
          first: async <T = unknown>(): Promise<T | null> => {
            if (query.includes('SELECT')) {
              const id = String(boundArgs[0]);
              const row = this.store.get(id);
              return (row ? { ...row } : null) as T | null;
            }
            return null;
          },
          run: async () => {
            if (query.includes('INSERT')) {
              // Route SQL is VALUES(?,0,?,?) — version is a literal, only 3 params bound.
              const [owner, state, updated_at] = boundArgs as [string, string, string];
              if (!this.store.has(owner)) {
                this.store.set(owner, { owner, version: 0, state, updated_at });
                this.save();
              }
              return { meta: { changes: 1 } };
            }
            if (query.includes('UPDATE')) {
              const [state, updated_at, owner, version] = boundArgs as [string, string, string, number];
              const existing = this.store.get(owner);
              if (existing && existing.version === version) {
                existing.state = state;
                existing.version = existing.version + 1;
                existing.updated_at = updated_at;
                this.save();
                return { meta: { changes: 1 } };
              }
              return { meta: { changes: 0 } };
            }
            return { meta: { changes: 0 } };
          }
        };
      }
    };
  }
}

const localFallback = new LocalD1Database();

export function database() {
  return localFallback;
}
