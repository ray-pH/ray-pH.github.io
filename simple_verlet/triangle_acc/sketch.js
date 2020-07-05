let particles = []
let rods = []

let g0 = 0.4;
let gx=0, gy=0.4;
let restitution = 0.99;
let friction = 0.3;

let tolerance = 0.5;
let particle_radius = 5;

let accelerometer_x, accelerometer_y,accelerometer_z;

function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);

	particles[0] = new Particle(50,50,45,45);
	particles[1] = new Particle(100,50,110,45);
	particles[2] = new Particle(75,50+25*sqrt(3),50,90);

	rods[0] = new Rod(particles[0], particles[1]);
	rods[1] = new Rod(particles[1], particles[2]);
	rods[2] = new Rod(particles[2], particles[0]);


}

function draw(){
	background(0);
	for (let i = 0; i < particles.length; i++){
		let p = particles[i];
		if(p !=  null){
			p.update();
			p.constra();
			p.renderShadow();
			p.render();
		}
	}
	for (let i = 0; i < rods.length; i++){
		let r = rods[i]
		if(r != null){
			r.update();
			r.render();
		}
	}
	let midx = 0, midy = 0;
	for (let i = 0; i < particles.length; i++){
		let p = particles[i];
		midx += p.x; midy += p.y;
	}
	midx /= 3; midy /= 3;
	point(midx,midy);
	calculateG();
}

function calculateG(){
	gravity = sqrt(accelerometer_x*accelerometer_x + accelerometer_y*accelerometer_y + accelerometer_z*accelerometer_z);
	if(!isNaN(gravity)){
		gx = - accelerometer_x/gravity * g0;
		gy = accelerometer_y/gravity * g0;
	}
}

function mousePressed(){
	let forceFactor = 0.05;

	let midx = 0, midy = 0;
	for (let i = 0; i < particles.length; i++){
		let p = particles[i];
		midx += p.x; midy += p.y;
	}
	midx /= 3; midy /= 3;
	let dx = midx - mouseX;
	let dy = midy - mouseY;
	for (let i = 0; i < particles.length; i++){
		let p = particles[i];
		p.ox += dx * forceFactor;
		p.oy += dy * forceFactor;
	}

}

window.addEventListener('devicemotion', function(e) 
{
  // get accelerometer values
  accelerometer_x = parseFloat(e.accelerationIncludingGravity.x);
  accelerometer_y = parseFloat(e.accelerationIncludingGravity.y);
  accelerometer_z = parseFloat(e.accelerationIncludingGravity.z); 
});

class Particle{

	constructor(x, y, ox, oy){
		this.x = x; this.y = y; this.ox = ox; this.oy = oy;
	}

	update(){
		let vx = this.x - this.ox;
		let vy = this.y - this.oy;

	    if(abs(this.y - height + particle_radius) < tolerance) vx *= 1 - friction;
	    else if(abs(this.y + particle_radius) < tolerance) vx *= 1 - friction;
	    if(abs(this.x - width + particle_radius) < tolerance) vy *= 1 - friction;
	    else if(abs(this.x + particle_radius) < tolerance) vy *= 1 - friction;
	    
	    this.ox = this.x;
	    this.oy = this.y;
	    this.x += vx;
	    this.y += vy;
	    this.y += gy;
	    this.x += gx;
		}

		constra(){
		let vx = this.x - this.ox;
		let vy = this.y - this.oy;

		if(this.y > height - particle_radius){
			this.y = height - particle_radius;
			this.oy = this.y + vy * restitution;
		}
		else if(this.y < particle_radius){
			this.y = particle_radius;
			this.oy = this.y + vy * restitution;
		}
		if(this.x > width - particle_radius){
			this.x = width - particle_radius;
			this.ox = this.x + vx * restitution;
		}
		else if(this.x < particle_radius){
			this.x = particle_radius;
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
		let dx = this.p1.x - this.p2.x;
		let dy = this.p1.y - this.p2.y;
		let dist = sqrt(dx*dx + dy*dy);
		let dl = this.len - dist;
		let offsetX = dx * dl/dist/2;
		let offsetY = dy * dl/dist/2;

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