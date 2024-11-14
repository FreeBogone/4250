/**
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 *
 * Definitions and drawing functions for a chest.
 */

/**
 * Chest material definitions.
 */
const CHEST_MATERIAL_AMBIENT   = vec4(0.5, 0.5, 0.5, 1.0);
const CHEST_MATERIAL_DIFFUSE   = vec4(0.5, 0.5, 0.5, 1.0);
const CHEST_MATERIAL_SPECULAR  = vec4(0.5, 0.5, 0.5, 1.0);
const CHEST_MATERIAL_SHININESS = 30.0;

/**
 * Chest vertex definitions.
 */
const CHEST_VERTICES = [
    vec4( 0, 0, 2, 1), // A
    vec4( 0, 2, 2, 1), // B
    vec4(-1, 3, 2, 1), // C
    vec4(-3, 3, 2, 1), // D
    vec4(-4, 2, 2, 1), // E
    vec4(-4, 0, 2, 1), // F
    vec4( 0, 0, 0, 1), // G
    vec4( 0, 2, 0, 1), // H
    vec4(-1, 3, 0, 1), // I
    vec4(-3, 3, 0, 1), // J
    vec4(-4, 2, 0, 1), // K
    vec4(-4, 0, 0, 1), // L

];
const NUM_CHEST_VERTICES = 60;

/**
 * Chest texture coordinate definitions, for the full shape.
 */
const CHEST_TEX_COORDS = [
	// Texture for triangle EFA.
	[159 / 512, 260 / 512], // E
	[30  / 512, 260 / 512], // F
	[30  / 512, 375 / 512], // A
	
	// Texture for triangle EAB.
	[159 / 512, 260 / 512], // E
	[30  / 512, 375 / 512], // A
	[160 / 512, 375 / 512], // B
	
	// Texture for triangle KLF
	[348 / 512, 258 / 512], // K
	[348 / 512, 126 / 512], // L
	[160 / 512, 126 / 512], // F
	
	// Texture for triangle KFE
	[348 / 512, 258 / 512], // K
	[160 / 512, 126 / 512], // F
	[160 / 512, 258 / 512], // E

	// Texture for triangle HGL
	[357 / 512, 372 / 512], // H
	[480 / 512, 372 / 512], // G
	[480 / 512, 260 / 512], // L
	
	// Texture for triangle HLK
	[357 / 512, 372 / 512], // H
	[480 / 512, 260 / 512], // L
	[357 / 512, 260 / 512], // L

	// Texture for triangle BAG
	[160 / 512, 372 / 512], // B
	[160 / 512, 508 / 512], // A
	[350 / 512, 508 / 512], // G
	
	// Texture for triangle BGH
	[160 / 512, 372 / 512], // B
	[350 / 512, 508 / 512], // G
	[350 / 512, 372 / 512], // H

	// Texture for triangle AFL
	[160 / 512, 8 / 512],   // A
	[160 / 512, 120 / 512], // F
	[350 / 512, 120 / 512], // L
	
	// Texture for triangle ALG
	[160 / 512, 8 / 512],   // A
	[350 / 512, 120 / 512], // L
	[350 / 512, 8 / 512],   // F

	// Texture for triangle CBH
	[165 / 512, 327 / 512], // C
	[165 / 512, 370 / 512], // B
	[348 / 512, 370 / 512], // H
	
	// Texture for triangle CHI
	[165 / 512, 327 / 512], // C
	[348 / 512, 370 / 512], // H
	[348 / 512, 327 / 512], // B

	// Texture for triangle DEB
	[156 / 512, 262 / 512], // D
	[130 / 512, 262 / 512], // E
	[130 / 512, 360 / 512], // B

	// Texture for triangle DBC
	[156 / 512, 262 / 512], // D
	[130 / 512, 360 / 512], // B
	[156 / 512, 360 / 512], // C
	
	// Texture for triangle JKE
	[348 / 512, 305 / 512], // J
	[348 / 512, 262 / 512], // K
	[165 / 512, 262 / 512], // E
	
	// Texture for triangle JED
	[348 / 512, 305 / 512], // J
	[165 / 512, 262 / 512], // E
	[165 / 512, 305 / 512], // D

	// Texture for triangle IHK
	[357 / 512, 370 / 512], // I
	[386 / 512, 370 / 512], // H
	[386 / 512, 263 / 512], // K

	// Texture for triangle IKJ
	[357 / 512, 370 / 512], // I
	[386 / 512, 263 / 512], // K
	[357 / 512, 263 / 512], // J
	
	// Texture for triangle DCI
	[162 / 512, 24 / 512],  // D
	[162 / 512, 104 / 512], // C
	[351 / 512, 104 / 512], // I
	
	// Texture for triangle DIJ
	[162 / 512, 24 / 512],  // D
	[351 / 512, 104 / 512], // I
	[351 / 512, 24 / 512], // J
];


/**
 * Return the vertices composing a chest.
 */
function generateChestVertices() {
	let chestVertices = [];

	/*
	 * Build out the walls.
	 */
	chestVertices = chestVertices.concat(chestQuad(E, F, A, B));
	chestVertices = chestVertices.concat(chestQuad(K, L, F, E));
	chestVertices = chestVertices.concat(chestQuad(H, G, L, K));
	chestVertices = chestVertices.concat(chestQuad(B, A, G, H));

	/*
	 * The "floor" of the chest.
	 */
	chestVertices = chestVertices.concat(chestQuad(A, F, L, G));


	/*
	 * Build out the "top" walls.
	 */
	chestVertices = chestVertices.concat(chestQuad(C, B, H, I));
	chestVertices = chestVertices.concat(chestQuad(D, E, B, C));
	chestVertices = chestVertices.concat(chestQuad(J, K, E, D));
	chestVertices = chestVertices.concat(chestQuad(I, H, K, J));

	/*
	 * The "ceiling" of the chest.
	 */
	chestVertices = chestVertices.concat(chestQuad(D, C, I, J));

	return [chestVertices, CHEST_TEX_COORDS];
}

/**
 * Return the vertices composing a quad.
 */
function chestQuad(a, b, c, d) {
	let quadVertices = [];

	quadVertices.push(CHEST_VERTICES[a]); 
	quadVertices.push(CHEST_VERTICES[b]); 
	quadVertices.push(CHEST_VERTICES[c]); 

	quadVertices.push(CHEST_VERTICES[a]);  
	quadVertices.push(CHEST_VERTICES[c]); 
	quadVertices.push(CHEST_VERTICES[d]); 

	return quadVertices;
}

/**
 * Draw a chest.
 * @param {number} offset The index in the global arrays at which the properties
 *                        for the chest begin.
 */
function drawChest(offset) {
	setMaterial(
		CHEST_MATERIAL_AMBIENT, CHEST_MATERIAL_DIFFUSE, 
		CHEST_MATERIAL_SPECULAR, CHEST_MATERIAL_SHININESS
	);
	matrixStack.push(modelViewMatrix);

	// Center the chest's origin.
	modelViewMatrix = mult(modelViewMatrix, translate(2, -1.5, -1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	gl.drawArrays(gl.TRIANGLES, offset, NUM_CHEST_VERTICES);

	modelViewMatrix = matrixStack.pop();
}
