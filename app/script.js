$(document).ready(function() {
    console.log('Hello there!');
    $('.select').SumoSelect();


    $(document).on('click', '.visibility', function(){
        $('#edit_visibility').slideDown();
    })
    $(document).click( function(event){
        if ( $(event.target).closest('#edit_visibility').length || $(event.target).closest('.visibility').length )
            return;

        $('#edit_visibility').slideUp();
        event.stopPropagation();
    });
    let serviceWrapper = $('.service__wrapper .right-side__container'),
        familyWrapper  = $('.family-wrapper');

    $(document).on('click', '.service__wrapper .photo-wrapper__plus', function(){
        serviceWrapper.clone()
            .appendTo($('.service__wrapper .right-side'));
        $('.service__wrapper .right-side__container:last').find('input:not([type="submit"]), textarea').val('');

    });
    $(document).on('click', '.add-family-btn', function(){
        familyWrapper.clone().hide().appendTo($('.third-screen')).show();
    });
    $(document).on('click', '.mob-hamburger', function(){
        $('.ul_out').slideToggle(400);
    });

    function searchBtn(){
        $(document).on('click', '.search_bar__nav:not(.active)', function(){
            $(this).addClass('active').siblings().removeClass('active');
            $('.search_input').val('').removeClass('active').eq($(this).index()).addClass('active');
            return false;
        });
    };
    searchBtn();

    function hideBlock(block, blockEdit) {
        $(block).hide();
        $(blockEdit).addClass('active');
    };

    function showBlock(block, blockEdit) {
        $(blockEdit).removeClass('active');
        $(block).show();
    };

    /*+ Блок редактирования персональной информации +*/

        $(document).on('click', '.btn-edit-trigger-personal', function(e){ //скрыть
            e.preventDefault();
            $.ajax({
                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                data: {"EDIT_PERSONAL":"Y"},
                type: "POST",
                success: function(html){
                    $(".left-side__container.personal-block").replaceWith($(html));
                    $('.select').SumoSelect();
                }
            })
        });


        function send_portfolio(elemnt){
            var data = new FormData();
            $form = $(elemnt).parents("form").serializeArray();

            $.each($form,function(key,val){
                data.set(val.name, val.value);
            });

            data.set("PERSONAL_PHOTO", $(elemnt).parents("form").find("[type=file]").prop('files')[0]);


            $.ajax({
                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                data: data,
                type: "POST",
                contentType: false,
                processData: false,
                cache: false,
                success: function(html){
                    $.ajax({
                        url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                        data: {"SHOW_PERSONAL":"Y"},
                        type: "POST",
                        success: function(html){
                            $(".left-side__container.personal-block-edit.active").replaceWith($(html));

                        }
                    })
                }
            });
        }


        $(document).on('click', '.personal-block-edit.active input[type="submit"]', function(e){ // показать
            e.preventDefault();
            var data = new FormData();
            var phone_obj = $(".personal-block-edit.active [name=change_phone]");
            var mail_obj = $(".personal-block-edit.active [name=change_email]");
            var obj = this;

            if((!$(phone_obj).is("[disabled]") && $(phone_obj).val() != "")
                || (!$(mail_obj).is("[disabled]") && $(mail_obj).val() != "")){

                var out_string = "Вы действительно хотите изменить";
                var out_content = "";
                if(!$(phone_obj).is("[disabled]")){
                    out_content += "<br> телефон на " + phone_obj.val();
                }
                if(!$(mail_obj).is("[disabled]")){
                    out_content += "<br> e-mail на " + mail_obj.val();
                }

                $.confirm({
                    title: out_string,
                    content: out_content,
                    buttons: {
                        confirm: {
                            text: 'Да',
                            action: function () {
                                send_portfolio(obj);
                            },
                        },
                        cancel: {
                            text: 'Нет',
                            btnClass: 'btn-yes',
                            action: function () {

                                $(".personal-block-edit.active [name=change_phone]").prop("disabled","true");
                                $(".personal-block-edit.active [name=change_email]").prop("disabled","true");

                                send_portfolio(obj);
                            }
                        }
                    }
                });


            }else{
                send_portfolio(obj);
            }
        });

    /*+ Блок редактирования персональной информации +*/

    /*Блок редактирования Услуг*/
        $(document).on('click', '.btn-edit-trigger-service', function(){//скрыть
            //hideBlock('.service-block', '.service-block-edit');
            //e.preventDefault();
            $.ajax({
                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                data: {"EDIT_SERVICE":"Y"},
                type: "POST",
                success: function(html){
                    $(".service-block").replaceWith($(html));
                }
            });
        });

        $(document).on('click', '.service-block-edit.active input[type="submit"]', function(e){ // показать
            //e.preventDefault();
            //showBlock('.service-block', '.service-block-edit');
            $contener = $(this).parents(".service-block-edit.active");
            $elements = $contener.find("[data-ajax-element-id]");

            $.each( $elements , function( index, value ) {

               var service_title = $(value).find("input").val(),
               service_description = $(value).find("textarea").val(),
               element_id = $(value).data("ajax-element-id"),
               sumbit_action = "submitted";

               var action_type = "";

               if($(value).data("new-element") == "Y"){
                   action_type = "create_service";
               }else{
                   action_type = "update_service";
               }

               if(action_type == "update_service") {
                   var data = {
                       "service_title": service_title,
                       "service_description": service_description,
                       "action_type": action_type,
                       "element_id": element_id,
                       "element_name": service_title,
                       "submit_action": sumbit_action
                   };
               }
               if(action_type == "create_service"){
                   var data = {
                       "service_title": service_title,
                       "service_description": service_description,
                       "action_type": action_type
                   };
               }

               var is_last_item = (index == ($elements.length - 1));
               $.ajax({
                    url: 'ajax.php',
                    data: data,
                    type: "POST",
                    success: function(html){
                        if(is_last_item) {
                            $.ajax({
                                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                                data: {"SHOW_SERVICE": "Y"},
                                type: "POST",
                                success: function (html) {
                                    $(".service-block-edit.active").replaceWith($(html));
                                }
                            });
                        }
                    }
                });
            });

        });

        $(document).on('click', '.service-block-edit.active button.delete', function(e){
            $element = $(this).parents("[data-ajax-element-id]");
            $contener = $(this).parents(".service-block-edit.active");

            var service_title = $element.find("input").val(),
                service_description = $element.find("textarea").val(),
                element_id = $element.data("ajax-element-id"),
                sumbit_action = "submitted";

            if($element.data("new-element") == "Y") {
                $element.remove();
                $elements = $contener.find("[data-ajax-element-id]");
                if($elements.length){
                    if($contener.find("input[type=submit]").length == 0) {
                        $elements.last().find(".btn-wrapper").append('<input type="submit" value="Сохранить">');
                    }
                }
            }else{
                    $.confirm({
                        title: 'Действительно хотите удалить услугу ' + service_title + ' ?',
                        content: '',
                        buttons: {
                            confirm: {
                                text: 'Да',
                                action: function () {
                                    var action_type = "delete_service";

                                    var data = {
                                        "service_title": service_title,
                                        "service_description": service_description,
                                        "action_type": action_type,
                                        "element_id": element_id,
                                        "element_name": service_title,
                                        "submit_action": sumbit_action
                                    };

                                    $.ajax({
                                        url: 'ajax.php',
                                        data: data,
                                        type: "POST",
                                        success: function(html){
                                            $.alert("Услуга " + service_title + " была удалена!");
                                            $element.remove();
                                            $elements = $contener.find("[data-ajax-element-id]");
                                            if($elements.length){
                                                if($contener.find("input[type=submit]").length == 0) {
                                                    $elements.last().find(".btn-wrapper").append('<input type="submit" value="Сохранить">');
                                                }
                                            }
                                        }
                                    });
                                },
                            },
                            cancel: {
                                text: 'Нет',
                                btnClass: 'btn-yes'
                            }
                        }
                    });
            }
        });

        $(document).on('click', '.btn-service-trigger', function(e){ //добавить
            $contener = $(this).parents(".service-block-edit.active");
            $elements = $contener.find("[data-ajax-element-id]");
            $.ajax({
                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                data: {"ADD_SERVICES":"Y", "ELEMENT":$elements.length},
                type: "POST",
                success: function(html){
                    $('.service-block__wrapper').prepend(html);
                }
            });
        });
    /*Блок редактирования Услуг*/

    /*Блок редактирования Семьи*/
        $(document).on('click', '.btn-edit-trigger-family', function(){
            //hideBlock('.family-block-wrapper', '.family-block-edit');
            $.ajax({
                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                data: {"EDIT_FAM":"Y"},
                type: "POST",
                success: function(html){
                    $(".family-block-wrapper").replaceWith($(html));
                    initDate();
                }
            });
        });

        $(document).on('click', '.family-block-edit.active input[type="submit"]:not(.add-family-btn)', function(e){
            $contener = $(this).parents(".family-block-edit.active");
            $elements = $contener.find("[data-ajax-element-id]");

            $.each( $elements , function( index, value ) {
                var data = new FormData();
                var action_type = "";

                action_type = ($(value).data("new-element") == "Y") ? "create_family" : "update_family";

                var name = $(value).find("[name=FAMILY_NAME]").val(),
                lastname = $(value).find("[name=FAMILY_LASTNAME]").val(),
                secname = $(value).find("[name=FAMILY_SECNAME]").val();

                data.set('FAMILY_DATE_YEAR'   , $(value).find("[name=FAMILY_DATE_YEAR]").val());
                data.set('FAMILY_DATE_MONTH'  , $(value).find("[name=FAMILY_DATE_MONTH]").val());
                data.set('FAMILY_DATE_DAY'    , $(value).find("[name=FAMILY_DATE_DAY]").val());
                data.set('action_type'        , action_type);
                data.set('file'               , $(value).find("[type=file]").prop('files')[0]);

                if(action_type == "create_family") {
                    data.set('family_name'        , name);
                    data.set('family_lastname'    , lastname);
                    data.set('family_secname'     , secname);
                    data.set('family_relation'    , $(value).find("[name=FAMILY_RELATION]").val());
                    data.set('family_servname'    , $(value).find("[name=FAMILY_SERVNAME]").val());
                    data.set('family_servdesc'    , $(value).find("[name=FAMILY_SERVDESC]").val());
                    data.set('file'               , $(value).find("[type=file]").prop('files')[0]);
                }
                if(action_type == "update_family"){
                    data.set('FAMILY_NAME'        , name);
                    data.set('FAMILY_LASTNAME'    , lastname);
                    data.set('FAMILY_SECNAME'     , secname);
                    data.set('FAMILY_RELATION'    , $(value).find("[name=FAMILY_RELATION]").val());
                    data.set('FAMILY_SERVNAME'    , $(value).find("[name=FAMILY_SERVNAME]").val());
                    data.set('FAMILY_SERVDESC'    , $(value).find("[name=FAMILY_SERVDESC]").val());
                    data.set('element_id'         , $(value).data("ajax-element-id"));
                    data.set('element_name'       , lastname + " " + name + " " + secname);
                    data.set('submit_action'      , "submitted");
                }

                var is_last_item = (index == ($elements.length - 1));

                $.ajax({
                    url: 'ajax.php',
                    data: data,
                    contentType: false,
                    processData: false,
                    cache: false,
                    type: "POST",
                    success: function(html){
                        if(is_last_item){
                            $.ajax({
                                url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
                                data: {"SHOW_FAM":"Y"},
                                type: "POST",
                                success: function(html){
                                    $(".family-block-edit.active").replaceWith($(html));
                                }
                            });
                        }
                    }
                });

            });
        });

    $(document).on('click', '.family-block-edit.active button.delete', function(e){

        $element = $(this).parents("[data-ajax-element-id]");
        $contener = $(this).parents(".family-block-edit.active");

        var name = $element.find("[name=FAMILY_NAME]").val(),
            lastname = $element.find("[name=FAMILY_LASTNAME]").val(),
            secname = $element.find("[name=FAMILY_SECNAME]").val();

        if($element.data("new-element") == "Y") {
            $element.remove();

            $elements = $contener.find("[data-ajax-element-id]");
            if($elements.length){
                if($contener.find("input[type=submit]:not(.add-family-btn)").length == 0) {
                    $elements.last().find(".btn-wrapper").append('<input type="submit" value="Сохранить">');
                }
            }
        }else{
            $.confirm({
                title: 'Действительно ли вы хотите удалить члена семьи ' + name + ' ' + lastname + ' ' + secname + ' ?',
                content: '',
                buttons: {
                    confirm: {
                        text: 'Да',
                        action: function () {

                            var action_type = "delete_family";
                            var data = {
                                "family_name": name,
                                "family_lastname": lastname,
                                "family_secname": secname,
                                "FAMILY_DATE_YEAR": $element.find("[name=FAMILY_DATE_YEAR]").val(),
                                "FAMILY_DATE_MONTH": $element.find("[name=FAMILY_DATE_MONTH]").val(),
                                "FAMILY_DATE_DAY": $element.find("[name=FAMILY_DATE_DAY]").val(),
                                "element_id": $element.data("ajax-element-id"),
                                "element_name": lastname + " " + name + " " + secname,
                                "family_relation": $element.find("[name=FAMILY_RELATION]").val(),
                                "family_servname": $element.find("[name=FAMILY_SERVNAME]").val(),
                                "family_servdesc": $element.find("[name=FAMILY_SERVDESC]").val(),
                                "action_type": action_type,
                                "submit_action": "submitted",
                            };
                            $.ajax({
                                url: 'ajax.php',
                                data: data,
                                type: "POST",
                                success: function (html) {
                                    $.alert("Член семьи " + name + " " + lastname + " " + secname + " был удален!");
                                    $element.remove();
                                    $elements = $contener.find("[data-ajax-element-id]");
                                    if($elements.length){
                                        if($contener.find("input[type=submit]:not(.add-family-btn)").length == 0) {
                                            $elements.last().find(".btn-wrapper").append('<input type="submit" value="Сохранить">');
                                        }
                                    }
                                }
                            });
                        },
                    },
                    cancel: {
                        text: 'Нет',
                        btnClass: 'btn-yes'
                    }
                }
            });
        }
    });

    $(document).on('click', '.add-family-btn', function(e){//добавить
        $contener = $(this).parents(".family-block-edit.active");
        $elements = $contener.find("[data-ajax-element-id]");
        $.ajax({
            url: 'bitrix/components/rastudio/main.profile/templates/profile_new_3/ajax.php',
            data: {"ADD_FAMILY":"Y", "ELEMENT":$elements.length},
            type: "POST",
            success: function(html){
                $('.family-block__wrapper-member').prepend(html);
                initDate();
            }
        });
    })
    /*Блок редактирования Семьи*/

});

