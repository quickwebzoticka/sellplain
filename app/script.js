$(document).ready(function(){
    $("body").on('click','button[data-href]',function(){
        $(this).siblings('form').submit();
    });


    var location = window.location.href,
        searchInputs = $('.search_input'),
        formPath = $('.search_bar').attr('action'),
        container = $('.contener-input');

    function sendForm() {
        $(document).on('click', '.radio-row', function(){
            //$('form').submit();
            $(this).parents("form").submit();
        });
    };

    function searchBtn(){
        $('form').attr('action', '');
        $('.search_input').remove();
        $('.kvs-select').removeClass('kvs-select_fullsize');
        //$('.search_bar').attr('action', '/neighbors/search/');
        $('.search_bar button[type="submit"]').prop('disabled', true);
        $('.search_bar button[type="submit"]').addClass('disabled');
        $temp = 0;
        if(BX.message('SWITCH_OUT')){
           $temp = BX.message('SWITCH_OUT');
        }
        let a = $temp;
        container.append(searchInputs[a]);
        let value = $(searchInputs[a]).prop('value');
        $(searchInputs[a]).val('');
        $(searchInputs[a]).val(value);

        $(searchInputs[a]).keyup(function() {
            if ($(this).val() == '') {
                $('.search_bar button[type="submit"]').prop('disabled', true);
                $('.search_bar button[type="submit"]').addClass('disabled');
                $('form').attr('action', '');
                console.log(1);
            } else {
                $('.search_bar button[type="submit"]').prop('disabled', false);
                $('.search_bar button[type="submit"]').removeClass('disabled');
                $('form').attr('action', '/neighbors/search/');
                console.log(2);
            }
        });

        // if (a == 2) {
        //     formPath = location;
        //     $('.search_bar').attr('action', formPath);
        //     $('.kvs-select').addClass('kvs-select_fullsize');
        // };

        $(document).on('click', '.search_bar__nav:not(.active)', function(){
            let a = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');

            $('.search_input').remove();
            // $('.kvs-select').removeClass('kvs-select_fullsize');
            // $('.search_bar').attr('action', '/neighbors/search/');
            $('.search_bar button[type="submit"]').prop('disabled', true);
            $('.search_bar button[type="submit"]').addClass('disabled');

            container.append(searchInputs[a]);
            $(searchInputs[a]).val('');
            $('form').attr('action', '');
            $(searchInputs[a]).keyup(function() {
                if ($(this).val() == '') {
                    $('.search_bar button[type="submit"]').prop('disabled', true);
                    $('.search_bar button[type="submit"]').addClass('disabled');
                    $('form').attr('action', '');
                    console.log(1);
                } else {
                    $('.search_bar button[type="submit"]').prop('disabled', false);
                    $('.search_bar button[type="submit"]').removeClass('disabled');
                    $('form').attr('action', '/neighbors/search/');
                    console.log(2);
                }
            });

            // if (a == 2) {
            //     formPath = location;
            //     $('.search_bar').attr('action', formPath);
            //     $('.kvs-select').addClass('kvs-select_fullsize');
            //     $('.search_bar button[type="submit"]').prop('disabled', false);
            //     $('.search_bar button[type="submit"]').removeClass('disabled');
            // };
            return false;
        });
    };

    searchBtn();
    sendForm();
});