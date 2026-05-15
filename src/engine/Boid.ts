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

	align(boids: Boid[]): Vector {
		const neighborDist = 50;
		const sum = new Vector(0, 0);
		let count = 0;

		for (const other of boids) {
			const d = this.position.dist(other.position);
			if (d > 0 && d < neighborDist) {
				sum.add(other.velocity);
				count++;
			}
		}

		if (count > 0) {
			sum.div(count);
			sum.normalize();
			sum.mult(this.maxSpeed);
			const steer = Vector.sub(sum, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		}

		return new Vector(0, 0);
	}

	cohere(boids: Boid[]): Vector {
		const neighborDist = 50;
		const sum = new Vector(0, 0);
		let count = 0;

		for (const other of boids) {
			const d = this.position.dist(other.position);
			if (d > 0 && d < neighborDist) {
				sum.add(other.position);
				count++;
			}
		}

		if (count > 0) {
			sum.div(count);
			return this.seek(sum);
		}

		return new Vector(0, 0);
	}

	seek(target: Vector): Vector {
		const desired = Vector.sub(target, this.position);
		desired.normalize();
		desired.mult(this.maxSpeed);
		const steer = Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}

	flock(boids: Boid[]): void {
		const sep = this.separate(boids);
		const ali = this.align(boids);
		const coh = this.cohere(boids);

		sep.mult(1.5);
		ali.mult(1.0);
		coh.mult(1.0);

		this.applyForce(sep);
		this.applyForce(ali);
		this.applyForce(coh);
	}

	borders(width: number, height: number): void {
		if (this.position.x < 0) this.position.x = width;
		if (this.position.y < 0) this.position.y = height;
		if (this.position.x > width) this.position.x = 0;
		if (this.position.y > height) this.position.y = 0;
	}
}