export function stampPanel() {
    $('.stamp-open-btn').click(function () {
        $('#stamp-panel').addClass('is-open');
        $('body').addClass('no-scroll');
    });

    $('.stamp-close-btn').click(function () {
        $('#stamp-panel').removeClass('is-open');
        $('body').removeClass('no-scroll');
    });
}