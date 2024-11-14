/**
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 *
 * Definitions and drawing functions for three-dimensional primitives.
 */

/****************************************
 * Definitions for a primitive unit cube.
 ****************************************/

// Vertex definitions for a unit cube.
const CUBE_VERTICES = [
	vec4(-1, -1,  1, 1), // A
	vec4(-1,  1,  1, 1), // B
	vec4( 1,  1,  1, 1), // C
	vec4( 1, -1,  1, 1), // D
	vec4(-1, -1, -1, 1), // E
	vec4(-1,  1, -1, 1), // F
	vec4( 1,  1, -1, 1), // G
	vec4( 1, -1, -1, 1)  // H
];

// Face definitions for the cube, composed from the cube vertices.
const CUBE_FACES = [
	// The front face.
	CUBE_VERTICES[B],
	CUBE_VERTICES[A],
	CUBE_VERTICES[D],
	CUBE_VERTICES[B],
	CUBE_VERTICES[D],
	CUBE_VERTICES[C],

	// The right face.
	CUBE_VERTICES[C],
	CUBE_VERTICES[D],
	CUBE_VERTICES[H],
	CUBE_VERTICES[C],
	CUBE_VERTICES[H],
	CUBE_VERTICES[G],

	// The left face.
	CUBE_VERTICES[F],
	CUBE_VERTICES[E],
	CUBE_VERTICES[A],
	CUBE_VERTICES[F],
	CUBE_VERTICES[A],
	CUBE_VERTICES[B],

	// The back face.
	CUBE_VERTICES[G],
	CUBE_VERTICES[H],
	CUBE_VERTICES[E],
	CUBE_VERTICES[G],
	CUBE_VERTICES[E],
	CUBE_VERTICES[F],

	// The top face.
	CUBE_VERTICES[F],
	CUBE_VERTICES[B],
	CUBE_VERTICES[C],
	CUBE_VERTICES[F],
	CUBE_VERTICES[C],
	CUBE_VERTICES[G],

	// The bottom face.
	CUBE_VERTICES[D],
	CUBE_VERTICES[A],
	CUBE_VERTICES[E],
	CUBE_VERTICES[D],
	CUBE_VERTICES[E],
	CUBE_VERTICES[H],
];

// Maps a texture along the whole face of a cube.
const CUBE_TEX_COORDS = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 0],
	[1, 1],
	[0, 1]
];

/**
 * Draw the cube whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the cube.
 * @param {vec3}   t      - The vector by which to translate the cube.
 * @param {vec3}   s      - The vector by which to scale the cube.
 */
function drawCube(offset, t, s) {
	let [tx, ty, tz] = t;
	let [sx, sy, sz] = s;

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, CUBE_FACES.length);

	modelViewMatrix = matrixStack.pop();
}

/****************************************
 * Definitions for a primitive cylinder.
 ****************************************/

/**
 * Return the vertices composing the cylinder with the given radius and height.
 * The cylinder is open on the top and bottom.
 * @param {number} radius - The radius of the cylinder.
 * @param {height} height - The height of the cylinder.
 * @return The vertices composing the cylinder.
 */
function generateCylinderVertices(radius, height) {
	let half = [];
	for (let i = 0; i < 25; i++) {
		half.push(vec4(radius, height * i / 24, 0, 1.0));
	}

	let slices = 12;
	let stacks = 24;

	let textureSInc = 1.0 / slices;
	let textureTInc = 1.0 / stacks;

	let curr1, curr2;
	let prev1, prev2;

	let t1, t2;
	let s1, s2;

	let vertices = [];
	let texCoords = [];
	for (let i = 0; i < stacks; i++) {
		let init1 = half[i];
		let init2 = half[i + 1];

		prev1 = init1;
		prev2 = init2;

		t1 = textureTInc * i;
		t2 = textureTInc * (i + 1);

		// Generate and push the vertices for the cylinder's quads,
		// rotating about the y-axis to close the cylinder.
		for (let j = 0; j < slices; j++) {
			let angle = (j + 1) * 360 / slices;
			let rotation = rotate(angle, 0, 1, 0);
			curr1 = multiply(rotation, init1);
			curr2 = multiply(rotation, init2);

			s1 = textureSInc * j;
			s2 = textureSInc * (j + 1);

			// First triangle for the quad.
			vertices.push(prev1); texCoords.push([s1, t1]);
			vertices.push(curr1); texCoords.push([s2, t1]);
			vertices.push(curr2); texCoords.push([s2, t2]);

			// Second triangle for the quad.
			vertices.push(prev1); texCoords.push([s1, t1]);
			vertices.push(curr2); texCoords.push([s2, t2]);
			vertices.push(prev2); texCoords.push([s1, t2]);

			// Current points are next points' previous points.
			prev1 = curr1;
			prev2 = curr2;
		}
	}

	return [vertices, texCoords];
}

