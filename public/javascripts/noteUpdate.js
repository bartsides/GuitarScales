$(document).ready(function() {
    $('select[name="noteSelect"]').change(function (e) {
        update($(this).val());
    })
});