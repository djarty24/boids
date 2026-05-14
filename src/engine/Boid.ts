import { Vector } from './Vector';

export class Boid {
position: Vector;
velocity: Vector;
acceleration: Vector;
maxForce: number;
maxSpeed: number;

constructor(x: number, y: number) {
	this.position = new Vector(x, y);
	this.velocity = new Vector((Math.random() * 2) - 1, (Math.random() * 2) - 1);
	this.acceleration = new Vector(0, 0);
	this.maxForce = 0.2;
	this.maxSpeed = 4;
}

applyForce(force: Vector): void {
	this.acceleration.add(force);
}

update(): void {
	this.velocity.add(this.acceleration);
	this.velocity.limit(this.maxSpeed);
	this.position.add(this.velocity);
	this.acceleration.mult(0);
}

separate(boids: Boid[]): Vector {
	const desiredSeparation = 25;
	const steer = new Vector(0, 0);
	let count = 0;

	for (const other of boids) {
	const d = this.position.dist(other.position);
	if (d > 0 && d < desiredSeparation) {
		const diff = Vector.sub(this.position, other.position);
		diff.normalize();
		diff.div(d);
		steer.add(diff);
		count++;
	}
	}

	if (count > 0) {
	steer.div(count);
	}

	if (steer.magSq() > 0) {
	steer.normalize();
	steer.mult(this.maxSpeed);
	steer.sub(this.velocity);
	steer.limit(this.maxForce);
	}

	return steer;
}
}