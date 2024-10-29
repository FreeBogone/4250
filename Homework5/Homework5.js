// draw a 3D cone
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
var numSlices=16;
var radius=50;

function main()   {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    ConfigWebGL();

	PassInfoToGPU();

    render();
};

function ConfigWebGL()   {
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
}

function PassInfoToGPU()  {
    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
    modelviewMatrixLoc= gl.getUniformLocation(program, "modelviewMatrix");
}

function GeneratePoints()  {
    var points=[];

    // Define the vertices of a tetrahedron
    var vertices = [
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.9428, -0.3333),
        vec3(-0.8165, -0.4714, -0.3333),
        vec3(0.8165, -0.4714, -0.3333)
    ];

    // Define the faces of the tetrahedron (each face is a triangle)
    var faces = [
        [vertices[0], vertices[1], vertices[2]],
        [vertices[0], vertices[2], vertices[3]],
        [vertices[0], vertices[3], vertices[1]],
        [vertices[1], vertices[2], vertices[3]]
    ];

    // Add each face to the points array
    for (var i = 0; i < faces.length; i++) {
        points.push(faces[i][0]);
        points.push(faces[i][1]);
        points.push(faces[i][2]);
    }


    return points;
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT );
	  gl.frontFace(gl.CCW); // designate CCW to front facing (default)

    projectionMatrix = ortho(-100, 100, -100, 100, -100, 100);

    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 1, 0);
    modelviewMatrix = mult(r1, r2);

    //rotate the object so the viewer can see it is 3d
    modelviewMatrix = mult(modelviewMatrix, rotate(30, 1, 0, 0));
    modelviewMatrix = mult(modelviewMatrix, rotate(30, 0, 1, 0));


    gl.uniformMatrix4fv(modelviewMatrixLoc, false, flatten(modelviewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // toggle Depth test: initially enabled  (i.e., dtindex=1 in the global setting)
    if (dtindex == 1)
         gl.enable(gl.DEPTH_TEST);
    else if (dtindex == 2)
         gl.disable(gl.DEPTH_TEST);

    // toggle face culling
    // initially disable face culling (i.e., initially cfindex=2 in the global setting)
    // WegGL/OpenGL disable face culling by default
    // enable face culling (i.e., not draw the bottom of the cone if it is away from the eye)
    if (cfindex == 1)     {
         gl.enable(gl.CULL_FACE);
         //gl.cullFace(gl.BACK);   // do not show back face, default
         gl.cullFace(gl.FRONT);   // do not show front
    }
    // disable face culling (i.e., do draw the bottom of the cone even though it is away from the eye)
    else if (cfindex == 2)
         gl.disable(gl.CULL_FACE);

    //draw the tetrahedron
    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 3);
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length );

    requestAnimFrame(render);
}
