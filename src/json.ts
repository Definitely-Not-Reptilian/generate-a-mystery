import { readFileSync, writeFileSync } from 'fs';
import { safeLoad, safeDump } from 'js-yaml';

const JSON_FORMATTING_SPACES = 2;

export function readJson<T>(filepath: string): T {
  return JSON.parse(readFileSync(filepath, { encoding: 'UTF8' }));
}
export function readYaml<T>(filepath: string): T {
  return safeLoad(readFileSync(filepath, { encoding: 'UTF8' }));
}
export function loadJson<T>(filename: string): T {
  return readJson(`./data/${filename}.json`);
}

export function writeJSON(filename: string, data: any): void {
  writeFileSync(`${filename}.json`, JSON.stringify(data, undefined, JSON_FORMATTING_SPACES), { encoding: 'UTF8' });
}
const HIGH_PRIORITY_KEYS = new Set(['title', 'name', 'seed']);
const PRIORITY_KEYS = new Set(['firstName', 'lastName', 'players']);
const LOW_PRIORITY_KEYS = new Set(['powers', 'goals', 'otherPeople']);
function keySortCompare(a: string, b: string): number {
  let weight = 0;
  if (HIGH_PRIORITY_KEYS.has(a)) {
    weight = -100;
  } else if (HIGH_PRIORITY_KEYS.has(b)) {
    weight = 100;
  } else if (PRIORITY_KEYS.has(a)) {
    weight = -10;
  } else if (PRIORITY_KEYS.has(b)) {
    weight = 10;
  } else if (LOW_PRIORITY_KEYS.has(a)) {
    weight = 10;
  } else if (LOW_PRIORITY_KEYS.has(b)) {
    weight = -10;
  }
  return a.localeCompare(b) + weight;
}
export function writeYaml<T>(filename: string, data: any): void {
  writeFileSync(`${filename}.yaml`, safeDump(data, { lineWidth: 180, sortKeys: keySortCompare }), { encoding: 'UTF8' });
}
