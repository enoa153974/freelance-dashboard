import { initYuumaSchedule } from './ui/yuumaSchedule.js';
import { initExtraTasks } from './ui/extraTasks.js';
import { stampPanel } from './ui/stampPanel.js';
import { initYuumaStamp } from './ui/yuumaStamp.js';
import '../styles/style.scss';

window.addEventListener('DOMContentLoaded', () => {
    // HTML読み込みが終わったあとに実行される処理
    console.log('yuuma.js loaded');
    initYuumaSchedule();
    initExtraTasks();
    if ($('#stamp-panel').length) {
        stampPanel();
    }
    initYuumaStamp();
});