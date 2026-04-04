// modules/markdownLoader.js
const cacheMap = {};

export async function loadMarkdown(path) {
    if (cacheMap[path]) return cacheMap[path];

    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to fetch');

    const text = await res.text();
    cacheMap[path] = text;

    return text;
}