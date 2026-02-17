import { initExtraTaskManager } from '../common/extraTaskManager.js';
import { qs } from "../utils/dom.js";

export function initTodoTasks() {
    initExtraTaskManager({
        listEl: qs('#extra-task-list'),
        formEl: qs('#extra-task-form'),
        inputEl: qs('#extra-task-input'),
        resetBtn: qs('#extra-task-reset'),
        storageKeyPrefix: 'todo-task',
    });
}