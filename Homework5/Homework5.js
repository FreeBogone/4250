// draw a 3D tetrahedron
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
// var numSlices=16;
// var radius=50;

function main()   {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    SetupUserInterface();

    ConfigWebGL();

	PassInfoToGPU();

    render();
};

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function ConfigWebGL()   {
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
}

function SetupUserInterface()  {
    // support user interface
    document.getElementById("xrotPlus").onclick=function(){xrot += deg; console.log(xrot);};
    document.getElementById("xrotMinus").onclick=function(){xrot -= deg; console.log(xrot);};
    document.getElementById("yrotPlus").onclick=function(){yrot += deg; console.log(yrot);};
    document.getElementById("yrotMinus").onclick=function(){yrot -= deg; console.log(yrot);};

    document.getElementById("ToggleDepth").onclick=function()
    {	 if (dtindex==1)  dtindex=2;
         else     dtindex=1;
    };


    document.getElementById("ToggleCull").onclick=function()
    {    if (cfindex==1)  cfindex=2;
         else     cfindex=1;
    };

    // keyboard handle
    window.onkeydown = HandleKeyboard;
}

function HandleKeyboard(event)  {
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              yrot -= deg;
              break;
    case 39:   // right cursor key
              yrot += deg;
              break;
    case 38:   // up cursor key
              xrot -= deg;
              break;
    case 40:    // down cursor key
              xrot += deg; 
              break;
    }
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

    //geometric coordinates of a tetrahedron

    var a = vec3(0, 0, 1);
    var b = vec3(0, 1, -1);
    var c = vec3(1, -1, -1);
    var d = vec3(-1, -1, -1);

    // 4 triangles
    points.push(a, b, c);
    points.push(a, c, d);
    points.push(a, d, b);
    points.push(b, d, c);



    return points;
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT );
	  gl.frontFace(gl.CCW); // designate CCW to front facing (default)

    projectionMatrix = ortho(-100, 100, -100, 100, -100, 100);

    var r1 = rotate(xrot, 1, 0, 0);
    var r2 = rotate(yrot, 0, 1, 0);
    modelviewMatrix = mult(r1, r2);

    modelviewMatrix = mat4();
    modelviewMatrix = mult(modelviewMatrix, rotate(xrot, [1, 0, 0])); 
    modelviewMatrix = mult(modelviewMatrix, rotate(yrot, [0, 1, 0]));
    modelviewMatrix = mult(modelviewMatrix, translate(0, 0, -50));
    modelviewMatrix = mult(modelviewMatrix, scale4(20, 20, 20));


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
    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
    gl.drawArrays( gl.TRIANGLES, 3, 3 );

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 3);
    gl.drawArrays( gl.TRIANGLES, 6, 3 );

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
    gl.drawArrays( gl.TRIANGLES, 9, 3 );


    requestAnimFrame(render);
}