/**
 * Draw the cylinder whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the cylinder.
 * @param {vec3}   t      - The vector by which to translate the cylinder.
 * @param {vec3}   s      - The vector by which to scale the cylinder.
 */
function drawCylinder(offset, t, s) {
	let [tx, ty, tz] = t;
	let [sx, sy, sz] = s;

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, 1728);

	modelViewMatrix = matrixStack.pop();
}

/**
 * Return the product of the given matrix and vector.
 * @param {mat4} m - The matrix to multiply.
 * @param {vec4} v - The vector to multiply.
 * @returns The product of the given matrix and vector.
 */
function multiply(m, v) {
	let vv = vec4(
		m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
		m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
		m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
		m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]
	);

    	return vv;
}

/****************************************
 * Definitions for the wall.
 ****************************************/

/**
 * Wall material definitions.
 */
const WALL_MATERIAL_AMBIENT   = vec4(0.4, 0.4, 0.4, 1.0);
const WALL_MATERIAL_DIFFUSE   = vec4(0.4, 0.4, 0.4, 1.0);
const WALL_MATERIAL_SPECULAR  = vec4(0.2, 0.2, 0.2, 1.0);
const WALL_MATERIAL_SHININESS = 30.0;

const NUM_WALL_VERTICES = CUBE_FACES.length;

// Maps a texture along the whole face of a wall.
const WALL_TEX_COORDS = [
	[0, 0],
	[2, 0],
	[2, 2],
	[0, 0],
	[2, 2],
	[0, 2]
];

/**
 * Return the vertices composing a wall.
 */
function generateWallVertices() {
	return CUBE_FACES;
}

/**
 * Return the texture coordinates for a wall.
 */
function generateWallTexCoords() {
	let texCoords = [];
	for (let i = 0; i < 6; i++)
		texCoords = texCoords.concat(WALL_TEX_COORDS);

	return texCoords;
}


/**
 * Draw the wall whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the wall-trim.
 * @param {vec3}   t      - The vector by which to translate the wall-trim.
 * @param {vec3}   r      - The vector by which to rotate the wall-trim.
 * @param {vec3}   s      - The vector by which to scale the wall-trim.
 */
function drawWall(offset) {
	setMaterial(
		WALL_MATERIAL_AMBIENT, WALL_MATERIAL_DIFFUSE, 
		WALL_MATERIAL_SPECULAR, WALL_MATERIAL_SHININESS
	);

	drawCube(offset, vec3(0, 0, 0), vec3(1, 1, 1));
}

/****************************************
 * Definitions for the top wall trim.
 ****************************************/

/**
 * Wall trim material definitions.
 */
const WALL_TRIM_MATERIAL_AMBIENT   = vec4(0.5, 0.5, 0.5, 1.0);
const WALL_TRIM_MATERIAL_DIFFUSE   = vec4(0.5, 0.5, 0.5, 1.0);
const WALL_TRIM_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const WALL_TRIM_MATERIAL_SHININESS = 30.0;

const NUM_WALL_TRIM_VERTICES = CUBE_FACES.length;

// Maps a texture along the whole face of the wall trim.
const WALL_TRIM_TEX_COORDS = [
	[0, 0],
	[1, 0],
	[1, 5],
	[0, 0],
	[1, 5],
	[0, 5]
];

/**
 * Return the vertices composing the trim of the top of a wall.
 */
