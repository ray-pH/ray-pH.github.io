let triangles = [];
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

	let p0 = new Particle(50,50,45,45);
	let p1 = new Particle(100,50,110,45);
	let p2 = new Particle(75,50+25*sqrt(3),50,90);

	let p3 = new Particle(150,50,155,45);
	let p4 = new Particle(200,50,212,45);
	let p5 = new Particle(175,50+25	*sqrt(3),152,90);

	let p6 = new Particle(150,100,155,95);
	let p7 = new Particle(200,100,212,95);
	let p8 = new Particle(175,100+25*sqrt(3),152,140);

	triangles[0] = new Triangle(p0,p1,p2);
	triangles[1] = new Triangle(p3,p4,p5);
	triangles[2] = new Triangle(p6,p7,p8);
}

function draw(){
	background(0);
	for (let i = 0; i < triangles.length; i++){
		let t = triangles[i];
		t.update();
		t.render();

		for (let j = 0; j < triangles.length; j++){
			if(j != i){
				for(let k = 0; k < t.particles.length; k++){
					let p = t.particles[k];
					if(triangles[j].pointInTriangle(p.x,p.y)){
						stroke(0,0,255); strokeWeight(6);
						point( p.x, p.y);
						let vx = p.ox - p.x;
						let vy = p.oy - p.y;
						p.ox = p.x;
						p.oy = p.y;
						let limiter = 100;
						while(triangles[j].pointInTriangle(p.x,p.y) && limiter > 0){
							limiter -= 1;
							t.applyForceDir(vx*restitution,vy*restitution);
						}
					}
				}
			}
		}

	}
	// if(triangles[0].pointInTriangle(mouseX, mouseY) ) console.log("inside 0");
	// if(triangles[1].pointInTriangle(mouseX, mouseY) ) console.log("inside 1");
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
	for(let i = 0; i < triangles.length; i++){
		triangles[i].applyForce(forceFactor, mouseX, mouseY)
	}
}

window.addEventListener('devicemotion', function(e) 
{
  accelerometer_x = parseFloat(e.accelerationIncludingGravity.x);
  accelerometer_y = parseFloat(e.accelerationIncludingGravity.y);
  accelerometer_z = parseFloat(e.accelerationIncludingGravity.z); 
});