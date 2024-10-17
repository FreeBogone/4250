var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var cmtStack=[];

var points=[];
var colors=[];

function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    render();
}

function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function GeneratePoints() {
    GenerateSky();
    GenerateGround();
    GenerateMountains();
    //GenerateStars();
    //GeneratePlanet();
    //GenerateGhost();
}

function GenerateSky() {
    points.push(vec2(-8, 8));
    points.push(vec2(8, 8));
    points.push(vec2(8, -8));
    points.push(vec2(-8, -8));

    colors.push(vec4(0.194, 0.051, 0.402, 1)); 
    colors.push(vec4(0.35, 0.051, 0.302, 1)); 
    colors.push(vec4(0.194, 0.051, 0.402, 1)); 
    colors.push(vec4(0.194, 0.051, 0.402, 1)); 
    //4 points, total 4
}

function GenerateGround() {
    points.push(vec2(-8, 0));
    points.push(vec2(8, 0));
    points.push(vec2(8, -8));
    points.push(vec2(-8, -8));

    colors.push(vec4(0.0, 0.5, 0.0, 1)); // Green
    colors.push(vec4(0.275, 0.385, 0.035, 1)); // Interpolated color between green and brown
    colors.push(vec4(0.55, 0.27, 0.07, 1)); // Brown
    colors.push(vec4(0.275, 0.385, 0.035, 1)); // Interpolated color between green and brown
    //4 points, total 8
}

function GenerateMountains() {
    originalPoints = [];

    //generate 5 mountains on the origin
    for(var i = 0; i < 5; i++) {
        points.push(vec2(-2, 0)); //bottom left
        points.push(vec2(0, 4)); //top point
        points.push(vec2(2, 0)); //bototm right
        colors.push(vec4(0.2, 0.2, 0.2, 1)); // Dark Grey
        colors.push(vec4(0.7, 0.7, 0.7, 1)); // Medium Grey
        colors.push(vec4(0.2, 0.2, 0.2, 1)); // Dark Grey
    }
    //15 points, total 23
}

function GenerateStars() {

}

function GeneratePlanet() {
	var Radius=1.0;
	var numPoints = 80;

	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
	        colors.push(vec4(0.7, 0.7, 0, 1));
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function DrawSky() {
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
}

function DrawGround() {
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4);
}

function DrawMountains() {

    modelViewMatrix=mat4();
    modelViewMatrix = mult(translate(-4, 0, 0), mult(scale4(1, 1.8, 0), modelViewMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 8, 3);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(translate(7, -1, 0), mult(scale4(1, 1.5, 0), modelViewMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 11, 3);  

    modelViewMatrix=mat4();
    modelViewMatrix = mult(translate(5, -2, 0), mult(scale4(1, 1, 0), modelViewMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 14, 3); 

    modelViewMatrix = mat4();
    modelViewMatrix = mult(translate(-6, -1, 0), mult(scale4(2.3, 1.5, 0), modelViewMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 17, 3);

    modelViewMatrix=mat4();
    modelViewMatrix = mult(translate(-3, -1.75, 1), mult(scale4(1.4, 1, 0), modelViewMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 20, 3);  
}

function DrawGhost() {
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // right eye ball
}

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(2, 1, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(2, 2*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
    DrawSky();
    DrawGround();
    // draw stars and mountains... next
    DrawMountains();
    // then, draw planet, add rings too
    //DrawFullPlanet();

    // then, draw ghost
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //DrawGhost();

    // add other things, like bow, arrow, spider, flower, tree ...
}
