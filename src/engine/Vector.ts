export class Vector {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector): this {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v: Vector): this {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	mult(n: number): this {
		this.x *= n;
		this.y *= n;
		return this;
	}

	div(n: number): this {
		if (n !== 0) {
			this.x /= n;
			this.y /= n;
		}
		return this;
	}

	magSq(): number {
		return this.x * this.x + this.y * this.y;
	}

	mag(): number {
		return Math.sqrt(this.magSq());
	}

	normalize(): this {
		const m = this.mag();
		if (m !== 0) {
			this.div(m);
		}
		return this;
	}

	limit(max: number): this {
		if (this.magSq() > max * max) {
			this.normalize();
			this.mult(max);
		}
		return this;
	}

	dist(v: Vector): number {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	distSq(v: Vector): number {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	copy(): Vector {
		return new Vector(this.x, this.y);
	}

	static sub(v1: Vector, v2: Vector): Vector {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}
}