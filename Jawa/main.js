/*
 * main.js
 * Copyright (C) 2021 ray <rayhan.azizi9@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */
import { aksara_convert } from './jawa/convert.js'

document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById("input");
    input.addEventListener("keyup", function(event){
        input.value = aksara_convert(input.value);
        // console.log("asdads");
    });
}, false);
