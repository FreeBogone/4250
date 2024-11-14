/**
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 *
 * Definitions and drawing functions for a pot and chalice drawn as surfaces
 * of revolution.
 */

/************************
 * Definitions for a pot.
 ************************/

/**
 * Material definitions for the pot.
 */
const POT_MATERIAL_AMBIENT   = vec4(0.5, 0.5, 0.5, 1.0);
const POT_MATERIAL_DIFFUSE   = vec4(0.5, 0.5, 0.5, 1.0);
const POT_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const POT_MATERIAL_SHININESS = 10.0;

/**
 * Vertices composing a slice of the pot.
 */
const POT_VERTICES = [
	// Outer face of the pot.
	vec3(0.0, -8.5, 0), // A
	vec3(6.0, -8.5, 0), // B
	vec3(8.0, -3.5, 0), // C
	vec3(7.0,  0.0, 0), // D
	vec3(4.0,  3.5, 0), // E
	vec3(4.0,  4.5, 0), // F
	vec3(5.0,  6.5, 0), // G
	vec3(5.0,  7.0, 0), // H
	vec3(4.5,  7.0, 0), // I

	// Inner face of the pot.
	vec3(4.5,  6.5, 0), // J
	vec3(3.5,  4.5, 0), // K
	vec3(3.5,  3.5, 0), // L
	vec3(6.5,  0.0, 0), // M
	vec3(7.5,  -3.5, 0), // N
	vec3(5.5,  -8.0, 0), // O
	vec3(0.0,  -8.0, 0), // P
];

// Number of vertical slices composing the pot.
const NUM_POT_SLICES = 16;

// Number of vertices composing the pot.
const NUM_POT_VERTICES = (POT_VERTICES.length - 1) * NUM_POT_SLICES * 6;

/**
 * Draw a pot.
 * @param {number} offset The index in the global points array at which the
 *                        pot's vertices begin.
 */
function drawPot(offset) {
	setMaterial(
		POT_MATERIAL_AMBIENT, POT_MATERIAL_DIFFUSE, 
		POT_MATERIAL_SPECULAR, POT_MATERIAL_SHININESS
	);

	gl.drawArrays(gl.TRIANGLES, offset, NUM_POT_VERTICES);
}

/****************************
 * Definitions for a chalice.
 ****************************/

/**
 * Material definitions for the chalice.
 */
const CHALICE_MATERIAL_AMBIENT   = vec4(1.0, 1.0, 1.0, 1.0);
const CHALICE_MATERIAL_DIFFUSE   = vec4(1.0, 1.0, 1.0, 1.0);
const CHALICE_MATERIAL_SPECULAR  = vec4(0.4, 0.4, 0.4, 1.0);
const CHALICE_MATERIAL_SHININESS = 30.0;

/**
 * Vertices composing a slice of the chalice.
 */
const CHALICE_VERTICES = [
	// Outer-surface of the chalice.
	vec3(0  , 0   , 0), // A
	vec3(4  , 0   , 0), // B
	vec3(3.5, 1   , 0), // C
	vec3(1  , 1.5 , 0), // D
	vec3(1  , 4   , 0), // E
	vec3(1.2, 4   , 0), // F
	vec3(1.2, 6   , 0), // G
	vec3(1  , 6   , 0), // H
	vec3(1  , 7.5 , 0), // I
	vec3(1.2, 7.5 , 0), // J
	vec3(1.2, 7.7 , 0), // K
	vec3(2  , 8   , 0), // L
	vec3(3  , 9   , 0), // M
	vec3(4  , 11  , 0), // N
	vec3(5, 13  , 0), // 0
	vec3(5, 14  , 0), // P
	vec3(5.2, 14, 0), // Q
	vec3(5.2, 14.2, 0), // R
	vec3(5  , 14.2, 0), // S

	// Inner-surface of the chalice.
	vec3(4, 11, 0), // T
	vec3(2, 9, 0), // U
	vec3(1, 8, 0), // V
	vec3(0, 8, 0), // W
];

// Number of vertical slices composing the chalice.
const NUM_CHALICE_SLICES = 8;

