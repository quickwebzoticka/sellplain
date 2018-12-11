$(document).ready(function() {

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
});