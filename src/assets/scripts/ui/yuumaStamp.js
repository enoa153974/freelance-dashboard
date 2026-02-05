/* デバッグ用・開発ツールのコンソールログに下記を打ち込みエンター
リセット：
localStorage.removeItem('yuuma-stamp-count');
localStorage.removeItem('yuuma-stamp-last-date');

10個たまったときの花丸演出：
localStorage.setItem('yuuma-stamp-count', 9);
localStorage.removeItem('yuuma-stamp-last-date');
location.reload();
*/


// yuuma-stamp.js（花丸演出つき完成版）
export function initYuumaStamp() {
    const STORAGE_KEY = 'yuuma-stamp-count';
    const DATE_KEY = 'yuuma-stamp-last-date';
    const MAX_STAMP = 10;

    const $stamps = $('.stamp');
    const $addBtn = $('.stamp-action-btn');
    const $overlay = $('#hanamaru-overlay');
    const $overlayBtn = $('.hanamaru__btn');

    if ($stamps.length === 0 || $addBtn.length === 0) return;

    function loadCount() {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? Number(value) : 0;
    }

    function saveCount(count) {
        localStorage.setItem(STORAGE_KEY, count);
    }

    function getToday() {
        const now = new Date();
        return now.toISOString().slice(0, 10);
    }

    function render(count) {
        $stamps.removeClass('is-filled').text('○');

        $stamps.each(function (index) {
            if (index < count) {
                $(this).addClass('is-filled').text('🌸');
            }
        });
    }

    function isAlreadyStampedToday() {
        const lastDate = localStorage.getItem(DATE_KEY);
        const count = loadCount();
        return lastDate === getToday() && count > 0;
    }

    function markStampedToday() {
        localStorage.setItem(DATE_KEY, getToday());
    }
    function showHanamaru() {
        $overlay.removeClass('is-hidden');
        $('body').addClass('no-scroll');
    }

    function hideHanamaru() {
        $overlay.addClass('is-hidden');
        $('body').removeClass('no-scroll');
    }

    function updateButtonState() {
        if (isAlreadyStampedToday()) {
            $addBtn.prop('disabled', true).text('今日はおやすみ🌙');
        } else {
            $addBtn.prop('disabled', false).text('スタンプをおす');
        }
    }
    function addStamp() {
        if (isAlreadyStampedToday()) {
            updateButtonState();
            return;
        }

        let count = loadCount();
        if (count >= MAX_STAMP) return;

        count++;

        // 今日押したことを記録
        markStampedToday();

        if (count === MAX_STAMP) {
            showHanamaru();

            // 10は保存しない（イベント扱い）
            saveCount(0);
            render(0);
            updateButtonState();
            return;
        }

        saveCount(count);
        render(count);
        updateButtonState();
    }

    $overlayBtn.off('click').on('click', function () {
        hideHanamaru();
        updateButtonState();
    });


    // 初期表示（保険つき）
    const initialCount = loadCount();
    if (initialCount >= MAX_STAMP) {
        saveCount(0);
        render(0);
    } else {
        render(initialCount);
    }

    // ★これが抜けてた！
    $addBtn.off('click').on('click', addStamp);
    updateButtonState();
}