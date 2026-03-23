import { qs, toggleClass, removeClass, addClass } from "../utils/dom.js";

export function initHamburger() {

    const toggle = qs(".header__toggle");
    const nav = qs(".header__nav");
    const overlay = qs(".header__overlay");
    const body = document.body;

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {

        toggleClass(toggle, "is-active");
        toggleClass(nav, "is-open");
        toggleClass(overlay, "is-open");
        toggleClass(body, "no-scroll");

    });

    overlay.addEventListener("click", () => {

        removeClass(toggle, "is-active");
        removeClass(nav, "is-open");
        removeClass(overlay, "is-open");
        removeClass(body, "no-scroll");

    });

}