let gridsize = 52; 
let interval;
let sc;
let c = 100;
let dt = 0.001;
let field = []
let left_trans, up_trans;

function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);
	resizing();
	for (let i = 0; i < gridsize; i++) {
    	field[i] = []; 
	}
	for(let j = 0; j < gridsize; j++){
		for(let k = 0; k < gridsize; k++){
			let thepos = [j,k];
      // let theU = random(-1,1);
      let theU = 0;
      if(j==20 && k==20){theU = 2};
      // if(j==6 && k==7){theU = 1};
      // if(j==6 && k==5){theU = 1};
			field[j][k] = new points(thepos,theU);
		}
  	}
  background(5);
}

function draw(){	
	translate(left_trans, up_trans)
  background(0);
  debug();
    // debug();
	    for(let j = 1; j < gridsize-1; j++){
			for(let k = 1; k < gridsize-1; k++){
				field[j][k].show();
				field[j][k].calculate();
			}
	  	}
	  	for(let j = 1; j < gridsize-1; j++){
			for(let k = 1; k < gridsize-1; k++){
				field[j][k].update();
			}
	  	}
}

//ssuming E only x axis
class points{

  constructor(pos, U){
    this.pos = pos; this.U = U;
    this.Ux  = 0, this.Uy  = 0, this.Ut  = 0;
    this.Uxx = 0, this.Uyy = 0, this.Utt = 0;
  }
  
  update(){
    this.Ut += this.Utt*dt;
    this.U  += this.Ut*dt;
  }
  
  show(){
    noStroke();
    if(this.U>=0){ fill(200,50,5); }
    else         { fill(255,255,255);}
    circle(this.pos[0]*interval, this.pos[1]*interval, sc*this.U);
    circle(this.pos[0]*interval, this.pos[1]*interval, 1);
  }

  calculate(){
    let x = this.pos[0], y = this.pos[1];
    this.Ux  = (field[x+1][y].U - field[x-1][y].U)/2;
    this.Uxx = (field[x+1][y].Ux - field[x-1][y].Ux)/2;

    this.Uy  = (field[x][y+1].U - field[x][y-1].U)/2;
    this.Uyy = (field[x][y+1].Uy - field[x][y-1].Uy)/2;

    this.Utt = c*c*(this.Uxx+this.Uyy);
  }
  
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	resizing();
}

function resizing(){
	interval = min(windowWidth,windowHeight)/(gridsize+1-2);
 	left_trans = max((windowWidth  - interval*(gridsize-1))/2 , 0);
	up_trans   = max((windowHeight - interval*(gridsize-1))/2 , 0);
	sc = interval;
	// scE = interval*1.2;
	// print(interval);
}

function debug(){
  let E = 0;
  for(let j = 1; j < gridsize-1; j++){
      for(let k = 1; k < gridsize-1; k++){
        E += pow(field[j][k].U,2);
  }
  }
  fill(255); noStroke();
  text(E,100,200);
}