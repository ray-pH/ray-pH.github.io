let charges = []
let n_charges = 2;
let diameter = 50;
let radius = diameter/2;
let button;

function setup(){
	createCanvas(windowWidth, windowHeight);
	button = createButton('Reset');
  	button.position(19, 19);
  	button.mousePressed(reset);
	let h = windowHeight;
	let w = windowWidth;
	charges[0] = new Charge(createVector(1/4*w, 3/4*h),3  ,0);
	charges[1] = new Charge(createVector(3/4*w, 1/4*h),-3 ,1);	
	// charges[2] = new Charge(createVector(600,200),10  ,2);	
}

function draw(){
	background(5);
	// debug();
	for (let i = 0; i < n_charges; i++){
		charges[i].drawline();
		charges[i].calculate();
	}
	for (let i = 0; i < n_charges; i++){
		charges[i].update();
		charges[i].show();
	}
}

function reset(){
	n_charges = 0;
	charges = [];
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	resizing();
}

function resizing(){
}

function debug(){
	textSize(24);fill(255);noStroke();
	text(mouseX,10,20);
	text(mouseY,10,40);
}

function Evector(position, excluded){
	let E = createVector(0,0);
	for(let i = 0; i < n_charges; i++){
		if(i != excluded){
			let p0 = charges[i].pos;
			let q = charges[i].charge;
			let r = p5.Vector.sub(position,p0);
			let er = r.copy(); er.normalize();
			let Ei = p5.Vector.mult(er,q/r.mag());
			E.add(Ei)
		}
	}
	return E;
}

function tooCloseVector(position,excluded){
	let exist = false;
	let V = createVector(0,0);
	for(let i = 0; i < n_charges; i++){
		if(i != excluded){
			let p0 = charges[i].pos;
			let r = p5.Vector.sub(position,p0);
			let rmag = r.mag();
			if( rmag < 1.1*diameter ){
				exist = true;
				r.setMag(sqrt(diameter-rmag));
				if(rmag > diameter) r.setMag(0);
				V.add(r);
			}
		}
	}
	return [V,exist];
}

function OutScreen(pos){
	//checkng whether a pos is outside the screen
	if(pos.x < 0 || pos.y < 0) return true;
	if(pos.x > windowWidth || pos.y > windowHeight) return true;
	return false;
}

class Charge{
	constructor(pos, charge, index){
		this.charge = charge; this.pos = pos; this.index = index;
		this.vel = createVector(0,0); this.acc = createVector(0,0);
		if(charge>0)        { this.color = '#E6274D'; this.multiplier = 3; }
		else if(charge < 0) { this.color = '#2793E6'; this.multiplier = -3;}
		else				{ this.color = '#EEEEEE'; this.multiplier = 0; }
	}

	show(){
		fill(this.color); stroke(0); strokeWeight(2);
		circle(this.pos.x,this.pos.y,diameter)
	}

	drawline(){
		for(let ang = 0; ang < 2*PI; ang += 2*PI/10){
			let p = createVector(this.pos.x + (radius)*cos(ang), 
								 this.pos.y + (radius)*sin(ang));
			stroke(255); noFill(); strokeWeight(2); 
			beginShape();
			for(let i = 0; i < 1000; i++){
				vertex(p.x,p.y);
				let E = Evector(p,-1);
				E.normalize();
				p.add(E.mult(this.multiplier));
				//check when to stop
				if(OutScreen(p)) break; //if line is outof screen, break
				let close = false;
				for (let i = 0; i < n_charges; i++){
					let d = p5.Vector.sub(p,charges[i].pos);
					if(d.mag() < radius) close = true;
				} 
				if(close) break; //if line is too close to a charge, break
			}
			endShape();
		}
	}

	calculate(){
		//calculate forces
		let tooClose = tooCloseVector(this.pos, this.index); //check too close
		if(!tooClose[1]){
			let E = Evector(this.pos, this.index); //electrostatic force
			E.mult(this.charge);
			this.acc = E.copy();
		}else{
			this.acc = 0;
			this.vel = tooClose[0].copy();
		}
	}

	update(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}
}