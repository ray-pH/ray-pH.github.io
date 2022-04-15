let img
const wp_poss = [[-77.9, -17.59, 0.2],
            [-52.68, -0.91, 0.0],
            [-1.77, -23.78, 0.0],
            [79.56, -7.79, 0.0],
            [230.90, -40.58, 0.0],
            [189.83, -58.67, 0.0],
            [161.58, -111.42, 0.0],
            [17.10, -130.70, 0.0],
            [-9.35, -168.07, 0.0],
            [-44.25, -193.47, 0.0],
            [-145.75, -75.70, 0.0],
            [-145.47, -7.79, 0.0],
            [-104.58, -0.5, 0.0],
            [-77.86, 16.80, 0.0],
            [-15.45, 194.16, 0.0],
            [-4.32, 110.51, 0.0]]      
var poss = [[-77.9, -17.59, 0.2],
            [-52.68, -0.91, 0.0],
            [-1.77, -23.78, 0.0],
            [79.56, -7.79, 0.0],
            [230.90, -40.58, 0.0],
            [189.83, -58.67, 0.0],
            [161.58, -111.42, 0.0],
            [17.10, -130.70, 0.0],
            [-9.35, -168.07, 0.0],
            [-44.25, -193.47, 0.0],
            [-145.75, -75.70, 0.0],
            [-145.47, -7.79, 0.0],
            [-104.58, -0.5, 0.0],
            [-77.86, 16.80, 0.0],
            [-15.45, 194.16, 0.0],
            [-4.32, 110.51, 0.0]]      
let active = 0

var locked = true
var img_scale = 2.5

function preload() {
    img = loadImage('./Town03.jpg');
}

function setup(){
    var canvas = createCanvas(img.width * img_scale, img.height * img_scale);
    frameRate(60);
    canvas.parent('sketch-holder');
}

function load_str(str){
    try {
        var el = JSON.parse(str);
        poss = el;
    } catch(e) {
        window.alert("load error\n" + e);
        console.log(e);
    }
}

function mapx(x){ return map(x, -77.90, 230.90, 318 * img_scale/2, 1194 * img_scale/2); }
function mapy(y){ return map(y, -17.59, -40.58, 700 * img_scale/2, 766 * img_scale/2); }
function unmapx(x){ return map(x, 318 * img_scale/2, 1194 * img_scale/2, -77.90, 230.90); }
function unmapy(y){ return map(y, 700 * img_scale/2, 766 * img_scale/2, -17.59, -40.58); }

function draw(){
    image(img, 0, 0, img.width * img_scale, img.height * img_scale);

    for (var i in wp_poss){
        let pos = wp_poss[i]
        x = mapx(pos[0]);
        y = mapy(pos[1]);
        stroke(color(0,0,255));
        fill(color(0,0,255,100));
        strokeWeight(2);
        circle(x,y,20);
    }

    for (var i = 0; i < poss.length - 1; i++){
        let pos0 = poss[i]
        let pos1 = poss[i+1]

        x0 = mapx(pos0[0]);
        y0 = mapy(pos0[1]);

        x1 = mapx(pos1[0]);
        y1 = mapy(pos1[1]);

        stroke(color(255,255,255));
        strokeWeight(2);
        line(x0, y0, x1, y1);

        if (active == i){
            fill(color(10,255,5));
        }
        circle(x0,y0,10);
        fill(color(255,255,255));
    }
}

function keyPressed(){
    if (key == ']') active = ((active+1) + poss.length) % poss.length ;
    if (key == '[') active = ((active-1) + poss.length) % poss.length ;

    xx = unmapx(mouseX);
    yy = unmapy(mouseY);
    if (key == 'n') {
        poss.splice(active+1, 0, [xx, yy, 0.0]);
        active += 1;
    }
    if (key == 'm') {
        poss.splice(active, 1, [xx, yy, 0.0]);
        // active += 1;
    }
    if (key == 'd') {
        poss.splice(active, 1);
        active -= 1;
    }
    if (key == 'p') {
        var j = JSON.stringify(poss);
        console.log(j);
    }
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function download_path(){
    var text = JSON.stringify(poss);
    download('path.txt', text);
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        load_str(contents)
    };
    reader.readAsText(file);
}

function mouseClicked(){
    console.log([mouseX, mouseY], [unmapx(mouseX), unmapy(mouseY)]);
}
