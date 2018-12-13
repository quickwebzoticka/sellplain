$(document).ready(function() {

		AOS.init({
			once: true
		});

		function resizeImg() {
			let width = $(window).width();
			console.log(width);
			let a = $('.header-img img'),
				b = $('.map-img img');
			if (width <= 1024) {
				b.attr('src', 'img/map-mob.svg');
				a.attr('src', 'img/header-img-mob.svg');
			} else {
				b.attr('src', 'img/map.svg');
				a.attr('src', 'img/header-img.svg');
			}
		};

		resizeImg();

		$(window).resize(function(){
			resizeImg();
		});

		$(document).on('click', '.language-name', function(e){
			e.preventDefault();
			$(this).toggleClass('active');
			$(this).find('.language-list').slideToggle(700);
		});

		$(document).on('click', '.nav-block__burger', function(){
			$(this).toggleClass('active');
			$(this).siblings('.nav-block').slideToggle(300);
		});

		$(document).on('click', '.language-list__item', function(){
			let a = $(this).html();

			$(this).closest('.language-name').find('span').html(a);
			a = a.split('',2).join('');
			$(this).closest('.language-name').siblings('.language').html(a);
		});
		$(document).on('keyup', '.modal-block__input', function() {
		  let a = $(this);
		  if ($(this).val().length > 0) {
		    $(this).siblings('.modal-block__placeholder').addClass('active');
		  } else {
		    $(this).siblings('.modal-block__placeholder').removeClass('active');
		  };
		});
		$(document).on('click', '.modal-block_flexbox', function(event) {
		  event.preventDefault();
		  $(this).children('.modal-block__checkbox-avatar').toggleClass('active');
		  if ($(this).children('.modal-block__checkbox').is(':checked')) {
		    $(this).children('.modal-block__checkbox').prop('checked', false);
		  } else {
		    $(this).children('.modal-block__checkbox').prop('checked', true);
		  }
		});

		$(document).on('keyup', '.modal-block__input', function() {
			let counter = 0;

			$('.modal-block__input').each(function(){
				if (!($(this).val() == '')) {
					counter++;
				}
			});

			if ($(this).index('.modal-block__input') >= 2 && $(this).val().length >= 6) {
				counter++;
			}

			if (counter == 5) {
				$('.main-btn.main-btn_wide.disabled').removeClass('disabled').prop('disabled', false);
			} else {
				$('.main-btn.main-btn_wide').addClass('disabled').prop('disabled', true);
			};
		});
});