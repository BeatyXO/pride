import { cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('../public/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('../index.html', import.meta.url), new URL('../public/index.html', import.meta.url));
await cp(new URL('../assets/', import.meta.url), new URL('../public/assets/', import.meta.url), { recursive: true });
