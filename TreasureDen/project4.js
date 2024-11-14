/*
 * Carlos Aldana Lira
 * Kaleb Miller
 * CSCI 4250-D01
 * Project 4.3
 *
 * Render a 3D dungeon scene with material, lighting, and textures. Press "a"
 * to animate a heart atop a pedestal and play music. Press "b" to reset the
 * scene. The user can move, pan, and zoom the camera using the left, right,
 * and scroll mouse buttons, respectively.
 *
 * PART I OBJECTS
 * ==============
 * Heart    (polygonal mesh) - Carlos Aldana Lira
 * Pedestal (composite)      - Carlos Aldana Lira
 * Chest    (polygonal mesh) - Kaleb Miller
 * Table    (composite)      - Kaleb Miller
 *
 * PART II OBJECTS
 * ===============
 * Sword   (extruded shape)                      - Carlos Aldana Lira
 * Pot     (surface of revolution)               - Carlos Aldana Lira
 * Chalice (other object, surface of revolution) - Carlos Aldana Lira
 *
 * PART III OBJECTS
 * ===============
 * Bowl          (surface of revolution)  - Kaleb Miller
 * Candle        (surface of revolution)  - Carlos Aldana Lira
 * Candle Holder (surface of revolution)  - Carlos Aldana Lira
 */

/*
 * Constants controlling the orthographic projection bounds.
 */
const ORTHO_Y_MAX =  8;
const ORTHO_Y_MIN = -8;
const ORTHO_X_MAX =  8;
const ORTHO_X_MIN = -8;
const ORTHO_NEAR  = -100;
const ORTHO_FAR   =  100;

/**
 * Constants defining the absence of transformation when necessary.
 */
const NO_TRANSLATE = vec3(0, 0, 0);
const NO_ROTATE    = vec4(0, 0, 0, 1);
const NO_SCALE     = vec3(1, 1, 1);

/**
 * Light property definitions.
 */
const LIGHT_AMBIENT  = vec4(0.2, 0.1, 0.0, 1.0);
const LIGHT_DIFFUSE  = vec4(0.5, 0.5, 0.5, 1.0);
const LIGHT_SPECULAR = vec4(0.4, 0.4, 0.4, 1.0);
const LIGHT_POSTIION = vec4(30, 40, 40, 0.0);

// Point at which the camera looks.
const LOOK_AT_POINT = vec3(0, 0, 0);
// The relative "up" direction for the camera.
const UP_DIRECTION  = vec3(0, 1, 0);

// The number of points a face is assumed to be composed of.
const POINTS_PER_FACE = 3;

// Path to audio played when animation is playing.
const AUDIO_SRC_PATH = "./ludum-dare-32-track-5.wav";

// Paths to textures used in the program.
const TEXTURE_PATHS = [
	"./floor.jpg",
	"./white.png",
	"./stone.jpg",
	"./wood.jpg",
	"./metal.jpg",
	"./marble.jpg",
	"./pot.jpg",
	"./wax.jpg",
	"./chest.jpg"
];

// "Previous" time in milliseconds since the page was first loaded.
let then = 0.0;

// The "anchor" the heart bobs under and over during animation.
let heartAnchorY = 10.0;
// Frequency of the wave the heart bobs along during animation.
let heartFrequency = 0.01;
// Amplitude of the wave the heart bobs along during animation.
let heartAmplitude = 2.0;

let heartPos = vec3(9.0, heartAnchorY, -20);
let heartRotationDegrees = 0.0;
let heartRotationIncrement = 45.0;

/**
 * Local WebGL state variables.
 */
let canvas, program;

let pointsArray = [];
let normalsArray = [];
let textureCoords = [];

let projectionMatrix, projectionMatrixLoc;

let ambientProductLoc, diffuseProductLoc, specularProductLoc;
let lightPositionLoc, shininessLoc;

/**
 * Global WebGL state variables.
 */
var gl;
var modelViewMatrix, modelViewMatrixLoc;
var matrixStack = [];

// Shape used to outline the segment of the texture we want to draw.
const TEXTURE_SHAPE = [ vec2(0.5), vec2(1, 1), vec2(0, 1) ];

/**
 * A scene's global state.
 */
class GlobalState {
	constructor() {
		this.reset();
	}