function generateWallTrimVertices() {
	let texCoords = []
	for (let i = 0; i < 6; i++)
		texCoords = texCoords.concat(WALL_TRIM_TEX_COORDS);

	return [CUBE_FACES, texCoords];
}

/**
 * Draw the wall-trim whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the wall-trim.
 * @param {vec3}   t      - The vector by which to translate the wall-trim.
 * @param {vec3}   r      - The vector by which to rotate the wall-trim.
 * @param {vec3}   s      - The vector by which to scale the wall-trim.
 */
function drawWallTrim(offset, t, r, s) {
	let [tx, ty, tz] = t;
	let [theta, rx, ry, rz] = r;
	let [sx, sy, sz] = s;

	setMaterial(
		WALL_TRIM_MATERIAL_AMBIENT, WALL_TRIM_MATERIAL_DIFFUSE, 
		WALL_TRIM_MATERIAL_SPECULAR, WALL_TRIM_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta, rx, ry, rz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	drawCube(offset, NO_TRANSLATE, NO_SCALE);

	modelViewMatrix = matrixStack.pop();
}

/***************************************************
 * Definitions for a table composed from primitives.
 ***************************************************/

/**
 * Table material definitions.
 */
const TABLE_MATERIAL_AMBIENT   = vec4(0.5, 0.5, 0.5, 1.0);
const TABLE_MATERIAL_DIFFUSE   = vec4(0.5, 0.5, 0.5, 1.0);
const TABLE_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const TABLE_MATERIAL_SHININESS = 30.0;

/**
 * Return the vertices composing a table.
 */
function generateTableVertices() {
	let [vertices, texCoords] = generateCylinderVertices(1.0, 1.0);
	vertices = vertices.concat(CUBE_FACES);
	for (let i = 0; i < 6; i++)
		texCoords = texCoords.concat(CUBE_TEX_COORDS);

	return [vertices, texCoords];
}

/**
 * Draw the table whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the table.
 * @param {vec3}   t      - The vector by which to translate the table.
 * @param {vec3}   r      - The vector by which to rotate the table.
 * @param {vec3}   s      - The vector by which to scale the table.
 */
function drawTable(offset, t, r, s) {
	let [tx, ty, tz] = t;
	let [theta, rx, ry, rz] = r;
	let [sx, sy, sz] = s;
	
	const LEG_OFFSET = 8;
	const LEG_SCALE = vec3(1.5, 16, 1.5);

	const FOOT_SCALE = vec3(1.5, 0.5, 1.5);
	const TRIM_A_SCALE = vec3(1.5, 1, 1.5);
	const TRIM_B_SCALE = vec3(1.8, 1, 1.8);

	setMaterial(
		TABLE_MATERIAL_AMBIENT, TABLE_MATERIAL_DIFFUSE, 
		TABLE_MATERIAL_SPECULAR, TABLE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta, rx, ry, rz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));

	/*
	 * Draw the table legs.
	 */
	drawCylinder(offset, vec3(-LEG_OFFSET, 0,  LEG_OFFSET), LEG_SCALE);
	drawCylinder(offset, vec3(-LEG_OFFSET, 0, -LEG_OFFSET), LEG_SCALE);
	drawCylinder(offset, vec3( LEG_OFFSET, 0, -LEG_OFFSET), LEG_SCALE);
	drawCylinder(offset, vec3( LEG_OFFSET, 0,  LEG_OFFSET), LEG_SCALE);

	offset += 1728;

	/*
	 * Draw the table feet.
	 */
	drawCube(offset, vec3(-LEG_OFFSET, 0,  LEG_OFFSET), FOOT_SCALE);
	drawCube(offset, vec3(-LEG_OFFSET, 0, -LEG_OFFSET), FOOT_SCALE);
	drawCube(offset, vec3( LEG_OFFSET, 0, -LEG_OFFSET), FOOT_SCALE);
	drawCube(offset, vec3( LEG_OFFSET, 0,  LEG_OFFSET), FOOT_SCALE);

	/*
	 * Draw the table's first layer of trim.
	 */
	drawCube(offset, vec3(-LEG_OFFSET, 14,  LEG_OFFSET), TRIM_A_SCALE);
	drawCube(offset, vec3(-LEG_OFFSET, 14, -LEG_OFFSET), TRIM_A_SCALE);
	drawCube(offset, vec3( LEG_OFFSET, 14, -LEG_OFFSET), TRIM_A_SCALE);
	drawCube(offset, vec3( LEG_OFFSET, 14,  LEG_OFFSET), TRIM_A_SCALE);

	/*
	 * Draw the table's second layer of trim.
	 */
	drawCube(offset, vec3(-LEG_OFFSET, 15,  LEG_OFFSET), TRIM_B_SCALE);
	drawCube(offset, vec3(-LEG_OFFSET, 15, -LEG_OFFSET), TRIM_B_SCALE);
	drawCube(offset, vec3( LEG_OFFSET, 15, -LEG_OFFSET), TRIM_B_SCALE);
	drawCube(offset, vec3( LEG_OFFSET, 15,  LEG_OFFSET), TRIM_B_SCALE);

	/*
	 * Draw the table top. 
	 */
	drawCube(offset, vec3(0, 16, 0), vec3(12, 0.5, 12));

	modelViewMatrix = matrixStack.pop();
}


