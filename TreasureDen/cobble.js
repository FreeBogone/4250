/**
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 *
 * Definitions and drawing functions for cobble walls or stones.
 */

/**
 * Cobble material definitions.
 */
const COBBLE_MATERIAL_AMBIENT   = vec4(0.5, 0.5, 0.5, 1.0);
const COBBLE_MATERIAL_DIFFUSE   = vec4(0.5, 0.5, 0.5, 1.0);
const COBBLE_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const COBBLE_MATERIAL_SHININESS = 30.0;

// Offset between individual stones of cobble.
const COBBLESTONE_OFFSET = 5;

/**
 * Draw a cobblestone wall.
 * @param {number} offset The index in the global points array at which the
 *                        cobblestone's vertices begin.
 * @param {number} width  The width of the wall, in stones.
 * @param {number} height The height of the wall, in stones.
 */
function drawCobblestoneWall(offset, width, height) {
	const WIDTH = 16;
	const HEIGHT = 8;

	setMaterial(
		COBBLE_MATERIAL_AMBIENT, COBBLE_MATERIAL_DIFFUSE, 
		COBBLE_MATERIAL_SPECULAR, COBBLE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	// Position and render each stone along the wall.
	let xOffset = COBBLESTONE_OFFSET;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			matrixStack.push(modelViewMatrix);

			// Compute offsets of the current stone.
			let xPos = x * WIDTH + xOffset;
			let yPos = y * HEIGHT;

			modelViewMatrix = mult(modelViewMatrix, translate(xPos, yPos, 0));
			drawCobblestone(offset);

			modelViewMatrix = matrixStack.pop();
		}

		xOffset *= -1;	
	}

	modelViewMatrix = matrixStack.pop();
}

/**
 * Draw a cobblestone.
 * @param {number} offset The index in the global points array at which the
 *                        cobblestone's vertices begin.
 */
function drawCobblestone(offset) {
	matrixStack.push(modelViewMatrix);

	/*
	 * These center the brick at its origin while scaled and rotated.
	 */
	modelViewMatrix = mult(modelViewMatrix, scale4(7.5, 3.5, 0.5));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
	modelViewMatrix = mult(modelViewMatrix, translate(0, -2.5, 0));

	// Draw the brick.
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, NUM_COBBLE_VERTICES);

	modelViewMatrix = matrixStack.pop();
}

/**
 * Return the vertices composing a column.
 */
function generateColumnVertices() {
	let texCoords = [];
	for (let i = 0; i < 6; i++)
		texCoords = texCoords.concat(CUBE_TEX_COORDS);

	return [CUBE_FACES, texCoords];
}

/**
 * Draw a column.
 * @param {number} offset The index in the global points array at which the
 *                        column's vertices begin.
 */
function drawColumn(offset) {
	drawCube(offset, vec3(0, 8, 0), vec3(6, 30, 6));

	drawCube(offset, vec3(0, -12, 0), vec3(7, 5, 7));
	drawCube(offset, vec3(0, -1, 0), vec3(7, 5, 7));
	drawCube(offset, vec3(0, 10, 0), vec3(7, 5, 7));
	drawCube(offset, vec3(0, 21, 0), vec3(7, 5, 7));
	drawCube(offset, vec3(0, 32, 0), vec3(7, 5, 7));

	drawCube(offset, vec3(0, -20.5, 0), vec3(8, 2.5, 8));
}
