// ==================================================
// ■ ファイルを保存する際に自動的に最適なフォルダを出してくれるUI
// ==================================================

import { qs, qsa, addClass, removeClass } from "../utils/dom.js";

const BASE_PATH = "OneDrive/Freelance"; // ←表示用フルパス

export function initSaveWizard({ root }) {
    let currentStep = 1;

    if (!root) return;

    const state = { type: null, folder: null };
    const steps = qsa(".step", root);

    function go(step) {
        currentStep = Number(step);

        //STEP表示切替
        steps.forEach(s => removeClass(s, "active"));

        const target = qs(`[data-step="${currentStep}"]`, root);
        if (target) addClass(target, "active");

        //現在のSTEPを可視化するガイド部分
        const dots = qsa(".wizard-steps [data-stepdot]", root);
        dots.forEach(dot => {
            removeClass(dot, "is-active");
            if (Number(dot.dataset.stepdot) === currentStep) {
                addClass(dot, "is-active");
            }
        });

        // Step1のとき戻るボタンを隠す
        const backBtn = qs("#backStep", root);
        if (backBtn) {
            if (currentStep === 1) {
                backBtn.style.display = "none";
            } else {
                backBtn.style.display = "inline-block";
            }
        }
        const firstInput = target?.querySelector("input,select,textarea,button");
        firstInput?.focus();

    }

    // ------------------------------
    // STEP1:ファイルのデータの種別を選別
    // ------------------------------
    qsa("[data-type]", root).forEach(btn => {
        btn.addEventListener("click", () => {
            state.type = btn.dataset.type;

            // projectだったらstep2に進む
            if (state.type === "project") {
                go(2);
                return;
            }

            // project以外はStep3に飛ばして結果を見せる
            state.folder = "";
            go(3);
            renderResult();
        });
    });

    // ------------------------------
    // STEP2で入力された情報を元に、STEP3でファイルパスを生成
    // ------------------------------

    const toStep3 = qs("#toStep3", root);


    if (toStep3) {
        //各種情報がフォームに入力されているか判定
        toStep3.addEventListener("click", () => {
            const history = qs("#projectHistory", root)?.value || "";
            const month = (qs("#month", root)?.value || "").trim();
            const project = (qs("#projectName", root)?.value || "").trim();
            const company = (qs("#companyName", root)?.value || "").trim();

            //  履歴があればそちらを優先
            if (history) {
                state.folder = history;
            } else {
                //  最低限の入力チェック（空だとフォルダ名が壊れるため）
                if (!month || !project || !company) {
                    //アラートメッセージを表示
                    alert("新規案件を作る場合は「月 / 案件名 / 会社名」を入力してね");
                    return;
                }

                //ファイルパスを生成
                state.folder = `${month}_${project}_${company}`;
                //localstorageの履歴に保存
                saveHistory(state.folder);
            }

            //STEP3に移行
            go(3);
            renderResult();
        });
    }

    // ------------------------------
    // 履歴の保存と呼び出し処理
    // ------------------------------

    //生成されたパスを履歴に保存する処理
    // NOTE: localstorage使用
    function saveHistory(folder) {
        let list = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        if (!list.includes(folder)) {
            list.unshift(folder);
            localStorage.setItem("projectHistory", JSON.stringify(list.slice(0, 10)));
        }

        //履歴を呼び出し
        loadHistory();
    }

    //履歴を呼び出す処理
    function loadHistory() {
        const select = qs("#projectHistory", root);
        if (!select) return;

        const list = JSON.parse(localStorage.getItem("projectHistory") || "[]");
        //履歴がある場合の表示を生成
        select.innerHTML =
            `<option value="">（履歴から選択）</option>` +
            list.map(v => `<option value="${v}">${v}</option>`).join("");
    }

    loadHistory();// ❗ IMPORTANT: 本当に必要か確認


    // ------------------------------
    // STEP3：結果生成
    // ------------------------------
    //本日の日付を取得
    function getTodayYYYYMMDD() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    }

    //ファイルの保存先を判定してフルパスを生成
    function buildFullPath() {
        // typeに応じて固定ルートを返す
        if (state.type === "client") return `${BASE_PATH}/Clients/`;
        if (state.type === "asset") return `${BASE_PATH}/Assets/`;
        if (state.type === "inbox") return `${BASE_PATH}/Inbox/`;

        // project
        const folderType = qs("#folderType", root)?.value || "02_source";
        const projectFolder = state.folder || "（案件未選択）";
        return `${BASE_PATH}/Projects/${projectFolder}/${folderType}/`;
    }

    //フルパスのファイルネームを生成
    function buildFileName() {
        const date = getTodayYYYYMMDD();
        const type = qs("#fileType", root)?.value || "lp";
        const content = (qs("#contentName", root)?.value || "main").trim() || "main";
        let ext = (qs("#ext", root)?.value || "").trim();
        if (ext && !ext.startsWith(".")) ext = "." + ext;

        // project以外は案件名部分を "--" にして破綻防止
        const folderPart = state.type === "project" ? (state.folder || "UNKNOWN") : "--";

        //生成したフルパスを返す
        return `${date}_${type}_${folderPart}_${content}_v01${ext}`;
    }


    //結果を返して表示する
    function renderResult() {
        const result = qs("#result", root);
        if (!result) return;

        // Step3が見えてない段階でも、プレビューは出してOK（便利）
        const fullPath = buildFullPath();
        const fileName = buildFileName();

        //プレビューを画面に表示
        result.textContent =
            `保存先（フルパス）\n${fullPath}\n\nファイル名\n${fileName}`;
        addClass(result, "result");

    }


    // Step3入力が変わったらプレビューをリアルタイム更新
    ["#fileType", "#contentName", "#ext", "#folderType", "#projectHistory", "#month", "#projectName", "#companyName"].forEach(sel => {
        const el = qs(sel, root);
        if (!el) return;
        el.addEventListener("input", renderResult);
        el.addEventListener("change", renderResult);
    });


    // ------------------------------
    // ◆ 戻るボタン
    // ------------------------------

    const backBtn = qs("#backStep", root);

    //戻るボタンを押したらSTEPを今いるとこからひとつ戻す
    if (backBtn) {
        backBtn.addEventListener("click", () => {

            if (currentStep > 1) {
                go(currentStep - 1);
            }

        });
    }


    // ------------------------------
    // コピー処理（3ボタン対応版）
    // ------------------------------

    async function copy(text, label) {
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            showCopyToast(label + "をコピーしました");
        } catch {
            alert("コピー失敗");
        }
    }

    //各ボタンの要素を取得
    const actions = {
        copyPath: () => copy(buildFullPath(), "パス"),
        copyName: () => copy(buildFileName(), "ファイル名"),
        copyAll: () => copy(buildFullPath() + buildFileName(), "フルパス")
    };

    Object.entries(actions).forEach(([id, fn]) => {
        const btn = qs(`#${id}`, root);
        if (btn) btn.addEventListener("click", fn);
    });

    // ------------------------------
    // ◆ トースト通知
    // ------------------------------

    function showCopyToast(msg) {
        let toast = document.querySelector(".copy-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "copy-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = msg;
        addClass(toast,"show");

        setTimeout(() => {
            removeClass(toast,"show");
        }, 1400);
    }

    //初回表示をSTEP1に
    go(1);
}
