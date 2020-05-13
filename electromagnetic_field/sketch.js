let m0 = 0.5;
let e0 = 1;
let gridsize = 12; 
let interval;
let scB, scE;
let dt = 0.01;
let field = []
let magnet = true;
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
			let E  = random(-1,1);
			// let E  = 0;
			// if(k==1 && j==1){ E = 2; }
			let By = 0;
			let Bz = 0;
			field[j][k] = new points(thepos,E,By,Bz);
		}
  	}
  background(5);
}

function draw(){	
	translate(left_trans, up_trans)
    background(0);
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

	// pos = []
  constructor(pos, E, By, Bz){
    this.pos = pos; this.E = E; this.By = By; this.Bz = Bz;
    this.dE = 0, this.dBy = 0, this.dBz = 0;
    this.is_edge = (this.pos[0]==0 || this.pos[1]==0 || this.pos[0]==gridsize-1 || this.pos[1]==gridsize-1);
    if(this.is_edge){
      this.setzero();
    }
  }
  
  calculate(){
    this.maxwell3(); this.maxwell4(); 
  }
  
  update(){
      this.E += this.dE;
      this.By += this.dBy;
      this.Bz += this.dBz;
  }

  setzero(){
    this.E = 0; this.By = 0; this.Bz = 0;
  }
  
  show(){
    let tY = this.pos[0]; let tZ = this.pos[1]

    if(this.E>=0){ noStroke(); fill(200,50,5)   ; circle(tY*interval, tZ*interval, scE*this.E); }
    else    { noStroke(); fill(255,255,255); circle(tY*interval, tZ*interval, scE*this.E); }
    if(magnet){noFill(); strokeWeight(2); stroke(10,10,200); line(tY*interval, tZ*interval, tY*interval + scB*this.By, tZ*interval + scB*this.Bz);}
  }
  
  maxwell3(){
    let DyE = (field[this.pos[0]+1][this.pos[1]].E - field[this.pos[0]-1][this.pos[1]].E)/2;
    let DzE = (field[this.pos[0]][this.pos[1]+1].E - field[this.pos[0]][this.pos[1]-1].E)/2;
    this.dBy = -dt*(DzE);
    this.dBz =  dt*(DyE);
  }
  
  maxwell4(){
    let DyBz = (field[this.pos[0]+1][this.pos[1]].Bz - field[this.pos[0]-1][this.pos[1]].Bz)/2;
    let DzBy = (field[this.pos[0]][this.pos[1]+1].By - field[this.pos[0]][this.pos[1]-1].By)/2; 
    this.dE = dt/m0/e0*(DyBz - DzBy);
  }
  
}

function mouseClicked() {
	magnet = !magnet;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	resizing();
}

function resizing(){
	interval = min(windowWidth,windowHeight)/(gridsize+1-2);
 	left_trans = max((windowWidth  - interval*(gridsize-1))/2 , 0);
	up_trans   = max((windowHeight - interval*(gridsize-1))/2 , 0);
	scB = interval;
	scE = interval*1.2;
	// print(interval);
}

function debug(){
	let EE = 0;
	let EB = 0;
	let E0 = 0;
	for(let j = 0; j < gridsize; j++){
		for(let k = 0; k < gridsize; k++){
			EE += (field[j][k].E)*(field[j][k].E)/m0/m0	;
			EB += (field[j][k].By)*(field[j][k].By)+(field[j][k].Bz)*(field[j][k].Bz);
			E0 += sqrt((field[j][k].E)*(field[j][k].E)/m0/m0 + (field[j][k].By)*(field[j][k].By)+(field[j][k].Bz)*(field[j][k].Bz))
		}
  	}
  	noStroke();
  	fill(255);
  	text(nf(EE,3,2),-100,10);
  	text(nf(EB,3,2),-100,20);
  	text(nf(EE+EB,3,2),-100,35);
  	text(nf(E0,3,2),-100,50	);
}