	/**
	 * Reset the scene's global state.
	 */
	reset() {
		// Properties controlling the camera's zoom and position.
		this.zoomFactor = 8;
		this.translateX = 0;
		this.translateY = 0;

		// Properties controlling the camera's rotation around a point.
		this.phi = 1;
		this.theta = 0.5;
		this.radius = 8;
		this.dr = 2.0 * Math.PI / 180.0;

		// Whether the corresponding mouse button is pressed.
		this.mouseDownRight = false;
		this.mouseDownLeft = false;

		// The mouse's position on clicking either button.
		this.mousePosOnClickX = 0;
		this.mousePosOnClickY = 0;

		// Whether to play the animation(s) in the current frame.
		this.playAnimation = false;

		// Properties controlling the heart.
		this.heartPos = vec3(9.0, heartAnchorY, -20);
		this.heartRotationDegrees = 0;
		this.timer = 0;

		// If this is the first time initializing the state, init audio.
		if (this.audio == null) {
			this.audio = document.createElement("audio");
			this.audio.src = AUDIO_SRC_PATH;
			this.audio.loop = true;
		}

		// Audio is non-null, so we can just reset its playback.
		this.audio.pause();
		this.audio.currentTime = 0;
	}

	/**
	 * Update the context's state.
	 */
	update(delta) {
		if (this.playAnimation) {
			/*
			 * Rotate the heart while it bobs up and down.
			 */
			this.heartRotationDegrees += heartRotationIncrement * delta;
			let heartYDelta = Math.sin(this.timer * heartFrequency) * heartAmplitude;
			this.heartPos[1] = heartAnchorY + (heartYDelta );

			testRotation += heartRotationIncrement * delta;

			this.timer += 1;
		} 
	}

	/**
	 * Toggle audio playback on and off.
	 */
	toggleAudio() {
		if (this.audio.paused)
			this.audio.play()
		else
			this.audio.pause();
	}
}

let context = new GlobalState();

function main() {
	// Retrieve the canvas and initialize the WebGL context.
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
		return;
	}

	// Initialize the vertices and normals of all drawable objects.
	initDrawables();

	// Initailize the WebGL context.
	initWebGL();

	// Initialize textures.
	initTextures();

	// Initialize the HTML elements.
	initHtmlButtons();
	initHtmlKeyControls();
	initHtmlMouseControls();

	requestAnimationFrame(loop);
}

/**
 * Bind WebGL texture units to a set of textures.
 */
function initTextures() {
	let textures = []
	for (let i = 0; i < TEXTURE_PATHS.length; i++) {
		let texture = gl.createTexture();
		let path = TEXTURE_PATHS[i];

		// Load and bind the texture.
		texture.image = new Image();
		texture.image.src = path;
		texture.image.onload = function() { loadTexture(texture, gl.TEXTURE0 + i) };

		textures.push(texture);
	}
}

/**
 * Populate the global points and normal arrays with those of all drawable objects.
 */
