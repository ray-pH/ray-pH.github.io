let m0 = 1;
let e0 = 1;
let gridsize = 10; 
let interval = 60;
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
    	field[i] = []; // create nested array
	}
	for(let j = 0; j < gridsize; j++){
		for(let k = 0; k < gridsize; k++){
			let thepos = [j,k];
			//float E  = 0;
			let E  = random(-1,1);
			// if(k==5 && j==5){ E = 2; }
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
    for(let j = 0; j < gridsize; j++){
		for(let k = 0; k < gridsize; k++){
			field[j][k].show();
			field[j][k].calculate();
		}
  	}
  	for(let j = 0; j < gridsize; j++){
		for(let k = 0; k < gridsize; k++){
			field[j][k].update();
		}
  	}
}

//ssuming E only x axis
class points{

	// pos = []
  constructor(pos, E, By, Bz){
    this.pos = pos; this.E = E; this.By = By; this.Bz = Bz;
  }
  
  calculate(){ this.maxwell3(); this.maxwell4(); }
  
  update(){
    this.E += this.dE;
    this.By += this.dBy;
    this.Bz += this.dBz;
    this.E = constrain(this.E,-5,5);
    this.By =constrain(this.By,-20,20);
    this.Bz = constrain(this.Bz,-20,20);
  }
  
  show(){
    let tY = this.pos[0]; let tZ = this.pos[1]
    let radius = this.E*scE;
    if(this.E>=0){ noStroke(); fill(200,50,5)   ; circle(tY*interval, tZ*interval, radius); }
    else    { noStroke(); fill(255,255,255); circle(tY*interval, tZ*interval, radius); }
    if(magnet){noFill(); strokeWeight(2); stroke(10,10,200); line(tY*interval, tZ*interval, tY*interval + scB*this.By, tZ*interval + scB*this.Bz);}
  }
  
  maxwell3(){
    let DyE = 0;
    if(this.pos[0]==0){ DyE = field[this.pos[0]+1][this.pos[1]].E - this.E; }
    else if(this.pos[0]==gridsize-1){ DyE = this.E - field[this.pos[0]-1][this.pos[1]].E; }
    else { DyE = (field[this.pos[0]+1][this.pos[1]].E - field[this.pos[0]-1][this.pos[1]].E); }
    
    let DzE = 0;
    if(this.pos[1]==0){ DzE = field[this.pos[0]][this.pos[1]+1].E - this.E; }
    else if(this.pos[1]==gridsize-1){ DzE = this.E - field[this.pos[0]][this.pos[1]-1].E; }
    else { DzE = (field[this.pos[0]][this.pos[1]+1].E - field[this.pos[0]][this.pos[1]-1].E); }
    
    this.dBy = -dt*(DzE);
    this.dBz =  dt*(DyE);
  }
  
  maxwell4(){
    let DyBz = 0;
    if(this.pos[0]==0){ DyBz = field[this.pos[0]+1][this.pos[1]].Bz - this.Bz; }
    else if(this.pos[0]==gridsize-1){ DyBz = this.Bz - field[this.pos[0]-1][this.pos[1]].Bz; }
    else { DyBz = (field[this.pos[0]+1][this.pos[1]].Bz - field[this.pos[0]-1][this.pos[1]].Bz); }
    
    let DzBy = 0;
    if(this.pos[1]==0){ DzBy = field[this.pos[0]][this.pos[1]+1].By - this.By; }
    else if(this.pos[1]==gridsize-1){ DzBy = this.By - field[this.pos[0]][this.pos[1]-1].By; }
    else { DzBy = (field[this.pos[0]][this.pos[1]+1].By - field[this.pos[0]][this.pos[1]-1].By); }
    
    this.dE = dt*m0*e0*(DyBz - DzBy);
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
	interval = min(windowWidth,windowHeight)/(gridsize+1);
 	left_trans = max((windowWidth  - interval*(gridsize-1))/2 , 0);
	up_trans   = max((windowHeight - interval*(gridsize-1))/2 , 0);
	scB = interval/8;
	scE = interval/2;
	// print(interval);
}