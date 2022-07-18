var slideshows = document.querySelectorAll('[data-component="slideshow"]');

// Apply to all slideshows that you define with the markup wrote
slideshows.forEach(initSlideShow);

function initSlideShow(slideshow) {

    var slides = document.querySelectorAll(`#${slideshow.id} [role="list"] .slide`); // Get an array of slides

    var index = 0, time = 5000;
    slides[index].classList.add('active');  

    function timeout() {
        setTimeout(function () {

            slides[index].classList.remove('active');
          
            index++;
            if (index == 0) time = 5000;
            if (index == 1) time = 500;
            if (index == 4) time = 1000;
            if (index == 5) time = 5000;
            if (index == 6) time = 5000;
            if (index == 7) time = 3000;
            if (index == 8) time = 500;
            if (index == 8) time = 5000;
            if (index == 9) time = 10000;
            if (index == 10) time = 5000;
            if (index == 11) time = 1000;
            if (index == 13) time = 100000;

            if (index === slides.length) index = 0; 

            slides[index].classList.add('active');
            timeout();
        }, time);
    };
    timeout();

    //setInterval( () => {
    //    slides[index].classList.remove('active');
      
    //    //Go over each slide incrementing the index
    //    index++;
    //    if (index == 0){ time = 5000; }
    //    else { time = 500; }

    //    // If you go over all slides, restart the index to show the first slide and start again
    //    if (index === slides.length) index = 0; 

    //    slides[index].classList.add('active');

    //}, time);
}