// Number of vertices composing the chalice.
const NUM_CHALICE_VERTICES = (CHALICE_VERTICES.length - 1) * NUM_CHALICE_SLICES * 6;

/**
 * Draw the chalice whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the chalice.
 * @param {vec3}   t      - The vector by which to translate the chalice.
 * @param {vec3}   r      - The vector by which to rotate the chalice.
 * @param {vec3}   s      - The vector by which to scale the chalice.
 */
function drawChalice(offset, t, r, s) {
	let [tx, ty, tz] = t;
	let [theta, rx, ry, rz] = r;
	let [sx, sy, sz] = s;

	setMaterial(
		CHALICE_MATERIAL_AMBIENT, CHALICE_MATERIAL_DIFFUSE, 
		CHALICE_MATERIAL_SPECULAR, CHALICE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta, rx, ry, rz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	gl.drawArrays(gl.TRIANGLES, offset, NUM_CHALICE_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

/*************************
 * Definitions for a bowl.
 *************************/

/**
 * Material definitions for the chalice.
 */
const BOWL_MATERIAL_AMBIENT   = vec4(0.6, 0.5, 0.5, 1.0);
const BOWL_MATERIAL_DIFFUSE   = vec4(0.7, 0.7, 0.7, 1.0);
const BOWL_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const BOWL_MATERIAL_SHININESS = 30.0;

/**
 * Vertices composing a slice of the bowl.
 */
const BOWL_VERTICES = [
	vec3(0  , 0  , 0), // A
	vec3(2  , 0  , 0), // B
	vec3(3  , 0.5, 0), // C
	vec3(4  , 2.8, 0), // D
	vec3(3.8, 2.8, 0), // E
	vec3(2.8, 0.5, 0), // F
	vec3(2  , 0.1, 0), // G
	vec3(0  , 0.1, 0), // H
];

// Number of vertical slices composing the bowl.
const NUM_BOWL_SLICES = 8;

// Number of vertices composing the bowl.
const NUM_BOWL_VERTICES = (BOWL_VERTICES.length - 1) * NUM_BOWL_SLICES * 6;

/**
 * Draw the bowl whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the bowl.
 * @param {vec3}   t      - The vector by which to translate the bowl.
 * @param {vec3}   r      - The vector by which to rotate the bowl.
 * @param {vec3}   s      - The vector by which to scale the bowl.
 */
function drawBowl(offset, t, r, s) {
	let [tx, ty, tz] = t;
	let [theta, rx, ry, rz] = r;
	let [sx, sy, sz] = s;

	setMaterial(
		BOWL_MATERIAL_AMBIENT, BOWL_MATERIAL_DIFFUSE, 
		BOWL_MATERIAL_SPECULAR, BOWL_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta, rx, ry, rz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	gl.drawArrays(gl.TRIANGLES, offset, NUM_BOWL_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

/**********************************
 * Definitions for a candle holder.
 **********************************/

/**
 * Material definitions for the candle holder.
 */
const CANDLE_HOLDER_MATERIAL_AMBIENT   = vec4(0.2, 0.2, 0.2, 1.0);
const CANDLE_HOLDER_MATERIAL_DIFFUSE   = vec4(0.2, 0.2, 0.2, 1.0);
const CANDLE_HOLDER_MATERIAL_SPECULAR  = vec4(0.4, 0.4, 0.4, 1.0);
const CANDLE_HOLDER_MATERIAL_SHININESS = 30.0;

/**
 * Vertices composing a slice of the candle holder.
 */
const CANDLE_HOLDER_VERTICES = [
	vec3(0  , 0   , 0), // A
	vec3(1.5  , 0   , 0), // B
	vec3(2, 0.8   , 0), // C
	vec3(1.8, 0.8, 0),
	vec3(1.5, 0.5, 0),
	vec3(1, 0.5, 0),
	vec3(0.8, 0.8, 0),
	vec3(0.5, 2.5, 0),
	vec3(0.65, 3, 0),
	vec3(0.8, 4.7, 0),
	vec3(0.0, 4.7, 0),
];

// Number of vertical slices composing the candle holder.
const NUM_CANDLE_HOLDER_SLICES = 8;

// Number of vertices composing the candle holder.
const NUM_CANDLE_HOLDER_VERTICES = (CANDLE_HOLDER_VERTICES.length - 1) * NUM_CANDLE_HOLDER_SLICES * 6;

/**
 * Draw the candle holder whose vertices begin at `offset`.
 * @param {number} offset - The index in the global points array from which to
 *                          begin drawing the candle holder.
 * @param {vec3}   t      - The vector by which to translate the candle holder.
 * @param {vec3}   r      - The vector by which to rotate the candle holder.
 * @param {vec3}   s      - The vector by which to scale the candle holder.
 */
function drawCandleHolder(offset, t, r, s) {
	let [tx, ty, tz] = t;
	let [theta, rx, ry, rz] = r;
	let [sx, sy, sz] = s;

	setMaterial(
		CANDLE_HOLDER_MATERIAL_AMBIENT, CANDLE_HOLDER_MATERIAL_DIFFUSE, 
		CANDLE_HOLDER_MATERIAL_SPECULAR, CANDLE_HOLDER_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta, rx, ry, rz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	gl.drawArrays(gl.TRIANGLES, offset, NUM_CANDLE_HOLDER_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

/**
 * Return the points composing the surface of revolution resulting from the
 * polyline composed by `vertices`. The surface is composed of `numSlices`.
 * @param {Array} vertices  - The points composing the polyline.
 * @param {num}   numSlices - The number of slices to composed the surface by.
 * @returns The list of vertices (mesh) modeling the surface of revolution.
 *          The length of the returned list is:
 *          `numSlices * (vertices.length - 1) * 6`
 */
function generateSurfaceOfRevolution(vertices, numSlices) {
	const NUM_VERTICES = vertices.length;
	const TEX_COORDS = [
		[0, 1],
		[0, 0],
		[1, 1],
		[1, 0]
	];

	let revolvedVertices = [];
	let faces = [];

	// Initialize our initial list of vertices to revolve.
	for (let i = 0; i < NUM_VERTICES; i++) {
		let [x, y, z] = vertices[i];
		revolvedVertices.push(vec4(x, y, z, 1));
	}

	// Revolve our list of vertices `numSlices` times about the y-axis,
	// incrementing the rotation so as to create a close "shell".
	let rotationInc = 360.0 / numSlices * (Math.PI / 180.0);
	for (let j = 0; j < numSlices; j++) {
		let angle = (j + 1) * rotationInc;

		// Compute and append the rotated set of vertices.
		for (let i = 0; i < NUM_VERTICES; i++) {	
			let radius = revolvedVertices[i][0];
			let x = radius * Math.cos(angle);
			let y = revolvedVertices[i][1];
			let z = -radius * Math.sin(angle);

			revolvedVertices.push(vec4(x, y, z, 1));
		}    	
	}

	// Form the quad strips slice-by-slice (not layer by layer).
	//
	//          ith slice      (i+1)th slice
	//            i*N+(j+1)-----(i+1)*N+(j+1)
	//               |              |
	//               |              |
	//            i*N+j --------(i+1)*N+j
	//
	// Each quad is defined in counter-clockwise rotation of the vertices.
	let texCoords = [];
	let numLayers = NUM_VERTICES - 1;
	for (let i = 0; i < numSlices; i++) { // slices
		for (let j = 0; j < numLayers; j++) { // layers
			let a = i * NUM_VERTICES + j;
			let b = (i + 1) * NUM_VERTICES + j;
			let c = (i + 1) * NUM_VERTICES + (j + 1);
			let d = i * NUM_VERTICES + (j + 1);

			/*
			 * Push vertices and related textures to arrays.
			 */
			faces.push(revolvedVertices[a]); texCoords.push(TEX_COORDS[0]);
			faces.push(revolvedVertices[b]); texCoords.push(TEX_COORDS[1]);
			faces.push(revolvedVertices[c]); texCoords.push(TEX_COORDS[2]);

			faces.push(revolvedVertices[a]); texCoords.push(TEX_COORDS[0]);
			faces.push(revolvedVertices[c]); texCoords.push(TEX_COORDS[2]);
			faces.push(revolvedVertices[d]); texCoords.push(TEX_COORDS[3]);
		}
	}    

	return [faces, texCoords];
}
