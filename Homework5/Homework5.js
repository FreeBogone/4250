// Homework 5
// Bowen Truelove
// 10/30/2024
// Dr. Cen Li

//A.I. Disclaimer: All work for this assignment was completed by myself and entirely without 
//the use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc

var gl, program, canvas;

var projectionMatrix;
var projectionMatrixLoc;
var modelviewMatrix;
var modelviewMatrixLoc;

var xrot = 0;
var yrot = 0;
var zrot = 0;
var deg = 5;

var dtindex = 1;
var cfindex = 2;

var points = [];
var texCoords = [];

var textures = [];
var textureFiles = ['sand.jpg', 'stone.jpg', 'paint.jpg', 'wood.jpg'];
var texturesLoaded = 0;

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var zoom = 1.0;



function main() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    GeneratePoints();

    ConfigWebGL();
    PassInfoToGPU();
    
    // Load all textures before starting render
    for (var i = 0; i < textureFiles.length; i++) {
        loadTexture(i, textureFiles[i]);
    }

    SetupUserInterface();
}

function loadTexture(index, src) {
    // Load a texture and store it in the textures array
    var texture = gl.createTexture();
    textures[index] = texture;
    texture.image = new Image();
    texture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        texturesLoaded++;
        if (texturesLoaded === textureFiles.length) {
            // Start rendering only after all textures are loaded
            render();
        }
    }
    texture.image.src = src;
}

function scale4(a, b, c) {
    // returns a scaling matrix
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function ConfigWebGL() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
}

function SetupUserInterface() {

    //event handling for keyboard and mouse
    window.onkeydown = HandleKeyboard;
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    canvas.onwheel = handleMouseWheel;
}

function HandleKeyboard(event) {
    // rotate with arrow keys
    switch (event.keyCode) {
        case 37: yrot -= deg; break;
        case 39: yrot += deg; break;
        case 38: xrot -= deg; break;
        case 40: xrot += deg; break;
    }
}

function handleMouseDown(event) {
    // rotate with mouse
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    // stop rotating with mouse
    mouseDown = false;
}

function handleMouseMove(event) {
    // rotate with mouse
    if (!mouseDown) {
        return;
    }

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    xrot += deltaY * 0.5;
    yrot += deltaX * 0.5;

    lastMouseX = newX;
    lastMouseY = newY;
}

function handleMouseWheel(event) {
    //zoom with mouse wheel
    zoom += event.deltaY * -0.01;
    zoom = Math.min(Math.max(0.1, zoom), 10);
}

function PassInfoToGPU() {
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modelviewMatrixLoc = gl.getUniformLocation(program, "modelviewMatrix");
}

function GeneratePoints() {


    //generate points for the tetrahedrons vertices
    var a = vec3(0, 0, 1);
    var b = vec3(0, 1, -1);
    var c = vec3(1, -1, -1);
    var d = vec3(-1, -1, -1);

    //push points for the tetrahedrons faces
    points.push(a, b, c);
    texCoords.push(vec2(0.5, 1), vec2(0, 0), vec2(1, 0));

    points.push(a, c, d);
    texCoords.push(vec2(0.5, 1), vec2(1, 0), vec2(0, 0));

    points.push(a, d, b);
    texCoords.push(vec2(0.5, 1), vec2(0, 0), vec2(1, 0));

    points.push(b, d, c);
    texCoords.push(vec2(0.5, 1), vec2(0, 0), vec2(1, 0));
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.frontFace(gl.CCW);

    // Set up the projection matrix
    projectionMatrix = ortho(-100 * zoom, 100 * zoom, -100 * zoom, 100 * zoom, -100, 100);

    // Set up the modelview matrix
    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 1, 0);
    modelviewMatrix = mult(r1, r2);

    // Set up the modelview matrix
    modelviewMatrix = mat4();
    modelviewMatrix = mult(modelviewMatrix, rotate(xrot, [1, 0, 0]));
    modelviewMatrix = mult(modelviewMatrix, rotate(yrot, [0, 1, 0]));
    modelviewMatrix = mult(modelviewMatrix, translate(0, 0, -50));
    modelviewMatrix = mult(modelviewMatrix, scale4(40, 40, 40));

    // Pass the matrices to the shader
    gl.uniformMatrix4fv(modelviewMatrixLoc, false, flatten(modelviewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Set the depth test
    if (dtindex == 1) gl.enable(gl.DEPTH_TEST);
    else if (dtindex == 2) gl.disable(gl.DEPTH_TEST);

    // draw shape
    for (var i = 0; i < 4; i++) {
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.drawArrays(gl.TRIANGLES, i * 3, 3);
    }

    requestAnimFrame(render);
}