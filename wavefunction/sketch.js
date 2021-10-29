let refx, refy;
let realWave, imagWave, poteWave, probWave;
let mode = 'R';
let run  = false;

let hbar = 1;
let m    = 1;
let dt   = 0.1;
let potScale = 0.001;
let hScale = 1;

let realButton, imagButton, poteButton, normalButton, resetButton, runButton;

let cWhite = '#ffffffee';
let cRed   = '#ea2a64ee';
let cBlue  = '#0f6ce9ee';
let cGreen = '#3be999ee';
let cYell  = '#f7f138ee';

function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);
    initButton();

    refx = 100;
    refy = windowHeight - 200;

    let N = 150;
    realWave = new LineElement(refx, refy, windowWidth, N, cBlue);
    imagWave = new LineElement(refx, refy, windowWidth, N, cRed);
    probWave = new LineElement(refx, refy, windowWidth, N, cWhite);
    poteWave = new LineElement(refx, refy, windowWidth, N, cGreen);
}

function draw(){
    background(0);
    stroke(255);
    strokeWeight(1);
    line(refx, 0, refx, windowHeight);
    line(refx, refy, windowWidth, refy);
    circle(mouseX, mouseY, 10);

    poteWave.displayPoint();
    poteWave.displayLine();
    realWave.displayPoint();
    realWave.displayLine();
    imagWave.displayPoint();
    imagWave.displayLine();
    probWave.displayPoint();
    probWave.displayLine();

    if(run){
        for (let i = 0; i < 100; i++)
            evolve(realWave, imagWave, poteWave);
    }
}

function setReal(){ mode = 'R'; }
function setImag(){ mode = 'I'; }
function setPote(){ mode = 'P'; }
function doNormalize(){ normalize(realWave, imagWave, probWave); }
function toggleRun(){   run = !run; }

function initButton(){
    realButton = createButton('Real');
    realButton.position(10, 18).size(80,20);
    realButton.mousePressed(setReal);

    imagButton = createButton('Imag');
    imagButton.position(10, 48).size(80,20);
    imagButton.mousePressed(setImag);

    poteButton = createButton('Pote');
    poteButton.position(10, 78).size(80,20);
    poteButton.mousePressed(setPote);

    normalButton = createButton('Normal');
    normalButton.position(10, 108).size(80,20);
    normalButton.mousePressed(doNormalize);

    runButton = createButton('run');
    runButton.position(10, 138).size(80,20);
    runButton.mousePressed(toggleRun);
}

function edit(mod, px, py, rx){
    let obj;
    if      (mod == 'R') obj = realWave;
    else if (mod == 'I') obj = imagWave;
    else if (mod == 'P') obj = poteWave;
    let id = round((px - rx)/obj.h);
    obj.update(id, (refy - py)/100);
}

function mouseDragged(){
    edit(mode, mouseX, mouseY, refx);
}

function integrateProb(lProb){
    let area = 0;
    let N = lProb.N;
    for (let i = 0; i < N-1; i++){
        area += (lProb.ys[i] + lProb.ys[i+1])
    }
    return area*lProb.h/100/2
}

function updateProb(lRe, lIm, lProb){
    let N = lProb.N;
    for (let i = 0; i < N; i++){
        let re = lRe.ys[i];
        let im = lIm.ys[i];
        let prob = re*re + im*im;
        lProb.ys[i] = prob;
    }
}

function normalize(lRe, lIm, lProb){
    updateProb(realWave, imagWave, probWave);
    let factor = sqrt(integrateProb(lProb));
    lRe.normalize(factor);
    lIm.normalize(factor);
    updateProb(realWave, imagWave, probWave);
}

function evolve(lRe, lIm, lpot){
    let N = lRe.N;
    let dRe = [];
    let dIm = [];
    // for (let i = 0; i < N; i++){
    for (let i = 1; i < N-1; i++){
        dIm[i] =   hbar/2/m*lRe.D2(i) - lpot.ys[i]*potScale*lRe.ys[i]/hbar;
        dRe[i] = - hbar/2/m*lIm.D2(i) + lpot.ys[i]*potScale*lIm.ys[i]/hbar;
    }
    // for (let i = 0; i < N; i++){
    for (let i = 1; i < N-1; i++){
        lRe.ys[i] += dRe[i]*dt;
        lIm.ys[i] += dIm[i]*dt;
    }
    doNormalize();
}

class LineElement {

    constructor(x0,y0,xm,N,col){
        this.x0 = x0;
        this.y0 = y0;
        this.xm = xm;
        // this.ym = ym;
        this.N  = N;

        this.xs = [];
        this.ys = [];
        this.h  = -1;
        this.pointR = 5;

        this.c = color(col);
        this.initxy();
    }

    D2(i){
        let h = this.h * hScale;
        if (i == 0 ) return (this.ys[i+2] - 2*this.ys[i+1] + this.ys[i])/h/h;
        if (i == this.N-1 ) return (this.ys[i-2] - 2*this.ys[i-1] + this.ys[i])/h/h;
        return (this.ys[i+1] - 2*this.ys[i] + this.ys[i-1])/h/h;
    }

    initxy(){
        // this.h = (this.xm - this.x0)/(this.N-1);
        this.h = (this.xm - this.x0)/(this.N-1);
        for (let i = 0; i < this.N; i++){
            this.xs[i] = this.h*i;
            this.ys[i] = 0;
        }
    }

    update(id, yval){
        this.ys[id] = yval;
    }

    normalize(factor){
        for (let i = 0; i < this.N; i++){
            this.ys[i] /= factor;
        }
    }

    displayPoint(){
        noStroke();
        fill(this.c);
        for (let i = 0; i < this.N; i++){
            circle(this.x0 + this.xs[i], this.y0 - this.ys[i]*100, this.pointR);
            // text(this.D2(i), this.x0 + this.xs[i], this.y0 - this.ys[i]*100);
        }
    }

    displayLine(){
        noFill();
        stroke(this.c);
        strokeWeight(2);
        beginShape();
        for (let i = 0; i < this.N; i++){
            vertex(this.x0 + this.xs[i], this.y0 - this.ys[i]*100);
        }
        endShape();
    }

}
