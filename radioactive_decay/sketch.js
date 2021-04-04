let l1_slider;
let l2_slider;
let run_button;
let graph_select;
let graph_linlog;

let l1 = 0;
let l2 = 0;
let pl1 = l1;
let pl2 = l2;

let graph_left = 250;
let graph_margin = 50;
let graph_limit;

let running = true;
let graph   = 'N';
let linlog  = 'linear';

let N1 = [];
let N2 = [];

let N10 = 100;
let N20 = 0;

let t  = 0;
let dt = 0.01;
let scale_x = 100;
let scale_y = 1;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    l1_slider = createSlider(-10,10,0,0.01);
    l1_slider.position(30,90);

    l2_slider = createSlider(-10,10,0,0.01);
    l2_slider.position(30,140);

    run_button = createButton('run');
    run_button.position(30,200);
    run_button.mousePressed(reset);

    graph_select = createSelect();
    graph_select.position(250,20);
    graph_select.option('N');
    graph_select.option('A');
    graph_select.changed(changeGraphType);

    graph_linlog = createSelect();
    graph_linlog.position(250,20);
    graph_linlog.option('linear');
    graph_linlog.option('logarithmic');
    graph_linlog.changed(changeGraphType);

    graph_limit = windowWidth - graph_margin;
}

function draw(){
    background(5);
    textSize(22); fill(255); strokeWeight(0);
    text('C₁ → C₂ → C₃', 0, 0);
    text('Parameters' ,30, 40);
    text(`λ₁ = ${l1.toExponential(4)}` ,30, 80);
    text(`λ₂ = ${l2.toExponential(4)}` ,30, 130);

    l1 = exp(l1_slider.value());
    l2 = exp(l2_slider.value());

    if (pl1 != l1 || pl2 != l2) { 
        reset();
    }
    pl1 = l1;
    pl2 = l2;

    if (running){
        for (let i = 0; i < 100; i++){
            let t_calc = t;
            if (linlog == 'logarithmic') {
                t_calc = log(t);
                N1.push(log(N1t(t_calc)));
                N2.push(log(N2t(t_calc)));
            }
            else{
                N1.push(N1t(t_calc));
                N2.push(N2t(t_calc));
            }
            t += dt;
        }
        if (graph_left + t*scale_x > graph_limit) running = false;
    }

    if (t > 100){
        running = false;
    }

    drawGraph();
}

function drawAxes(){
    stroke(255); strokeWeight(2);
    line(graph_left, graph_margin, graph_left, windowHeight - graph_margin);
    line(graph_left, windowHeight - graph_margin, windowWidth - graph_margin, windowHeight - graph_margin);
}

function drawGraph(){
    drawAxes();
    let ls   = [N1[0], N2[0], N1[N1.length - 1]];
    let n22  = N2[N2.length - 1];
    if (!isNaN(n22)) ls.push(n22);
    let mini = min(ls);
    let maxi = max(ls);
    scale_y = (windowHeight - 3*graph_margin) / (maxi-mini);
    // scale_y = (windowHeight - 3*graph_margin) / N1[0];
    stroke(255,0,60); strokeWeight(3); noFill();
    beginShape();
    for (let i in N1){
        let val = N1[i];
        if (graph == 'A') { val = N1[i] * l1; }
        let y_pos = windowHeight - graph_margin - val * scale_y + mini*scale_y;
        let x_pos = graph_left + i*dt*scale_x
        vertex(x_pos, y_pos);
        // if (x_pos > graph_limit) break;
    }
    endShape();

    stroke(0,120,255); strokeWeight(3); noFill();
    beginShape();
    for (let i in N2){
        if (linlog == 'logarithmic' && i == 0) continue;
        let val = N2[i];
        if (graph == 'A') { val = N2[i] * l2; }
        let y_pos = windowHeight - graph_margin - val * scale_y + mini*scale_y;
        let x_pos = graph_left + i*dt*scale_x
        vertex(x_pos, y_pos);
        // if (x_pos > graph_limit) break;
    }
    endShape();
}

function N1t(t){
    return N10 * exp(-l1 * t);
}

function N2t(t){
    let con = l1/(l2-l1) * N10;
    let ex  = exp(-l1 * t) - exp(-l2 * t);
    let par = con*ex;
    let dau = N20 * exp(-l2 * t);
    return par + dau;
}

function reset(){
    N1 = [N10];
    N2 = [N20];
    t = 0;
    running = true;
}

function changeGraphType(){
    graph  = graph_select.value();
    linlog = graph_linlog.value();
    reset();
}
