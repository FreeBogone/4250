/**
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 *
 * Definitions and drawing functions a sword drawn by extrusion.
 */

const TRAPEZOID_VERTICES = [
	vec4(-1, 0,  1, 1), // A
	vec4(-2, 0, -1, 1), // B
	vec4( 2, 0, -1, 1), // C
	vec4( 1, 0,  1, 1), // D
];


const HILT_VERTICES = [
	vec4(-1.0,  0.0,  1.0, 1), // A
	vec4(-1.0,  0.0, -1.0, 1), // B
	vec4( 1.0,  0.0, -1.0, 1), // C
	vec4( 1.5,  0.0, -0.5, 1), // D
	vec4( 5.0,  0.0, -0.5, 1), // E
	vec4( 6.0,  0.0,  0.5, 1), // F
	vec4( 5.5,  0.0,  1.0, 1), // G
	vec4( 5.0,  0.0,  0.5, 1), // H
	vec4( 1.5,  0.0,  0.5, 1), // I
	vec4( 1.0,  0.0,  1.0, 1), // J
];

const HILT_BODY_VERTICES = [
	HILT_VERTICES[A],
	HILT_VERTICES[B],
	HILT_VERTICES[C],
	HILT_VERTICES[D],
	HILT_VERTICES[I],
	HILT_VERTICES[J],
]

const HILT_ARM_VERTICES = [
	HILT_VERTICES[I],
	HILT_VERTICES[D],
	HILT_VERTICES[E],
	HILT_VERTICES[H],
];

const HILT_TIP_VERTICES = [
	HILT_VERTICES[H],
	HILT_VERTICES[E],
	HILT_VERTICES[F],
	HILT_VERTICES[G],
];

const BLADE_VERTICES = [
	vec4(0, 0, 9, 1),
	vec4(-1, 0, 7, 1),
	vec4(-1, 0, 0, 1),
	vec4(1, 0, 0, 1),
	vec4(1, 0, 7, 1),
];

const NUM_HILT_VERTICES = 132;
const NUM_PUMMEL_VERTICES = 36;
const NUM_HANDLE_VERTICES = 1728;
const NUM_BLADE_VERTICES = 48;

const NUM_SWORD_VERTICES = NUM_HILT_VERTICES + NUM_PUMMEL_VERTICES + NUM_HANDLE_VERTICES + NUM_BLADE_VERTICES;

/**
 * Blade material definitions.
 */
const BLADE_MATERIAL_AMBIENT   = vec4(0.8, 0.8, 0.8, 1.0);
const BLADE_MATERIAL_DIFFUSE   = vec4(0.8, 0.8, 0.8, 1.0);
const BLADE_MATERIAL_SPECULAR  = vec4(0.8, 0.8, 0.8, 1.0);
const BLADE_MATERIAL_SHININESS = 30.0;

/**
 * Hilt material definitions.
 */
const HILT_MATERIAL_AMBIENT   = vec4(0.8, 0.7, 0.3, 1.0);
const HILT_MATERIAL_DIFFUSE   = vec4(0.8, 0.7, 0.3, 1.0);
const HILT_MATERIAL_SPECULAR  = vec4(0.4, 0.4, 0.4, 1.0);
const HILT_MATERIAL_SHININESS = 30.0;

/**
 * Handle material definitions.
 */
const HANDLE_MATERIAL_AMBIENT   = vec4(0.4, 0.3, 0.1, 1.0);
const HANDLE_MATERIAL_DIFFUSE   = vec4(0.4, 0.3, 0.1, 1.0);
const HANDLE_MATERIAL_SPECULAR  = vec4(0.2, 0.2, 0.2, 1.0);
const HANDLE_MATERIAL_SHININESS = 30.0;

function generateSwordVertices() {
	let vertices = [];

	let pummelVertices = generatePummelVeritces();
	let [handleVertices, ] = generateCylinderVertices(1.0, 1.0);
	let hiltVertices = generateHiltVeritces();
	let bladeVertices = generateBladeVertices();
	vertices = vertices.concat(pummelVertices, handleVertices, hiltVertices, bladeVertices);

	return vertices;
}

function generateHiltVeritces() {
	let vertices = [];

	let extrudedBody = generatedExtrudedVertices(HILT_BODY_VERTICES, 1.0);
	let extrudedArm = generatedExtrudedVertices(HILT_ARM_VERTICES, 1.0);
	let extrudedTip = generatedExtrudedVertices(HILT_TIP_VERTICES, 1.0);
	vertices = vertices.concat(extrudedBody, extrudedArm, extrudedTip);

	return vertices;
}

function generatePummelVeritces() {
	return generatedExtrudedVertices(TRAPEZOID_VERTICES, 1.0);
}

function generateBladeVertices() {
	return generatedExtrudedVertices(BLADE_VERTICES, 1.0);
}

function drawPummel(offset, t, s) {
	let [tx, ty, tz] = t;
	let [sx, sy, sz] = s;

	setMaterial(
		HILT_MATERIAL_AMBIENT, HILT_MATERIAL_DIFFUSE, 
		HILT_MATERIAL_SPECULAR, HILT_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, NUM_PUMMEL_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

function drawHilt(offset, t, s) {
	let [tx, ty, tz] = t;
	let [sx, sy, sz] = s;

	setMaterial(
		HILT_MATERIAL_AMBIENT, HILT_MATERIAL_DIFFUSE, 
		HILT_MATERIAL_SPECULAR, HILT_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, NUM_HILT_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

function drawBlade(offset, t, s) {
	let [tx, ty, tz] = t;
	let [sx, sy, sz] = s;

	setMaterial(
		BLADE_MATERIAL_AMBIENT, BLADE_MATERIAL_DIFFUSE, 
		BLADE_MATERIAL_SPECULAR, BLADE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	modelViewMatrix = mult(modelViewMatrix, translate(tx, ty, tz));
	modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, NUM_BLADE_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

function drawSword(offset) {
	matrixStack.push(modelViewMatrix);

	drawPummel(offset, vec3(0, 0.1, -5), vec3(0.8, 0.8, 0.8));
	offset += NUM_PUMMEL_VERTICES;

	setMaterial(
		HANDLE_MATERIAL_AMBIENT, HANDLE_MATERIAL_DIFFUSE, 
		HANDLE_MATERIAL_SPECULAR, HANDLE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 0.5, -2.5));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	drawCylinder(offset, vec3(0, -2.5, 0), vec3(0.8, 5, 0.4));
	modelViewMatrix = matrixStack.pop();

	offset += NUM_HANDLE_VERTICES;

	drawHilt(offset, vec3(0, 0, 0), vec3(1, 1, 1));
	drawHilt(offset, vec3(0, 0, 0), vec3(-1, 1, 1));
	offset += NUM_HILT_VERTICES;

	drawBlade(offset, vec3(0, 0.25, 1), vec3(1, 0.5, 3));
	offset += NUM_BLADE_VERTICES;

	modelViewMatrix = matrixStack.pop();

}
