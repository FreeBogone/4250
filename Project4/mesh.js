var canvas;
var gl;
var image;
var program;

var eye ;
var near = -30;
var far = 30;
//var dr = 5.0 * Math.PI/180.0;

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var modelView, projection;
var viewerPos;
var flag = true;

var pointsArray = [];
var colorsArray = [];

// define the vertices of the mesh
var vertices = [
    vec4(0, 6, 0, 1), //0 A
    vec4(-4, 1, -1, 1), //1 B
    vec4(6, 1, -1, 1), //2 C
    vec4(-4, -1, -1, 1), //3 D
    vec4(6, -1, -1, 1), //4 E
    vec4(6, 1, 4, 1), //5 F
    vec4(6, -1, 4, 1), //6 G
    vec4(-4, 1, 4, 1), //7 H
    vec4(-4, -1, 4, 1) //8 I
];

// define the colors
var colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black 0
    vec4(1.0, 0.0, 0.0, 1.0), // red 1
    vec4(1.0, 1.0, 0.0, 1.0), // yellow 2
    vec4(0.0, 1.0, 0.0, 1.0), // green 3
    vec4(0.0, 0.0, 1.0, 1.0), // blue 4
    vec4(1.0, 0.0, 1.0, 1.0), // magenta 5
    vec4(0.0, 1.0, 1.0, 1.0), // cyan 6
    vec4(1.0, 1.0, 1.0, 1.0) // white 7
];

// define the faces
function DrawMesh()
{
    quad(7, 8, 6, 5, 0);
    quad(5, 6, 4, 2, 1);
    quad(2, 4, 3, 1, 2);
    quad(1, 3, 8, 7, 5);
    quad(3, 8, 6, 4, 4);
    quad(1, 7, 5, 2, 5);

    triangle(7, 5, 0, 6);
    triangle(5, 2, 0, 5);
    triangle(2, 1, 0, 4);
    triangle(1, 7, 0, 3);
}

// define the quad function and other needed function, such as triangle
function quad(a, b, c, d, colorIndex) {
    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[b]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[d]);
    colorsArray.push(colors[colorIndex]);
}

function triangle(a, b, c, colorIndex) {
    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[b]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);
}

// no need to change after this point
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 4,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.5, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    // !!
    // program needs to be global
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    DrawMesh();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);

	// color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });
    render();
}

function render() {

    // Specify the color for clearing <canvas>
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    //eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
    //    radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

	eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));

    modelViewMatrix = lookAt(eye, at , up);
    //projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	projectionMatrix = ortho(left*AllInfo.zoomFactor - AllInfo.translateX,
                              right*AllInfo.zoomFactor - AllInfo.translateX,
                              bottom*AllInfo.zoomFactor - AllInfo.translateY,
                              ytop*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);

    let s = scale4(.3, .3, .3);
    modelViewMatrix = mult(s, modelViewMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	gl.drawArrays( gl.TRIANGLES, 0, colorsArray.length);

}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
