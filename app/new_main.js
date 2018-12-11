$(document).ready(function() {
    $('.select').SumoSelect();

    $(document).on('click', '.button-edit', function(){
        $(this).siblings('input[type="text"]').prop('disabled', false);
    });

    $(document).on('click', '.phone-switcher-tumblr', function(e){
        if ($('.phone-switcher').attr('src') == '/lk/img/phone-off.svg') {
            $('.phone-switcher').attr('src', '/lk/img/phone.svg');
        } else {
            $('.phone-switcher').attr('src', '/lk/img/phone-off.svg');
        }
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            $(this).find('input[type="checkbox"]').prop('checked', false);
        } else {
            $(this).find('input[type="checkbox"]').prop('checked', true);
        }
        return false;
    });
    $(document).on('click', '.email-switcher-tumblr', function(e){
        if ($('.email-switcher').attr('src') == '/lk/img/email-off.svg') {
            $('.email-switcher').attr('src', '/lk/img/email.svg');
        } else {
            $('.email-switcher').attr('src', '/lk/img/email-off.svg');
        }
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            $(this).find('input[type="checkbox"]').prop('checked', false);
        } else {
            $(this).find('input[type="checkbox"]').prop('checked', true);
        }
        return false;
    });

    $(document).on('click', '.visibility', function(){
        $('#edit_visibility').slideDown();
    });

    $(document).click( function(event){
        if ( $(event.target).closest('#edit_visibility').length || $(event.target).closest('.visibility').length ) 
            return;

        $('#edit_visibility').slideUp();
        event.stopPropagation();
    });

    $(document).on('click', '.mob-hamburger', function(){
        $('.ul_out').slideToggle(400);
    });

    navigator.sayswho= (function(){
        var ua=  navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        return M.join(' ');
    })();


    if(navigator.sayswho == 'IE 11.0') {
        document.querySelector('body').className += ' ie11';
    };
});