/***************************************************
 * Definitions for a candle composed from primitives.
 ***************************************************/

/**
 * Candle material definitions.
 */
const CANDLE_MATERIAL_AMBIENT   = vec4(0.7, 0.6, 0.6, 1.0);
const CANDLE_MATERIAL_DIFFUSE   = vec4(0.7, 0.6, 0.6, 1.0);
const CANDLE_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const CANDLE_MATERIAL_SHININESS = 30.0;

/**
 * Whick material definitions.
 */
const WHICK_MATERIAL_AMBIENT   = vec4(0.2, 0.2, 0.2, 1.0);
const WHICK_MATERIAL_DIFFUSE   = vec4(0.2, 0.2, 0.2, 1.0);
const WHICK_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const WHICK_MATERIAL_SHININESS = 30.0;

// Vertices composing a slice of a closed cylinder.
const CYLINDER_VERTICES = [
	vec3(0, 0, 0), // A
	vec3(0.7, 0, 0), // A
	vec3(0.6, 0.2, 0), // A
	vec3(0.5, 3, 0), // A
	vec3(0, 3, 0), // A
]

const NUM_CYLINDER_SLICES = 8;
const NUM_CYLINDER_VERTICES = (CYLINDER_VERTICES.length - 1) * NUM_CYLINDER_SLICES * 6;

/**
 * Return the vertices composing a candle.
 */
function generateCandleVertices() {
	let [vertices, texCoords] = generateSurfaceOfRevolution(CYLINDER_VERTICES, NUM_CYLINDER_SLICES);

	return [vertices, texCoords];
}

/**
 * Draw the candle whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the candle.
 * @param {vec3}   t      - The vector by which to translate the candle.
 * @param {vec3}   r      - The vector by which to rotate the candle.
 * @param {vec3}   s      - The vector by which to scale the candle.
 */
function drawCandle(offset, t, r, s) {
	let [tx, ty, tz] = t;
	let [theta, rx, ry, rz] = r;
	let [sx, sy, sz] = s;

	setMaterial(
		CANDLE_MATERIAL_AMBIENT, CANDLE_MATERIAL_DIFFUSE, 
		CANDLE_MATERIAL_SPECULAR, CANDLE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta, rx, ry, rz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	// Draw the wax.
	gl.drawArrays(gl.TRIANGLES, offset, NUM_CYLINDER_VERTICES);

	setMaterial(
		WHICK_MATERIAL_AMBIENT, WHICK_MATERIAL_DIFFUSE, 
		WHICK_MATERIAL_SPECULAR, WHICK_MATERIAL_SHININESS
	);

	// Draw the whick.
	modelViewMatrix = mult(modelViewMatrix, translate(0, 3, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(0.2, 0.2, 0.2));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, NUM_CYLINDER_VERTICES);

	modelViewMatrix = matrixStack.pop();
}
