(function () {
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
    var math = null, box = null;    // the element jax for the math output, and the box it's in
    var HIDEBOX = function () {box.style.visibility = "hidden"}
    var SHOWBOX = function () {box.style.visibility = "visible"}

    MathJax.Hub.Config({
	messageStyle: 'none',
	tex2jax: {preview: 'none'}
    });

    QUEUE.Push(function () {
	math = MathJax.Hub.getAllJax("output")[0];
	box = document.getElementById("container");
	SHOWBOX(); // box is initially hidden so the braces don't show
    });
    window.UpdateMath = function (TeX) {
	QUEUE.Push(
	    HIDEBOX,
	    ["resetEquationNumbers",MathJax.InputJax.TeX],
	    ["Text",math,"\\displaystyle{"+TeX+"}"],
	    SHOWBOX
	);
    }
})();



document.addEventListener('DOMContentLoaded', function() {

    // var scale = 'scale(1.5)';
    // document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
    // document.body.style.msTransform =   scale;       // IE 9
    // document.body.style.transform = scale;   
    document.body.style.zoom = 1.5

    var typingTimer; 		//timer identifier
    var typingInterval = 400; 	//time in ms
    var input = document.getElementById("input");

    function doneTyping(){
	UpdateMath(input.value);
    }

    input.addEventListener("keyup", function(event) {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, typingInterval);
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
	    event.preventDefault();
	    UpdateMath(input.value);
	}
    });
}, false);
