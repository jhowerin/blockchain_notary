(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  $('#starRegistryPage').click(function() {
    $.ajax({
      type: 'GET',
      url: '/',
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        console.log(data);
        $('#starAllBlocksResults').html(JSON.stringify(data));
      },
      error: function(data) {
        console.log(data.responseText);
        $('#starAllBlocksResults').html("<p style=\"color: red\">Unable to lookup star, see console for details</p>");
      }
    });
  });


})(jQuery); // End of use strict
