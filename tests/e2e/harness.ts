import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Command, State, forecast } from '@/lib/runway';

export const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

export interface StatePayload {
  state: State;
  version: number;
  date: string;
  forecast: ReturnType<typeof forecast>;
  error?: string;
}

export interface ExportPayload {
  format: string;
  exportedAt: string;
  state: State;
  version: number;
  date: string;
  forecast: ReturnType<typeof forecast>;
}

export interface TestCaseResult {
  tier: string;
  feature: string;
  id: string;
  title: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

export class StudentTestSession {
  readonly userId: string;
  private currentVersion: number = 0;

  constructor(userId?: string, exact = false) {
    if (exact && userId) {
      this.userId = userId;
    } else {
      const suffix = Math.random().toString(36).slice(2, 8);
      this.userId = userId ? `${userId}_${Date.now()}_${suffix}` : `e2e_student_${Date.now()}_${suffix}`;
    }
  }

  get headers(): Record<string, string> {
    return {
      'x-sakujalan-user': this.userId,
      'x-runway-user': this.userId,
      'origin': BASE_URL,
      'x-runway-request': '1',
      'content-type': 'application/json',
    };
  }

  async getState(): Promise<StatePayload> {
    const res = await fetch(`${BASE_URL}/api/state`, {
      headers: {
        'x-sakujalan-user': this.userId,
        'x-runway-user': this.userId,
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GET /api/state failed (${res.status}): ${errText}`);
    }
    const data = (await res.json()) as StatePayload;
    this.currentVersion = data.version;
    return data;
  }

  async postCommand(
    command: Command,
    version?: number,
    requestId?: string,
    overrideHeaders?: Record<string, string>
  ): Promise<{ status: number; data: StatePayload | { error: string } }> {
    const v = version !== undefined ? version : this.currentVersion;
    const reqId = requestId || `req-${Date.now()}-${Math.random().toString(36).slice(2, 12).padEnd(16, '0')}`;
    const headers = { ...this.headers, ...overrideHeaders };

    const res = await fetch(`${BASE_URL}/api/state`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        command,
        version: v,
        requestId: reqId,
      }),
    });

    const json = (await res.json()) as StatePayload | { error: string };
    if (res.ok && 'version' in json) {
      this.currentVersion = json.version;
    }
    return { status: res.status, data: json };
  }

  async exportData(): Promise<ExportPayload> {
    const res = await fetch(`${BASE_URL}/api/export`, {
      headers: {
        'x-sakujalan-user': this.userId,
        'x-runway-user': this.userId,
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GET /api/export failed (${res.status}): ${errText}`);
    }
    return (await res.json()) as ExportPayload;
  }
}

export type TestFn = (ctx: { assert: typeof assert }) => Promise<void> | void;

export interface TestDef {
  tier: string;
  feature: string;
  id: string;
  title: string;
  fn: TestFn;
}

const registeredTests: TestDef[] = [];

export function defineTest(
  tier: string,
  feature: string,
  id: string,
  title: string,
  fn: TestFn
): void {
  registeredTests.push({ tier, feature, id, title, fn });
}

export function getRegisteredTests(): TestDef[] {
  return registeredTests;
}

export function readProjectCss(): string {
  const cssPath = resolve(process.cwd(), 'app/globals.css');
  return readFileSync(cssPath, 'utf8');
}

export function readMascotBadgesSource(): string {
  const badgePath = resolve(process.cwd(), 'components/mascot-badges.tsx');
  return readFileSync(badgePath, 'utf8');
}

export function readRunwayAppSource(): string {
  const appPath = resolve(process.cwd(), 'app/runway-app.tsx');
  return readFileSync(appPath, 'utf8');
}
