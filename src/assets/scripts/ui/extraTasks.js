import { initExtraTaskManager } from '../common/extraTaskManager.js';

export function initExtraTasks() {
    initExtraTaskManager({
        listEl: document.getElementById('extra-task-list'),
        formEl: document.getElementById('extra-task-form'),
        inputEl: document.getElementById('extra-task-input'),
        resetBtn: document.getElementById('extra-task-reset'),
        storageKeyPrefix: 'yuuma-extra',
        showHanamaru: true
    });
}