let refx, refy;
let realWave;
let mode = 'R';

function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);
    refx = 100;
    refy = windowHeight - 200;

    realWave = new LineElement(refx, refy, windowWidth, 50);
}

function draw(){
    background(0);
    stroke(255);
    strokeWeight(1);
    line(refx, 0, refx, windowHeight);
    line(refx, refy, windowWidth, refy);
    circle(mouseX, mouseY, 10);

    realWave.displayPoint();
    realWave.displayLine();
}

function edit(mod, px, py, rx){
    let obj;
    if (mod == 'R') obj = realWave;
    let id = round((px - rx)/obj.h);
    obj.update(id, refy - py);
}

function mouseDragged(){
    edit(mode, mouseX, mouseY, refx);
}

class LineElement {


    constructor(x0,y0,xm,N){
        this.x0 = x0;
        this.y0 = y0;
        this.xm = xm;
        // this.ym = ym;
        this.N  = N;

        this.xs = [];
        this.ys = [];
        this.h  = -1;
        this.pointR = 5;

        this.initxy();
    }

    initxy(){
        this.h = (this.xm - this.x0)/(this.N-1);
        for (let i = 0; i < this.N; i++){
            this.xs[i] = this.h*i;
            this.ys[i] = 0;
        }
    }

    update(id, yval){
        this.ys[id] = yval;
    }

    displayPoint(){
        noStroke();
        fill(255);
        for (let i = 0; i < this.N; i++){
            circle(this.x0 + this.xs[i], this.y0 - this.ys[i], this.pointR);
        }
    }

    displayLine(){
        noFill();
        stroke(255);
        strokeWeight(1);
        beginShape();
        for (let i = 0; i < this.N; i++){
            vertex(this.x0 + this.xs[i], this.y0 - this.ys[i]);
        }
        endShape();
    }

}
