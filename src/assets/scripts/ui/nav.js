
/**
 * nav.js
 *
 * ナビゲーション関連の初期化
 */

export function initNav() {
    // 任意のページに移管する関数
    const pageButtons = document.querySelectorAll('.nav-btn[data-page]');
    pageButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            if (!page) return;

            navigator.vibrate?.(50);
            location.href = `/src/pages/${page}.html`;
        });
    });

    // ChatGPT ボタン
    const chatBtn = document.getElementById('btnChatGPT');
    chatBtn?.addEventListener('click', () => {
        navigator.vibrate?.(50);
        location.href = 'https://chatgpt.com/';
    });

    // amazon ボタン
    const amazonBtn = document.getElementById('btnAmazon');
    amazonBtn?.addEventListener('click', () => {
        navigator.vibrate?.(50);
        location.href = 'https://www.amazon.co.jp?adgrpid=157529192841&hvpone=&hvptwo=&hvadid=675114138690&hvpos=&hvnetw=g&hvrand=11480009433163112229&hvqmt=e&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1009523&hvtargid=kwd-10573980&hydadcr=27922_14701883&linkCode=ll2&tag=aoi22-22&linkId=2605ff38664b1739b1762c3fb83ea87b&ref_=as_li_ss_tl';
    });

    
    // notion ボタン
    const notionBtn = document.getElementById('btnNotion');
    notionBtn?.addEventListener('click', () => {
        navigator.vibrate?.(50);
        location.href = 'https://www.notion.so/HOME-a6846192b45842c4b75dd2df0d6fca17';
    });

}

