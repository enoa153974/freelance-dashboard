let cache = null;

export async function loadFlows() {
    if (cache) return cache;

    const res = await fetch('/docs/freelance_dev_flows.md');
    const text = await res.text();
    cache = text;

    return text;
}