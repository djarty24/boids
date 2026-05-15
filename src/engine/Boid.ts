import { Vector } from './Vector';

export interface SimulationConfig {
	separationWeight: number;
	alignmentWeight: number;
	cohesionWeight: number;
	maxSpeed: number;
}

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
		const desiredSeparationSq = 25 * 25;
		const steer = new Vector(0, 0);
		let count = 0;

		for (const other of boids) {
			const dSq = this.position.distSq(other.position);
			if (dSq > 0 && dSq < desiredSeparationSq) {
				const diff = Vector.sub(this.position, other.position);
				diff.normalize();
				diff.div(Math.sqrt(dSq));
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
		const neighborDistSq = 50 * 50;
		const sum = new Vector(0, 0);
		let count = 0;

		for (const other of boids) {
			const dSq = this.position.distSq(other.position);
			if (dSq > 0 && dSq < neighborDistSq) {
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
		const neighborDistSq = 50 * 50;
		const sum = new Vector(0, 0);
		let count = 0;

		for (const other of boids) {
			const dSq = this.position.distSq(other.position);
			if (dSq > 0 && dSq < neighborDistSq) {
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

	flee(target: Vector): Vector {
		const desired = Vector.sub(this.position, target);
		desired.normalize();
		desired.mult(this.maxSpeed);
		const steer = Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}

	flock(boids: Boid[], config: SimulationConfig, mousePos: Vector | null): void {
		this.maxSpeed = config.maxSpeed;

		const sep = this.separate(boids);
		const ali = this.align(boids);
		const coh = this.cohere(boids);

		sep.mult(config.separationWeight);
		ali.mult(config.alignmentWeight);
		coh.mult(config.cohesionWeight);

		this.applyForce(sep);
		this.applyForce(ali);
		this.applyForce(coh);

		if (mousePos) {
			const mouseRadius = 110;
			const dSq = this.position.distSq(mousePos);
			if (dSq < mouseRadius * mouseRadius) {
				const fleeForce = this.flee(mousePos);
				fleeForce.mult(5.0);
				this.applyForce(fleeForce);
			}
		}
	}

	borders(width: number, height: number): void {
		if (this.position.x < 0) this.position.x = width;
		if (this.position.y < 0) this.position.y = height;
		if (this.position.x > width) this.position.x = 0;
		if (this.position.y > height) this.position.y = 0;
	}
}