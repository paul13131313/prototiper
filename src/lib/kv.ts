import { Redis } from "@upstash/redis";

export type Prototype = {
  slug: string;
  genre: string;
  tagline: string;
  html: string;
  createdAt: string;
};

const INDEX_KEY = "prototypes:index";
const PROTOTYPE_PREFIX = "prototype:";

let redis: Redis | null = null;
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
} catch {
  redis = null;
}

const memoryStore = new Map<string, string>();

async function kvGet<T>(key: string): Promise<T | null> {
  if (redis) {
    return await redis.get<T>(key);
  }
  const val = memoryStore.get(key);
  return val ? (JSON.parse(val) as T) : null;
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (redis) {
    await redis.set(key, JSON.stringify(value));
    return;
  }
  memoryStore.set(key, JSON.stringify(value));
}

export async function getPrototypeList(): Promise<string[]> {
  const list = await kvGet<string[]>(INDEX_KEY);
  return list || [];
}

export async function getPrototype(slug: string): Promise<Prototype | null> {
  return await kvGet<Prototype>(`${PROTOTYPE_PREFIX}${slug}`);
}

export async function getAllPrototypes(): Promise<Prototype[]> {
  const slugs = await getPrototypeList();
  const prototypes: Prototype[] = [];
  for (const slug of slugs) {
    const p = await getPrototype(slug);
    if (p) prototypes.push(p);
  }
  return prototypes;
}

export async function savePrototype(data: Prototype): Promise<void> {
  await kvSet(`${PROTOTYPE_PREFIX}${data.slug}`, data);
  const slugs = await getPrototypeList();
  if (!slugs.includes(data.slug)) {
    slugs.unshift(data.slug);
    await kvSet(INDEX_KEY, slugs);
  }
}
