/*
 * convert.js
 * Copyright (C) 2021 <rayhan.azizi9@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

// -------------------------------- array of aksara -------

const aksara = [
    ["h", "ꦲ"],
    ["n", "ꦤ"],
    ["c", "ꦕ"],
    ["r", "ꦫ"],
    ["k", "ꦏ"],
    ["d", "ꦢ"],
    ["t", "ꦠ"],
    ["s", "ꦱ"],
    ["w", "ꦮ"],
    ["l", "ꦭ"],
    ["p", "ꦥ"],
    ["dh", "ꦝ"],
    ["j", "ꦗ"],
    ["y", "ꦪ"],
    ["ny", "ꦚ"],
    ["m", "ꦩ"],
    ["g", "ꦒ"],
    ["b", "ꦧ"],
    ["th", "ꦛ"],
    ["ng", "ꦔ"],
    ["N", "ꦟ"],
    ["C", "ꦖ"],
    ["R", "ꦬ"],
    ["K", "ꦑ"],
    ["T", "ꦡ"],
    ["S", "ꦯ"],
    ["P", "ꦦ"],
    ["NY", "ꦘ"],
    ["G", "ꦒ"],
    ["B", "ꦨ"]
];

const aksara_swara = [
    ["a", "ꦄ"],
    ["i", "ꦆ"],
    ["u", "ꦈ"],
    ["'e", "ꦌ"],
    ["o", "ꦎ"]
];

const sandhangan_swara = [
    ["a", ""],
    ["i", "ꦶ"],
    ["u", "ꦸ"],
    ["e", "ꦼ"],
    ["'e", "ꦺ"],
    ["o", "ꦺꦴ"]
];

const sandhangan_panyigeging_wanda = [
    ["ng", "ꦁ", "ꦔ"],
    ["r", "ꦂ", "ꦫ"],
    ["h", "ꦃ", "ꦲ"]
];

const sandhangan_pangkon = "꧀";

const pada = [
    [",", "꧈"],
    ["\\.", "꧉"],
    ["\"", "꧊"],
    [":", "꧇"],
    ["\\\[", "꧌"],
    ["\\\]", "꧍"]
];

const angka = [
    ["0", "꧐"],
    ["1", "꧑"],
    ["2", "꧒"],
    ["3", "꧓"],
    ["4", "꧔"],
    ["5", "꧕"],
    ["6", "꧖"],
    ["7", "꧗"],
    ["8", "꧘"],
    ["9", "꧙"]
]


// -------------------------------- regex prepare --------

var aksara_regex = [];

//sandhangan cancel out
for (var i in sandhangan_swara){
    var sl = sandhangan_swara[i];
    var re = new RegExp(sandhangan_pangkon.concat(sl[0]), "g");
    aksara_regex.push( [ re, sl[1]]);
}
//sandhangan panyigeging wanda also cancel out
for (var i in sandhangan_swara){
    var sl = sandhangan_swara[i];
    for (var j in sandhangan_panyigeging_wanda){
        spw = sandhangan_panyigeging_wanda[j];
        var re = new RegExp(spw[1].concat(sl[0]), "g");
        aksara_regex.push( [ re, spw[2].concat(sl[1]) ]);
    }
}
//generate regex for the rest of aksara
for (var i in aksara){
    var al = aksara[i];
    var re = new RegExp(al[0],"g");
    var str = al[1].concat(sandhangan_pangkon);

    // accounting sandhangan panyigeging wanda
    for (var j in sandhangan_panyigeging_wanda){
        var spw = sandhangan_panyigeging_wanda[j];
        if (al[0] == spw[0]){ str = spw[1]; }
    }

    aksara_regex.push([ re, str ]);
}

for (var i in pada){  var pd = pada[i];
    aksara_regex.push([ RegExp(pd[0],"g") , pd[1] ]);
}

for (var i in angka){ var ag = angka[i];
    aksara_regex.push([ RegExp(ag[0],"g") , ag[1] ]);
}

// --for bug--
//before checking volew check swara for calcel out again
for (var i in sandhangan_swara){
    var sl = sandhangan_swara[i];
    var re = new RegExp(sandhangan_pangkon.concat(sl[0]), "g");
    aksara_regex.push( [ re, sl[1]]);
}
//checking open vowel is done last
for (var i in aksara_swara){
    var as = aksara_swara[i];
    var re = new RegExp(as[0],"g");
    aksara_regex.push([ re, as[1] ]);
}


// ---------------------------- special case ------------

//special case
var special_case_regex = [
    [/ꦢ꧀ꦲ꧀/g, "ꦝ꧀"], //dh
    [/ꦢ꧀ꦃ/g,  "ꦝ꧀"], //dh
    [/ꦤ꧀ꦪ꧀/g, "ꦚ꧀"], //ny
    [/ꦤ꧀ꦪ꧀/g, "ꦚ꧀"], //ny
    [/ꦟ꧀Y/g, "ꦘ"], //NY
    [/ꦠ꧀ꦃ/g,  "ꦛ꧀"], //th
    [/ꦤ꧀ꦒ꧀/g,  "ꦁ"],  //ng
    [/ꦤ꧀ꦒ/g, "ꦔ"], //nga
    [/꧀ꦫ/g,   "ꦿ"],  //cakra
    [/ꦿꦼ/g,     "ꦽ"],  //keret
    [/꧀ꦫꦪ/g,"ꦾ"], //pengkal
    [/ꦫꦼ/g,    "ꦉ"], //pa cerek
    [/ꦭꦼ/g,    "ꦊ"]
];


for (var i in sandhangan_panyigeging_wanda){
    var spw = sandhangan_panyigeging_wanda[i];
    for (var j in aksara_swara){
        var as = aksara_swara[j];
        var re = new RegExp( spw[1].concat(as[1])  ,"g");
        var str = "";
        for (var k in sandhangan_swara){
            var ss = sandhangan_swara[k];
            if(ss[0] == as[0]){ str = spw[2].concat(ss[1]); }
        }
        special_case_regex.push([re,str]);
    }
}


// var angka_to_number_regex = [];
// for (var i in angka){
//     var a = angka[i];
//     var re = new RegExp( a[1], "g" );
//     angka_to_number_regex.push([re,a[1]]);
// }


// ------------------------------- conversion function ------

function aksara_convert(input){
    var res = input;
    for (var i in aksara_regex){
        var pair = aksara_regex[i];
        res = res.replace(pair[0],pair[1]);
    }
    for (var i in special_case_regex){
        var pair = special_case_regex[i];
        res = res.replace(pair[0],pair[1]);
    }
    return res;
}

// function angka_to_number(input){
//     var res = input;
//     for (var i in angka_to_number_regex){
//         var pair = angka_to_number_regex[i];
//         res = res.replace(pair[0],pair[1]);
//     }
//     return res;
// }

export { aksara_convert };
