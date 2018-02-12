$(window).scroll(function() {
  var scroll = $(window).scrollTop();

  $(".parallax.faster").css("transform","translateY(" +  (scroll/3)  + "px)");
  $(".parallax.slower").css("transform","translateY(" +  (scroll/2.5)  + "px)");
  $(".parallax.medium").css("transform","translateY(" +  (scroll/3.8)  + "px)");
});
