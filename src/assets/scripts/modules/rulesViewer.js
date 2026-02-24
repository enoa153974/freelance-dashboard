let cache = null;

export async function loadRules() {
    if (cache) return cache;

    const res = await fetch('/docs/freelance_folder_rules.md');
    const text = await res.text();
    cache = text;

    return text;
}