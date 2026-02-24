// ==================================================
// ■ ファイルを保存する際に自動的に最適なフォルダを出してくれるUI
// ==================================================

import { qs, qsa } from "../utils/dom.js";

export function initSaveWizard({ root }) {

    if (!root) return;

    // ✅ 二重初期化防止（overlayを開くたび呼んでも壊れない）
    if (root.dataset.initialized === "1") return;
    root.dataset.initialized = "1";

    const state = { type: null, folder: null };

    const steps = qsa(".step", root);

    function go(step) {
        steps.forEach(s => s.classList.remove("active"));
        const target = qs(`[data-step="${step}"]`, root);
        if (target) target.classList.add("active");
    }

    // ------------------------------
    // STEP1
    // ------------------------------
    qsa("[data-type]", root).forEach(btn => {
        btn.addEventListener("click", () => {
            state.type = btn.dataset.type;

            if (state.type === "project") {
                go(2);
                return;
            }

            // ✅ project以外はStep3に飛ばして結果を見せる
            state.folder = null;
            go(3);
            renderResult();
        });
    });

    // ------------------------------
    // STEP2 → STEP3
    // ------------------------------
    const toStep3 = qs("#toStep3", root);
    if (toStep3) {
        toStep3.addEventListener("click", () => {
            const history = qs("#projectHistory", root)?.value || "";
            const month = (qs("#month", root)?.value || "").trim();
            const project = (qs("#projectName", root)?.value || "").trim();
            const company = (qs("#companyName", root)?.value || "").trim();

            // ✅ 履歴優先
            if (history) {
                state.folder = history;
            } else {
                // ✅ 最低限の入力チェック（空だとフォルダ名が壊れる）
                if (!month || !project || !company) {
                    alert("新規案件を作る場合は「月 / 案件名 / 会社名」を入力してね");
                    return;
                }

                state.folder = `${month}_${project}_${company}`;
                saveHistory(state.folder);
            }

            go(3);
            renderResult();
        });
    }

    // ------------------------------
    // 履歴
    // ------------------------------
    function saveHistory(folder) {
        let list = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        if (!list.includes(folder)) {
            list.unshift(folder);
            localStorage.setItem("projectHistory", JSON.stringify(list.slice(0, 10)));
        }
        loadHistory();
    }

    function loadHistory() {
        const select = qs("#projectHistory", root);
        if (!select) return;

        const list = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        select.innerHTML =
            `<option value="">（履歴から選択）</option>` +
            list.map(v => `<option value="${v}">${v}</option>`).join("");
    }
    loadHistory();

    // ------------------------------
    // 結果生成
    // ------------------------------
    function renderResult() {
        const result = qs("#result", root);
        if (!result) return;

        const type = qs("#fileType", root)?.value || "lp";
        const content = (qs("#contentName", root)?.value || "main").trim() || "main";
        const ext = (qs("#ext", root)?.value || "").trim();

        const now = new Date();
        const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

        let path = "";
        if (state.type === "project") {
            const folderType = qs("#folderType", root)?.value || "02_source";
            path = `Projects/${state.folder}/${folderType}/`;
        } else if (state.type === "client") {
            path = "Clients/";
        } else if (state.type === "asset") {
            path = "Assets/";
        } else {
            path = "Inbox/";
        }

        // ✅ project以外はfolderが無いのでファイル名の案件部分を "--" にする
        const folderPart = state.type === "project" ? state.folder : "--";
        const name = `${date}_${type}_${folderPart}_${content}_v01${ext}`;

        result.textContent = `保存先\n${path}\n\nファイル名\n${name}`;
    }

    // ✅ Step3の入力変更でリアルタイム更新（便利）
    ["#fileType", "#contentName", "#ext"].forEach(sel => {
        const el = qs(sel, root);
        if (!el) return;
        el.addEventListener("input", renderResult);
        el.addEventListener("change", renderResult);
    });

    // ------------------------------
    // コピー
    // ------------------------------
    const copyBtn = qs("#copyAll", root);
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            const text = qs("#result", root)?.textContent || "";
            await navigator.clipboard.writeText(text);
            alert("コピーした");
        });
    }
}