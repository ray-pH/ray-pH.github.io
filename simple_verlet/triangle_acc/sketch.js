var particles = []
var rods = []

var g = -0.4;
var restitution = 0.99;
var friction = 0.3;

var tolerance = 0.5;
var particle_radius = 5;
var floor;

var accelerometer_x, accelerometer_y,accelerometer_z;

function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);
	floor = height - particle_radius;

	particles[0] = new Particle(50,50,45,45);
	particles[1] = new Particle(100,50,110,45);
	particles[2] = new Particle(75,50+25*sqrt(3),50,90);

	rods[0] = new Rod(particles[0], particles[1]);
	rods[1] = new Rod(particles[1], particles[2]);
	rods[2] = new Rod(particles[2], particles[0]);

}

function draw(){
	background(0);
	for (var i = 0; i < particles.length; i++){
		p = particles[i];
		if(p !=  null){
			p.update();
			p.constra();
			p.renderShadow();
			p.render();
		}
	}
	for (var i = 0; i < rods.length; i++){
		r = rods[i]
		if(r != null){
			r.update();
			r.render();
		}
	}
	var midx = 0, midy = 0;
	for (var i = 0; i < particles.length; i++){
		p = particles[i];
		midx += p.x; midy += p.y;
	}
	midx /= 3; midy /= 3;
	point(midx,midy);
	fill(255);noStroke();
	text(accelerationX, 100,100)
	text(accelerationY, 100,150)
	text(accelerationZ, 100,200)
}

function mousePressed(){
	var forceFactor = 0.05;

	var midx = 0, midy = 0;
	for (var i = 0; i < particles.length; i++){
		p = particles[i];
		midx += p.x; midy += p.y;
	}
	midx /= 3; midy /= 3;
	var dx = midx - mouseX;
	var dy = midy - mouseY;
	for (var i = 0; i < particles.length; i++){
		p = particles[i];
		p.ox += dx * forceFactor;
		p.oy += dy * forceFactor;
	}

}

class Particle{

	constructor(x, y, ox, oy){
		this.x = x; this.y = y; this.ox = ox; this.oy = oy;
	}

	update(){
		var vx = this.x - this.ox;
		var vy = this.y - this.oy;

    //apply friction when contacting floor
	    if(abs(this.y - floor) < tolerance) vx *= 1 - friction;
	    
	    this.ox = this.x;
	    this.oy = this.y;
	    this.x += vx;
	    this.y += vy;
	    this.y -= g;
		}

		constra(){
		var vx = this.x - this.ox;
		var vy = this.y - this.oy;

		if(this.y > floor){
			this.y = floor;
			this.oy = this.y + vy * restitution;
		}
		else if(this.y < 0){
			this.y = 0;
			this.oy = this.y + vy * restitution;
		}
		if(this.x > width){
			this.x = width;
			this.ox = this.x + vx * restitution;
		}
		else if(this.x < 0){
			this.x = 0;
			this.ox = this.x + vx * restitution;
		}
	}

	render(){
		stroke(255); strokeWeight(particle_radius*2);
		point(this.x,this.y);
	}

	renderShadow(){
		stroke(255,50,50); strokeWeight(particle_radius*2);
		point(this.ox,this.oy);
	}

}

class Rod{

	constructor(p1, p2){
		this.p1 = p1; this.p2 = p2;
		this.len = dist(p1.x, p1.y, p2.x, p2.y);
	}

	update(){
		var dx = this.p1.x - this.p2.x;
		var dy = this.p1.y - this.p2.y;
		var dist = sqrt(dx*dx + dy*dy);
		var dl = this.len - dist;
		var offsetX = dx * dl/dist/2;
		var offsetY = dy * dl/dist/2;

		this.p1.x += offsetX;
		this.p1.y += offsetY;
		this.p2.x -= offsetX;
		this.p2.y -= offsetY;
	}

	render(){
		stroke(255); strokeWeight(3);
		line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
	}
}