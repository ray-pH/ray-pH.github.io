let charges = []
let n_charges = 0;
let thecharge = 20;
let k = 1;
let diameter = 50;
let radius = diameter/2;
let menuOpen = false;

let resetButton, menuButton, pauseButton;
let showChargeButton; let showCharge = false;
let plusChargeButton, minusChargeButton, ChargeText;
let plusRadiusButton, minusRadiusButton, RadiusText;

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
	buttonPrep();
}

function draw(){
	background(5);
	// debug();
	if(menuOpen){ textSize(14); textAlign(LEFT,BOTTOM);fill(255); text(thecharge,75,155); }
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
	n_charges = 0; charges = []; thecharge = 20;
}



function addRadius(){ diameter += 5; radius = diameter/2 }
function subRadius(){ diameter -= 5; radius = diameter/2 }
function addCharge(){ thecharge += 1; }
function subCharge(){ thecharge -= 1; }
function showingCharge(){ showCharge = !showCharge; }

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	resizing();
}

function resizing(){
}

function mouseClicked(){
	if(!(mouseX < 100 && mouseY < 200)){
		charges[n_charges] = new Charge(createVector(mouseX, mouseY),thecharge,n_charges);
		n_charges += 1;
		thecharge *= -1;
	}
}

function debug(){
	textSize(24);fill(255);noStroke();
	text(mouseX,90,80);
	text(mouseY,90,100);
}

function Evector(position, excluded){
	let E = createVector(0,0);
	for(let i = 0; i < n_charges; i++){
		if(i != excluded){
			let p0 = charges[i].pos;
			let q = charges[i].charge;
			let r = p5.Vector.sub(position,p0);
			let er = r.copy(); er.normalize();
			let Ei = p5.Vector.mult(er,k*q/r.magSq());
			E.add(Ei);
		}
	}
	return E;
}

function tooCloseVector(position,excluded,vel){
	let V = createVector(0,0);
	for(let i = 0; i < n_charges; i++){
		if(i != excluded){
			let p0 = charges[i].pos;
			let r = p5.Vector.sub(position,p0);
			let rmag = r.mag();
			if( rmag < 1*diameter && r.dot(vel) < 0){
				let themag = (abs(diameter-rmag))/50;
				r.setMag(themag);
				V.add(r);

			}
		}
	}
	return V
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
		if(showCharge){
			fill(255); noStroke(); textAlign(CENTER,CENTER);
			textSize(radius/1.7);text(this.charge,this.pos.x,this.pos.y);
		}
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
		let E = Evector(this.pos, this.index); //electrostatic force
		let V = tooCloseVector(this.pos, this.index, this.vel); //"collision" fotce
		E.mult(this.charge);
		V.mult(abs(this.charge));
		this.acc = p5.Vector.add(E,V);
	}

	update(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}
}


function buttonPrep(){
	resetButton = createButton('Reset');
  	resetButton.position(18, 18).size(80,20);
  	resetButton.mousePressed(reset);

  	menuButton = createButton('Menu');
  	menuButton.position(18,40).size(80,20);
  	menuButton.mousePressed(menu);

  	showChargeButton = createButton("Show Charge");
  	showChargeButton.position(18,64).size(80,20).hide();
  	showChargeButton.mousePressed(showingCharge);
  	
  	RadiusText = createDiv("<a style='color:white'>Radius</a>");
  	RadiusText.position(18,86).size(80,20).hide();

  	plusRadiusButton = createButton('+');
  	plusRadiusButton.position(18,108).size(30,20).hide();
  	plusRadiusButton.mousePressed(addRadius);
  	minusRadiusButton = createButton('-');
  	minusRadiusButton.position(52,108).size(30,20).hide();
  	minusRadiusButton.mousePressed(subRadius);

  	ChargeText = createDiv("<a style='color:white'>Charge</a>");
  	ChargeText.position(18,140).size(80,20).hide();

  	plusChargeButton = createButton('+');
  	plusChargeButton.position(18,162).size(30,20).hide();
  	plusChargeButton.mousePressed(addCharge);
  	minusChargeButton = createButton('-');
  	minusChargeButton.position(52,162).size(30,20).hide();
  	minusChargeButton.mousePressed(subCharge);
}

function menu(){
	if(!menuOpen){
		showChargeButton.show();
		RadiusText.show();
		plusRadiusButton.show();
		minusRadiusButton.show();
		ChargeText.show();
		plusChargeButton.show();
		minusChargeButton.show();
	}else{
		showChargeButton.hide();
		RadiusText.hide();
		plusRadiusButton.hide();
		minusRadiusButton.hide();
		ChargeText.hide();
		plusChargeButton.hide();
		minusChargeButton.hide();
	}
	menuOpen = !menuOpen;
}