/**
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 *
 * Vertex and face definitions and drawing functions for a shrine/pedestal.
 */

/**
 * Material definitions for the shrine/pedestal.
 */
const SHRINE_MATERIAL_AMBIENT   = vec4(0.5, 0.5, 0.5, 1.0);
const SHRINE_MATERIAL_DIFFUSE   = vec4(0.5, 0.5, 0.5, 1.0);
const SHRINE_MATERIAL_SPECULAR  = vec4(0.3, 0.3, 0.3, 1.0);
const SHRINE_MATERIAL_SHININESS = 10.0;

/**
 * Scale and offsets for the columns composing the shrine.
 */
const SHRINE_COLUMN_SCALE  = vec3(2.0, 16.0, 2.0);
const SHRINE_COLUMN_OFFSET = vec3(2, -8, 2);

const NUM_SHRINE_VERTICES = CUBE_FACES.length + 1728;

/**
 * Return the vertices composing a shrine or pedestal.
 * @returns The vertices composing a shrine or pedestal.
 */
function generateShrineVertices() {
	let vertices = [];
	let texCoords = [];

	vertices = vertices.concat(CUBE_FACES);
	for (let i = 0; i < 6; i++)
		texCoords = texCoords.concat(CUBE_TEX_COORDS);

	let [cylinderVertices, cylinderTexCoords] = generateCylinderVertices(1.0, 1.0);
	vertices = vertices.concat(cylinderVertices);
	texCoords = texCoords.concat(cylinderTexCoords);

	return [vertices, texCoords];
}

/**
 * Draw a three-dimensional shrine or pedestal.
 * @param {number} offset The index in the global points array at which the
 *                        shrine or pedestal's vertices begin.
 */
function drawShrine(offset) {
	setMaterial(
		SHRINE_MATERIAL_AMBIENT, SHRINE_MATERIAL_DIFFUSE, 
		SHRINE_MATERIAL_SPECULAR, SHRINE_MATERIAL_SHININESS
	);

	/*
	 * Model the trim at the base of the pedestal.
	 */
	drawCube(offset, vec3(0, -8.5, 0), vec3(5.5, 0.5, 5.5));

	/*
	 * Model the base of the pedestal.
	 */
	drawCube(offset, vec3(0, -11, 0), vec3(6, 2.0, 6));

	/*
	 * Model the secondary base of the pedestal.
	 */
	drawCube(offset, vec3(0, -7.5, 0), vec3(5.0, 1.5, 5.0));

	/*
	 * Model the base above which the heart floats.
	 */
	drawCube(offset, vec3(0, 8, 0), vec3(6.0, 1.0, 6.0));

	/*
	 * Model the trim of the base above which the heart floats.
	 */
	drawCube(offset, vec3(0, 9.2, 0), vec3(5.5, 0.2, 5.5));
	offset += CUBE_FACES.length;

	/*
	 * Model the columns of the pedestal.
	 */
	let [offsetX, offsetY, offsetZ] = SHRINE_COLUMN_OFFSET;
	drawCylinder(offset, vec3( offsetX, offsetY,  offsetZ), SHRINE_COLUMN_SCALE);
	drawCylinder(offset, vec3( offsetX, offsetY, -offsetZ), SHRINE_COLUMN_SCALE);
	drawCylinder(offset, vec3(-offsetX, offsetY, -offsetZ), SHRINE_COLUMN_SCALE);
	drawCylinder(offset, vec3(-offsetX, offsetY,  offsetZ), SHRINE_COLUMN_SCALE);
}