function initDrawables() {
	/*
	 * Add vertices, normals, and textures for the walls.
	 */
	let wallVertices = generateWallVertices();
	let wallNormals = generateNormals(wallVertices);
	let wallTexCoords = generateWallTexCoords();
	pointsArray = pointsArray.concat(wallVertices);
	normalsArray = normalsArray.concat(wallNormals);
	textureCoords = textureCoords.concat(wallTexCoords);

	/*
	 * Add vertices, normals, and textures for the heart.
	 */
	pointsArray = pointsArray.concat(HEART_FACES);
	for (let i = 0; i < HEART_FACES.length; i += 3) {
		textureCoords = textureCoords.concat(TEXTURE_SHAPE);
	}
	let heartNormals = generateNormals(HEART_FACES);
	normalsArray = normalsArray.concat(heartNormals);

	/*
	 * Add vertices, normals, and textures for the pedestal.
	 */
	let [shrinePoints, shrineTexCoords] = generateShrineVertices();
	let shrineNormals = generateNormals(shrinePoints);
	textureCoords = textureCoords.concat(shrineTexCoords);
	pointsArray = pointsArray.concat(shrinePoints);
	normalsArray = normalsArray.concat(shrineNormals);

	/*
	 * Add vertices, normals, and textures for the pot.
	 */
	let [potPoints, potTexCoords] = generateSurfaceOfRevolution(POT_VERTICES, NUM_POT_SLICES);
	let potNormals = generateNormals(potPoints);
	textureCoords = textureCoords.concat(potTexCoords);
	pointsArray = pointsArray.concat(potPoints);
	normalsArray = normalsArray.concat(potNormals);

	/*
	 * Add vertices, normals, and textures for the chest.
	 */
	let [chestPoints, chestTexCoords] = generateChestVertices();
	let chestNormals = generateNormals(chestPoints);
	textureCoords = textureCoords.concat(chestTexCoords);
	pointsArray = pointsArray.concat(chestPoints);
	normalsArray = normalsArray.concat(chestNormals);

	/*
	 * Add vertices, normals, and textures for the sword.
	 */
	let swordPoints = generateSwordVertices();
	for (let i = 0; i < swordPoints.length; i += 3) {
		textureCoords = textureCoords.concat(TEXTURE_SHAPE);
	}
	let swordNormals = generateNormals(swordPoints);
	pointsArray = pointsArray.concat(swordPoints);
	normalsArray = normalsArray.concat(swordNormals);

	/*
	 * Add vertices, normals, and textures for the chalice.
	 */
	let [chalicePoints, chaliceTexCoords] = generateSurfaceOfRevolution(CHALICE_VERTICES, NUM_CHALICE_SLICES);
	let chaliceNormals = generateNormals(chalicePoints);
	textureCoords = textureCoords.concat(chaliceTexCoords);
	pointsArray = pointsArray.concat(chalicePoints);
	normalsArray = normalsArray.concat(chaliceNormals);

	/*
	 * Add vertices, normals, and textures for the cobblestone.
	 */
	let cobblePoints = generatedExtrudedVertices(EXTRUDED_CUBE_VERTICES, 20.0);
	for (let i = 0; i < 6; i += 1) {
		textureCoords = textureCoords.concat(EXTRUDED_CUBE_TEX_COORDS);
	}
	let cobbleNormals = generateNormals(cobblePoints);
	pointsArray = pointsArray.concat(cobblePoints);
	normalsArray = normalsArray.concat(cobbleNormals);

	/*
	 * Add vertices, normals, and textures for the columns.
	 */
	let [columnPoints, columnTexCoords] = generateColumnVertices();
	let columnNormals = generateNormals(columnPoints);
	textureCoords = textureCoords.concat(columnTexCoords);
	pointsArray = pointsArray.concat(columnPoints);
	normalsArray = normalsArray.concat(columnNormals);

	/*
	 * Add vertices, normals, and textures for the wall-trim.
	 */
	let [wallTrimPoints, wallTrimTexCoords] = generateWallTrimVertices();
	let wallTrimNormals = generateNormals(wallTrimPoints);
	textureCoords = textureCoords.concat(wallTrimTexCoords);
	pointsArray = pointsArray.concat(wallTrimPoints);
	normalsArray = normalsArray.concat(wallTrimNormals);

	/*
	 * Add vertices, normals, and textures for the table.
	 */
	let [tablePoints, tableTexCoords] = generateTableVertices();
	let tableNormals = generateNormals(tablePoints);
	textureCoords = textureCoords.concat(tableTexCoords);
	pointsArray = pointsArray.concat(tablePoints);
	normalsArray = normalsArray.concat(tableNormals);

	/*
	 * Add vertices, normals, and textures for the bowl.
	 */
	let [bowlPoints, bowlTexCoords] = generateSurfaceOfRevolution(BOWL_VERTICES, NUM_BOWL_SLICES);
	let bowlNormals = generateNormals(bowlPoints);
	textureCoords = textureCoords.concat(bowlTexCoords);
	pointsArray = pointsArray.concat(bowlPoints);
	normalsArray = normalsArray.concat(bowlNormals);

	/*
	 * Add vertices, normals, and textures for the candle holder.
	 */
	let [candleHolderPoints, candleHolderTexCoords] = generateSurfaceOfRevolution(CANDLE_HOLDER_VERTICES, NUM_CANDLE_HOLDER_SLICES);
	let candleHolderNormals = generateNormals(candleHolderPoints);
	textureCoords = textureCoords.concat(candleHolderTexCoords);
	pointsArray = pointsArray.concat(candleHolderPoints);
	normalsArray = normalsArray.concat(candleHolderNormals);

	/*
	 * Add vertices, normals, and textures for the candle.
	 */
	let [candlePoints, candleTexCoords] = generateCandleVertices();
	let candleNormals = generateNormals(candlePoints);
	textureCoords = textureCoords.concat(candleTexCoords);
	pointsArray = pointsArray.concat(candlePoints);
	normalsArray = normalsArray.concat(candleNormals);

}

