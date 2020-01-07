import { readFileSync, writeFileSync } from 'fs';

const JSON_FORMATTING_SPACES = 2;

export function readJson<T>(filepath: string): T {
  return JSON.parse(readFileSync(filepath, { encoding: 'UTF8' }));
}

export function loadJson<T>(filename: string): T {
  return readJson(`./data/${filename}.json`);
}

export function writeJSON(filename: string, data: any): void {
  writeFileSync(`${filename}.json`, JSON.stringify(data, undefined, JSON_FORMATTING_SPACES), { encoding: 'UTF8' });
}
