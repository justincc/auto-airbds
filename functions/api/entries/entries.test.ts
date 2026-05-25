import { describe, expect, it, beforeEach } from "vitest";

interface SimpleKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<{ keys: { name: string }[] }>;
}

class MockKV implements SimpleKV {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async list(): Promise<{ keys: { name: string }[] }> {
    return { keys: [...this.store.keys()].map((name) => ({ name })) };
  }
}

const MAX_UPLOADS = 30;

describe("KV store", () => {
  let kv: SimpleKV;

  beforeEach(() => {
    kv = new MockKV();
  });

  it("rejects upload when store is at maximum capacity", async () => {
    for (let i = 0; i < MAX_UPLOADS; i++) {
      await kv.put(`entry-${i}`, JSON.stringify({ id: `e${i}`, data: i }));
    }

    const { keys } = await kv.list();
    expect(keys.length).toBe(MAX_UPLOADS);
    expect(keys.length < MAX_UPLOADS).toBe(false);
  });

  it("accepts upload again after a deletion frees a slot", async () => {
    for (let i = 0; i < MAX_UPLOADS; i++) {
      await kv.put(`e${i}`, JSON.stringify({ id: `e${i}`, data: i }));
    }

    await kv.delete("e0");

    const { keys } = await kv.list();
    expect(keys.length).toBe(MAX_UPLOADS - 1);
    expect(keys.length < MAX_UPLOADS).toBe(true);
  });

  it("stores and retrieves an entry", async () => {
    const entry = { id: "test-1", timestamp: "2026-05-25T12:00:00.000Z", data: { hello: "world" } };
    await kv.put(entry.id, JSON.stringify(entry));

    const raw = await kv.get(entry.id);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(entry);
  });

  it("deletes an entry from the store", async () => {
    await kv.put("a", JSON.stringify({ id: "a", data: 1 }));
    await kv.put("b", JSON.stringify({ id: "b", data: 2 }));

    await kv.delete("a");

    const { keys } = await kv.list();
    expect(keys.map((k) => k.name)).toEqual(["b"]);
  });

  it("returns null for a non-existent key", async () => {
    const result = await kv.get("nope");
    expect(result).toBeNull();
  });
});