/**
 * Initialize the global WebGL context and buffer generated vertex data.
 */
function initWebGL() {
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	//  Load shaders.
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Initialize the normal attribute buffer.
	let nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
	
	// Make normal attribute writable by buffer.
	let vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);

	// Initialize vertex attribute buffer.
	let vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	// Make vertex attribute writable by buffer.
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Initialize texture coordinate attribute buffer.
	let tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoords), gl.STATIC_DRAW);

	// Make texture coordinate attribute writable by buffer.
	let vTextureCoord = gl.getAttribLocation(program, "vTextureCoord");
	gl.vertexAttribPointer(vTextureCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vTextureCoord);

	// Retrieve addresses to model-view and projection matrices.
	modelViewMatrixLoc  = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

	// Retrieve addresses to light/shading properties.
	ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program, "specularProduct");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	
	// Set the position of the global light.
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(LIGHT_POSTIION));
}

/**
 * Initialize the keyboard controls for the HTML page.
 */
function initHtmlKeyControls() {
	window.addEventListener("keydown", (event) => {
		let code = event.code;
		
		// Toggle whether the animation(s) is playing by the `A` key.
		if (code == "KeyA") {
			context.playAnimation = !context.playAnimation;
			context.toggleAudio();
		}

		// Reset global state when the `B` key is pressed.
		if (code == "KeyB") {
			context.reset();
		}
	});
}

/**
 * Initialize the mouse controls for the HTML page.
 */
function initHtmlMouseControls() {
	// Zoom in and out in response to the mouse scroll wheel. `wheelDelta`
	// is the distance the wheel "rolled"; positive distance implies
	// scrolling up, negative distance implies scrolling down.
	canvas.addEventListener("wheel", function(e) {
		if (e.wheelDelta > 0) {
			context.zoomFactor = Math.max(0.1, context.zoomFactor - 0.1);
		} else {
			context.zoomFactor += 0.1;
		}
	});

	// When either mouse button is clicked, record which clicked and the
	// mouse's current position.
	canvas.addEventListener("mousedown", function(e) {
		if (e.which == 1) {
			context.mouseDownLeft = true;
			context.mouseDownRight = false;
			context.mousePosOnClickY = e.y;
			context.mousePosOnClickX = e.x;
		} else if (e.which == 3) {
			context.mouseDownRight = true;
			context.mouseDownLeft = false;
			context.mousePosOnClickY = e.y;
			context.mousePosOnClickX = e.x;
		}
	});

	// Reset mouse-click flags when either mouse button releases.
	document.addEventListener("mouseup", function(_) {
		context.mouseDownLeft = false;
		context.mouseDownRight = false;
	});

	// Whenever the mouse moves and one of the mouse buttons are pressed,
	// calculate and record the distance traveled from the point at which
	// the mouse button was initially clicked.
	document.addEventListener("mousemove", function(e) {
		if (context.mouseDownRight) {
			// Right-button clicks correspond to panning, so the
			// difference in position is used for translation.
			context.translateX += (e.x - context.mousePosOnClickX)/30;
			context.translateY -= (e.y - context.mousePosOnClickY)/30;

			context.mousePosOnClickY = e.y;
			context.mousePosOnClickX = e.x;
		} else if (context.mouseDownLeft) {
			// Left-button clicks correspond to shape rotation, so
			// the difference in position is used for rotation.
			context.phi += (e.x - context.mousePosOnClickX)/100;
			context.theta += (e.y - context.mousePosOnClickY)/100;

			context.mousePosOnClickX = e.x;
			context.mousePosOnClickY = e.y;
		}
	});
}

/**
 * Initialize the events necessary to respond to buttons on the HTML page.
 */
function initHtmlButtons() {
	// Increment theta when corresponding button is clicked.
	document.getElementById("thetaup").addEventListener("click", function(_) {
		context.theta += context.dr;
	});

	// Decrement theta when corresponding button is clicked.
	document.getElementById("thetadown").addEventListener("click", function(_) {
		context.theta -= context.dr;
	});
	
	// Increment phi when corresponding button is clicked.
	document.getElementById("phiup").addEventListener("click", function(_) {
		context.phi += context.dr;
	});

	// Decrement phi when corresponding button is clicked.
	document.getElementById("phidown").addEventListener("click", function(_) {
		context.phi -= context.dr;
	});

	// Toggle animation when corresponding button is clicked.
	document.getElementById("animate").addEventListener("click", function(_) {
		context.playAnimation = !context.playAnimation;
		context.toggleAudio();
	});

	// Reset the scene when corresponding button is clicked.
	document.getElementById("reset").addEventListener("click", function(_) {
		context.reset();
	});
}

