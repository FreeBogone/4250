// draw a 3D cube
// experiment with depth test and cull face features in 3D drawing
var gl, program, canvas;

var projectionMatrix;
var projectionMatrixLoc;
var modelviewMatrix;
var modelviewMatrixLoc;

var xrot=0;
var yrot=0;
var zrot=0;
var deg=5;

// start with normal view
var dtindex=1;  // enable depth test
var cfindex=2;  // disable cull face, disabled by default webgl/opengl

var points = [];

function main() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    vertices = GeneratePoints();

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
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

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
    window.onkeydown = HandleKeyboard;
}

function HandleKeyboard(event) {
    switch (event.keyCode) {
        case 37:  // left cursor key
            yrot -= deg;
            break;
        case 39:  // right cursor key
            yrot += deg;
            break;
        case 38:  // up cursor key
            xrot -= deg;
            break;
        case 40:  // down cursor key
            xrot += deg;
            break;
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

    var points = [];
    for (var i = 0; i < indices.length; i++) {
        points.push(vertices[indices[i]]);
    }

    return points;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.frontFace(gl.CCW); // designate CCW to front facing (default)

    projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);

    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 1, 0);
    modelviewMatrix = mult(r1, r2);

    gl.uniformMatrix4fv(modelviewMatrixLoc, false, flatten(modelviewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // toggle Depth test: initially enabled  (i.e., dtindex=1 in the global setting)
    if (dtindex == 1)
        gl.enable(gl.DEPTH_TEST);
    else if (dtindex == 2)
        gl.disable(gl.DEPTH_TEST);

    // toggle face culling
    // initially disable face culling (i.e., initially cfindex=2 in the global setting)
    // WebGL/OpenGL disable face culling by default
    // enable face culling (i.e., not draw the bottom of the cube if it is away from the eye)
    if (cfindex == 1) {
        gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.BACK);   // do not show back face, default
        gl.cullFace(gl.FRONT);   // do not show front
    }
    // disable face culling (i.e., do draw the bottom of the cube even though it is away from the eye)
    else if (cfindex == 2)
        gl.disable(gl.CULL_FACE);

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    requestAnimFrame(render);
}
