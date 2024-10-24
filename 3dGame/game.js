// draw a 3D cube and allow player movement like a first-person shooter
var gl, program, canvas;

var projectionMatrix;
var projectionMatrixLoc;
var modelviewMatrix;
var modelviewMatrixLoc;

var xrot = 0;
var yrot = 0;
var zrot = 0;
var deg = 5;

var playerPos = [0, 0, 5]; // Player's position
var moveSpeed = 0.1; // Movement speed
var mouseSensitivity = 0.1; // Mouse sensitivity

var keys = {}; // Object to track key states

// start with normal view
var dtindex = 1;  // enable depth test
var cfindex = 2;  // disable cull face, disabled by default webgl/opengl

var points = [];
var colors = [];

function main() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    GeneratePoints();

    ConfigWebGL();

    PassInfoToGPU();

    SetupUserInterface();

    render();
}

function ConfigWebGL() {
    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
}

function PassInfoToGPU() {
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modelviewMatrixLoc = gl.getUniformLocation(program, "modelviewMatrix");
}

function SetupUserInterface() {
    // support user interface
    document.getElementById("xrotPlus").onclick = function() { xrot += deg; };
    document.getElementById("xrotMinus").onclick = function() { xrot -= deg; };
    document.getElementById("yrotPlus").onclick = function() { yrot += deg; };
    document.getElementById("yrotMinus").onclick = function() { yrot -= deg; };

    document.getElementById("ToggleDepth").onclick = function() {
        if (dtindex == 1) dtindex = 2;
        else dtindex = 1;
    };

    document.getElementById("ToggleCull").onclick = function() {
        if (cfindex == 1) cfindex = 2;
        else cfindex = 1;
    };

    // keyboard handle
    window.onkeydown = function(event) { keys[event.keyCode] = true; };
    window.onkeyup = function(event) { keys[event.keyCode] = false; };

    // mouse handle
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
}

function lockChangeAlert() {
    if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
        document.addEventListener("mousemove", updateCameraRotation, false);
    } else {
        document.removeEventListener("mousemove", updateCameraRotation, false);
    }
}

function updateCameraRotation(event) {
    var movementX = event.movementX || event.mozMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || 0;

    yrot += movementX * mouseSensitivity;
    xrot -= movementY * mouseSensitivity;

    // Clamp the x rotation to prevent flipping
    xrot = Math.max(-90, Math.min(90, xrot));
}

function HandleMovement() {
    var forward = vec3(Math.sin(radians(yrot)), 0, Math.cos(radians(yrot)));
    var right = vec3(Math.cos(radians(yrot)), 0, -Math.sin(radians(yrot)));

    if (keys[87]) { // W key
        playerPos = add(playerPos, scale(moveSpeed, forward));
    }
    if (keys[83]) { // S key
        playerPos = subtract(playerPos, scale(moveSpeed, forward));
    }
    if (keys[65]) { // A key
        playerPos = subtract(playerPos, scale(moveSpeed, right));
    }
    if (keys[68]) { // D key
        playerPos = add(playerPos, scale(moveSpeed, right));
    }
}

function GeneratePoints() {
    var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  0.5),
        vec3( 0.5,  0.5,  0.5),
        vec3( 0.5, -0.5,  0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5,  0.5, -0.5),
        vec3( 0.5,  0.5, -0.5),
        vec3( 0.5, -0.5, -0.5)
    ];

    var indices = [
        1, 0, 3, 1, 3, 2,  // front face
        2, 3, 7, 2, 7, 6,  // right face
        3, 0, 4, 3, 4, 7,  // bottom face
        6, 5, 1, 6, 1, 2,  // top face
        4, 5, 6, 4, 6, 7,  // back face
        5, 4, 0, 5, 0, 1   // left face
    ];

    var faceColors = [
        [1.0, 0.0, 0.0],  // front face
        [0.0, 1.0, 0.0],  // right face
        [0.0, 0.0, 1.0],  // bottom face
        [1.0, 1.0, 0.0],  // top face
        [1.0, 0.0, 1.0],  // back face
        [0.0, 1.0, 1.0]   // left face
    ];

    for (var i = 0; i < indices.length; i++) {
        points.push(vertices[indices[i]]);
        colors.push(faceColors[Math.floor(i / 6)]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.frontFace(gl.CCW); // designate CCW to front facing (default)

    projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100.0);

    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 1, 0);
    var t = translate(-playerPos[0], -playerPos[1], -playerPos[2]);
    modelviewMatrix = mult(r1, mult(r2, t));

    gl.uniformMatrix4fv(modelviewMatrixLoc, false, flatten(modelviewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // toggle Depth test: initially enabled  (i.e., dtindex=1 in the global setting)
    if (dtindex == 1)
        gl.enable(gl.DEPTH_TEST);
    else if (dtindex == 2)
        gl.disable(gl.DEPTH_TEST);

    // toggle face culling
    if (cfindex == 1) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);   // do not show back face
    } else if (cfindex == 2) {
        gl.disable(gl.CULL_FACE);
    }

    HandleMovement(); // Update player position based on key states

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    // Update the position label
    document.getElementById("position-label").innerText = `Position: (${playerPos[0].toFixed(2)}, ${playerPos[1].toFixed(2)}, ${playerPos[2].toFixed(2)})`;

    requestAnimFrame(render);
}