/**
 * Load the given texture and its parameters such that it is correspondant
 * with the given WebGL texture unit.
 *
 * @param {Image}  texture      - The texture to load for rendering.
 * @param {number} whichTexture - The index of the texture unit to map to.
 */
function loadTexture(texture, whichTexture) {
	// Flip the image's y-axis.
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

	// Enable given texture unit.
	gl.activeTexture(whichTexture);

	// Bind the texture object to the target.
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture image.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

	// Set the texture parameters.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

/**
 * Configure WebGL to render objects according to given material properties.
 * @param {vec4}   ambient   The ambient material property.
 * @param {vec4}   diffuse   The diffuse material property.
 * @param {vec4}   specular  The specular material property.
 * @param {number} shininess The object's shininess property.
 */
function setMaterial(ambient, diffuse, specular, shininess) {
	// Compute the products given by the material.
	let ambientProduct  = mult(LIGHT_AMBIENT, ambient);
	let diffuseProduct  = mult(LIGHT_DIFFUSE, diffuse);
	let specularProduct = mult(LIGHT_SPECULAR, specular);

	// Write the new material properties into the vertex shader.
	gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
	gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
	gl.uniform4fv(specularProductLoc, flatten(specularProduct));
	gl.uniform1f(shininessLoc, shininess);
}

/**
 * Return the normal for the polygon represented by the given vertices.
 * @param {Array} List of vertices defining the polygon.
 * @returns The `vec3` representing the normal of the polygon.
 */
function newell(vertices) {
	let length = vertices.length;
	let x = 0, y = 0, z = 0;

	// Compute the normal for the polygon.
	for (let i = 0; i < length; i++) {
		let next = (i + 1) % length;

		x += (vertices[i][1] - vertices[next][1]) * (vertices[i][2] + vertices[next][2]);
		y += (vertices[i][2] - vertices[next][2]) * (vertices[i][0] + vertices[next][0]);
		z += (vertices[i][0] - vertices[next][0]) * (vertices[i][1] + vertices[next][1]);
	}

	// Return the normal, normalized.
	return normalize(vec3(x, y, z));
}

/**
 * Compute the scale matrix described by the scale factors.
 *
 * @param {number} sx - Factor by which to scale the x-axis.
 * @param {number} sy - Factor by which to scale the y-axis.
 * @param {number} sz - Factor by which to scale the z-axis.
 */
function scale4(sx, sy, sz) {
	let matrix = mat4();
	matrix[0][0] = sx;
	matrix[1][1] = sy;
	matrix[2][2] = sz;

	return matrix;
}

/**
 * Return the list of normals for the faces composed by the given vertices.
 * @param {Array} The list of vertices composed faces with `POINTS_PER_FACE`
 *                vertices each.
 * @returns The list of normals for the faces. Will be equivalent in length to
 *          the length of the given list of vertices.
 */
function generateNormals(vertices) {
	let normals = [];
	for (let i = 0; i < vertices.length; i+= POINTS_PER_FACE) {
		let facePoints = vertices.slice(i, i + POINTS_PER_FACE);
		let normal = newell(facePoints);

		// Push appropriate copies of normal into the array.
		for (let j = 0; j < POINTS_PER_FACE; j++)
			normals.push(normal);
	}

	return normals;
}

/**
 * Update and render the world forever.
 * @param {number} now - Time in milliseconds since the page was first loaded.
 */
function loop(now) {
	let delta = (now - then) / 1000.0;
	then = now;

	// Update and render the world.
	update(delta);
	render();

	requestAnimationFrame(loop);
}

let testRotation = 0;

/**
 * Update the world's state.
 * @param {number} delta - Time in seconds since the last frame was rendered.
 */
function update(delta) {
	// Compute the viewing volume based on the current zoom and mouse movements.
	projectionMatrix = ortho(
		ORTHO_X_MIN * context.zoomFactor - context.translateX,
		ORTHO_X_MAX * context.zoomFactor - context.translateX,
		ORTHO_Y_MIN * context.zoomFactor - context.translateY,
		ORTHO_Y_MAX * context.zoomFactor - context.translateY,
		ORTHO_NEAR, ORTHO_FAR
	);
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

	// Compute the position of the eye based on the user's rotation.
	// Essentially, compute the position of the eye as a point on a sphere.
	let eye = vec3(
		context.radius * Math.cos(context.phi),
		context.radius * Math.sin(context.theta),
		context.radius * Math.sin(context.phi)
	);

	// Set the position of the eye.
	modelViewMatrix = lookAt(eye, LOOK_AT_POINT, UP_DIRECTION);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	context.update(delta);
}

/**
 * Render the world.
 */
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Index into the `pointsArray` and `normalsArray`.
	let startIdx = 0;

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

	/*
	 * Draw the floor.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(3, -24, 3));
	modelViewMatrix = mult(modelViewMatrix, scale4(41, 1, 41));
	drawWall(startIdx);
	modelViewMatrix = matrixStack.pop();

	/*
	 * Draw the left-back wall.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-31, 8, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, scale4(34, 3, 32));
	drawWall(startIdx);
	modelViewMatrix = matrixStack.pop();

	/*
	 * Draw the right-back wall.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 8, -31));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, scale4(32, 3, 34));
	drawWall(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_WALL_VERTICES;

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

	/*
	 * Draw the heart.
	 */
	matrixStack.push(modelViewMatrix);
	let [heartX, heartY, heartZ] = context.heartPos;
	modelViewMatrix = mult(modelViewMatrix, translate(heartX, heartY, heartZ));
	modelViewMatrix = mult(modelViewMatrix, rotate(context.heartRotationDegrees, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 0.5));
	drawHeart(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += HEART_FACES.length;

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);

	/*
	 * Draw the shrine/pedestal.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(heartX, -10, heartZ));
	drawShrine(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_SHRINE_VERTICES;

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);

	/*
	 * Draw the pot.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-18, -14.5, 15));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	drawPot(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_POT_VERTICES 

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);

	/*
	 * Draw the chest.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-13, -15.5, -13));
	modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(4, 5, 10));
	drawChest(startIdx)
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_CHEST_VERTICES;

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);

	/*
	 * Draw the sword.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(20, 4.0, -25.5));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 1, 0, 0));
	drawSword(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_SWORD_VERTICES;

	/*
	 * Draw the chalice.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 1, 0));
	drawChalice(startIdx, vec3(20, -4.05, 0), vec4(85, 1, 0, 0), vec3(0.5, 0.5, 0.5));
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_CHALICE_VERTICES;

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);

	/*
	 * Draw the back-right cobblestone wall.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-20, -20, -35.7));
	drawCobblestoneWall(startIdx, 4, 8);
	modelViewMatrix = matrixStack.pop();

	/*
	 * Draw the back-left cobblestone wall.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-35.7, -20, 28));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	drawCobblestoneWall(startIdx, 4, 8);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_COBBLE_VERTICES;

	/*
	 * Draw the columns.
	 */
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-30, 0, -30));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	drawColumn(startIdx);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(36, 0, -30));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	drawColumn(startIdx);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-30, 0, 36));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	drawColumn(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_WALL_VERTICES;

	/*
	 * Draw the trim on the top of the walls.
	 */
	drawWallTrim(startIdx, vec3(4, 40, -30), NO_ROTATE, vec3(42, 4, 8));
	drawWallTrim(startIdx, vec3(-30, 40, 12), vec4(90, 0, 1, 0), vec3(34, 4, 8));

	startIdx += NUM_WALL_TRIM_VERTICES;

	/*
	 * Draw the table.
	 */
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
	drawTable(startIdx, vec3(15, -22.5, 15), NO_ROTATE, NO_SCALE);
	startIdx += 1728 + CUBE_FACES.length;

	/*
	 * Draw the bowl.
	 */
	drawBowl(startIdx, vec3(20, -6, 15), NO_ROTATE, NO_SCALE);
	startIdx += NUM_BOWL_VERTICES;

	/*
	 * Draw the candle holder.
	 */
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
	drawCandleHolder(startIdx, vec3(11, -6, 8), NO_ROTATE, NO_SCALE);
	startIdx += NUM_CANDLE_HOLDER_VERTICES;

	/*
	 * Draw the candle.
	 */
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
	drawCandle(startIdx, vec3(11, -1.3, 8), NO_ROTATE, NO_SCALE);
}
