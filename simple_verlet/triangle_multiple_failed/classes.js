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

	checkIntersect(relse){
		let x1 = this.p1.x; let y1 = this.p1.y;
		let x2 = this.p2.x; let y2 = this.p2.y;

		let x3 = relse.p1.x; let y3 = relse.p1.y;
		let x4 = relse.p2.x; let y4 = relse.p2.y;

		let ua = ( (x4-x3)*(y1-y3) - (y4-y3)*(x1-x3) )
		       / ( (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1) );
		let ub = ( (x2-x1)*(y1-y3) - (y2-y1)*(x1-x3) )
		       / ( (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1) )

		//true if ua,ub in [0,1]
		let ina = (0 <= ua) && (ua <= 1);
		let inb = (0 <= ub) && (ub <= 1);
		return (ina && inb);
	}
}

class Triangle{

	constructor(p1,p2,p3){
		this.particles = [p1,p2,p3];
		let r1 = new Rod(this.particles[0],this.particles[1]);
		let r2 = new Rod(this.particles[1],this.particles[2]);
		let r3 = new Rod(this.particles[2],this.particles[0]);
		this.rods = [r1,r2,r3];
		this.midx = 0;
		this.midy = 0;
	}

	update(){
		for (let i = 0; i < this.particles.length; i++){
			let p = this.particles[i];
			if(p !=  null){
				p.update();
				p.constra();
			}
		}
		for (let i = 0; i < this.rods.length; i++){
			let r = this.rods[i]
			if(r != null){
				r.update();
			}
		}
	}

	render(){
		for (let i = 0; i < this.particles.length; i++){
			let p = this.particles[i];
			if(p !=  null){
				p.renderShadow();
				p.render();
			}
		}
		for (let i = 0; i < this.rods.length; i++){
			let r = this.rods[i]
			if(r != null){
				r.render();
			}
		}

		let midx = 0, midy = 0;
		for (let i = 0; i < this.particles.length; i++){
			let p = this.particles[i];
			midx += p.x; midy += p.y;
		}
		midx /= 3; midy /= 3;
		this.midx = midx; this.midy = midy;
		point(this.midx,this.midy);	
	}

	applyForce(forceFactor, pX, pY){
		let dx = this.midx - pX;
		let dy = this.midy - pY;
		for (let i = 0; i < this.particles.length; i++){
			let p = this.particles[i];
			p.ox += dx * forceFactor;
			p.oy += dy * forceFactor;
		}
	}

	pointInTriangle(pX, pY){
		let p0X = this.particles[0].x;
		let p0Y = this.particles[0].y;
		let p1X = this.particles[1].x;
		let p1Y = this.particles[1].y;
		let p2X = this.particles[2].x;
		let p2Y = this.particles[2].y;

	    let s = p0Y*p2X - p0X*p2Y + (p2Y-p0Y)*pX + (p0X-p2X)*pY;
	    let t = p0X*p1Y - p0Y*p1X + (p0Y-p1Y)*pX + (p1X-p0X)*pY;

	    if ((s < 0) != (t < 0))
	        return false;

	    var A = -p1Y*p2X + p0Y*(p2X-p1X) + p0X*(p1Y-p2Y) + p1X*p2Y;

	    return A < 0 ?
	            (s <= 0 && s + t >= A) :
	            (s >= 0 && s + t <= A);
		}
}