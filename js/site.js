// index.js - purpose and description here
// Author: Your Name
// Date:

// make sure document is ready
$(document).ready(function() {
  console.log("Document ready.")

  // Constants

  // Functions

  // this is an example function and this comment tells what it doees and what parameters are passed to it.
  function myFunction(param1, param2) {
    // some code here
    // return results;
  }

  $('#fullscreen-button').click(function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(e);
      });
      console.log("Going fullscreen.");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
  
  $(document).on('fullscreenchange', function() {
    if (document.fullscreenElement) {
      console.log("Entered fullscreen mode");
      $('body').addClass('is-fullscreen');
    } else {
      console.log("Exited fullscreen mode");
      $('body').removeClass('is-fullscreen');
    }
  });

})
