/*ꦮꦺꦴꦤ꧀ꦠꦼꦤ꧀ꦲ꧈ꦤꦶꦏꦸꦮꦶꦭꦔꦤ꧀꧉

ꦠꦸꦭꦶꦱꦤ꧀

 * main.js
 * Copyright (C) 2021 ray <rayhan.azizi9@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */
import { aksara_convert } from './jawa/convert.js'

document.addEventListener('DOMContentLoaded', function() {
    var input  = document.getElementById("input");
    input.addEventListener("keyup", function(event){
    	var position = input.selectionStart;
    	var l0 = input.value.length;
    	// input.value = aksara_convert(input.value)
    	// if it's too slow, will revert back
    	var converted = aksara_convert(input.value);
    	if (input.value != converted){
    		input.value = converted;
    		var l1 = input.value.length;
    		input.selectionEnd = position + l1 - l0;
    	}
    });


    document.getElementById('input').addEventListener('keydown', function(e) {
    	if (e.key == 'Tab') {
		    e.preventDefault();
		    var start = this.selectionStart;
		    var end = this.selectionEnd;
		    this.value = this.value.substring(0, start) +
		      "\t" + this.value.substring(end);
		    this.selectionStart =
		      this.selectionEnd = start + 1;
	  }
	});

}, false);



