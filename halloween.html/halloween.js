var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var cmtStack=[];

var points=[];
var colors=[];
var numMountains = 5;
var numStars = 25;
var starLocations = GetStarLocations(numStars);

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
    GenerateStars();
    //GenerateGround();
    //GenerateMountains();
    // GenerateTrees();
    // GenerateBowandArrow();
    //GeneratePlanet();
    //GenerateGhost();
}

function GenerateSky() {
    //generate points to fill whole canvas
    points.push(vec2(-10, -10));
    points.push(vec2(10, -10));
    points.push(vec2(10, 10));
    points.push(vec2(-10, 10));

    //push color fo sky (purple/dark blue)
    var bottomColor = vec4(0.0, 0.0, 0.5, 1); // Dark blue
    var topColor = vec4(0.5, 0.1, 0.6, 1);    // Dark purple

    // Push colors for each vertex
    colors.push(bottomColor); // Bottom-left
    colors.push(bottomColor); // Bottom-right
    colors.push(topColor);    // Top-right
    colors.push(topColor);    // Top-left
}

function GenerateGround() {
    //generate points to fill bottom half of canvas
    points.push(vec2(-10, -10));
    points.push(vec2(10, -10));
    points.push(vec2(10, 0));
    points.push(vec2(-10, 0));
    
    //push color for ground (brown to green)
    var bottomColor = vec4(0.0, 0.3, 0.0, 1); // Dark green
    var topColor = vec4(0.5, 0.5, 0.0, 1);    // Dark brown

    // Push colors for each vertex
    colors.push(bottomColor); // Bottom-left
    colors.push(bottomColor); // Bottom-right
    colors.push(topColor);    // Top-right
    colors.push(topColor);    // Top-left
}

function GenerateMountains() {
    //create Triangle
    var tempPoints = [];
    tempPoints.push(vec2(-5, 0));
    tempPoints.push(vec2(0, 5));
    tempPoints.push(vec2(5, 0));

    var temp = [];


    //translate and scale triangle to create mountain



    //push color for mountain (white)
    var color = vec4(1.0, 1.0, 1.0, 1); // White
}

function GetStarLocations(num) {
    var locations = [];
    //get 20 random locations between 10, -10 and 10, 0
    for (var i=0; i<num; i++) {
        var x = Math.random() * 16 - 8;
        var y = Math.random() * 8;
        locations.push(vec2(x, y));
    }
    return locations;
}

function GenerateStars() {

    //generate points for stars
    for (var i=0; i<numStars; i++) {
        var x = starLocations[i][0];
        var y = starLocations[i][1];
        points.push(vec2(x, y + 0.2)); // Top point
        points.push(vec2(x + 0.06, y + 0)); // Top-right inner
        points.push(vec2(x + 0.2, y + 0.06)); // Right outer
        points.push(vec2(x + 0.1, y - 0.02)); // Bottom-right inner
        points.push(vec2(x + 0.12, y - 0.2)); // Bottom point
        points.push(vec2(x, y - 0.1)); // Bottom-left inner
        points.push(vec2(x - 0.12, y - 0.2)); // Bottom point
        points.push(vec2(x - 0.1, y - 0.02)); // Bottom-left inner
        points.push(vec2(x - 0.2, y + 0.06)); // Left outer
        points.push(vec2(x - 0.06, y + 0.06)); // Top-left inner
        points.push(vec2(x, y + 0.2)); // Close the loop
    }
    console.log(points);
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

function GenerateGhost() {
    //generate points for ghost here
        // begin body  (91 points)
	points.push(vec2(3, 0));
	points.push(vec2(3.1, 1));
	points.push(vec2(3.5, 2));
	points.push(vec2(4, 3.6));
	points.push(vec2(4, 4));
	points.push(vec2(4.1, 3.3));
	points.push(vec2(4.5, 3));
	points.push(vec2(5.5, 3));
	points.push(vec2(6,3.5));
	points.push(vec2(6.5, 4));
	points.push(vec2(6.7, 4.2));
	points.push(vec2(6.8, 2.8));
	points.push(vec2(7, 2.4));
	points.push(vec2(7.5, 2));
	points.push(vec2(8, 2));
	points.push(vec2(8.5, 1.7));
	points.push(vec2(9, 1.2));
	points.push(vec2(10, 0.8));
	points.push(vec2(10, -2));
	points.push(vec2(10.4, -2.8));
	points.push(vec2(10.5, -3.5));
	points.push(vec2(10.7, -1.7));
	points.push(vec2(11, -1.4));
	points.push(vec2(11.2, -1.5));
	points.push(vec2(12, -2));
	points.push(vec2(12.5, -2.5));
	points.push(vec2(13, -3));
	points.push(vec2(13, -2));
	points.push(vec2(12.8, -0.5));
	points.push(vec2(12, 0));
	points.push(vec2(12.5, 0.5));
	points.push(vec2(11, 1));
	points.push(vec2(10.8, 1.4));
	points.push(vec2(10.2, 2.5));
	points.push(vec2(10, 4));
	points.push(vec2(9.8, 7.5));
	points.push(vec2(7.5, 9.5));
	points.push(vec2(6, 11));
	points.push(vec2(3, 12));
	points.push(vec2(.5, 15));
	points.push(vec2(0, 17));
	points.push(vec2(-1.8, 17.4));
	points.push(vec2(-4, 16.6));
	points.push(vec2(-5, 14));
	points.push(vec2(-6, 10.5));
	points.push(vec2(-9, 10));
	points.push(vec2(-10.5, 8.5));
	points.push(vec2(-12, 7.5));
	points.push(vec2(-12.5, 4.5));
	points.push(vec2(-13, 3));
	points.push(vec2(-13.5, -1));
	points.push(vec2(-13, -2.3));
	points.push(vec2(-12, 0));
	points.push(vec2(-11.5, 1.8));
	points.push(vec2(-11.5, -2));
	points.push(vec2(-10.5, 0));
	points.push(vec2(-10, 2));
	points.push(vec2(-8.5, 4));
	points.push(vec2(-8, 4.5));
	points.push(vec2(-8.5, 7));
	points.push(vec2(-8, 5));
	points.push(vec2(-6.5, 4.2));
	points.push(vec2(-4.5, 6.5));
	points.push(vec2(-4, 4));
	points.push(vec2(-5.2, 2));
	points.push(vec2(-5, 0));
	points.push(vec2(-5.5, -2));
	points.push(vec2(-6, -5));
	points.push(vec2(-7, -8));
	points.push(vec2(-8, -10));
	points.push(vec2(-9, -12.5));
	points.push(vec2(-10, -14.5));
	points.push(vec2(-10.5, -15.5));
	points.push(vec2(-11, -17.5));
	points.push(vec2(-5, -14));
	points.push(vec2(-4, -11));
	points.push(vec2(-5, -12.5));
	points.push(vec2(-3, -12.5));
	points.push(vec2(-2, -11.5));
	points.push(vec2(0, -11.5));
	points.push(vec2(1, -12));
	points.push(vec2(3, -12));
	points.push(vec2(3.5, -7));
	points.push(vec2(3, -4));
	points.push(vec2(4, -3.8));
	points.push(vec2(4.5, -2.5));
	points.push(vec2(3, 0));
    // end body

	// begin mouth (6 points)
	points.push(vec2(-1, 6));
	points.push(vec2(-0.5, 7));
	points.push(vec2(-0.2, 8));
	points.push(vec2(-1, 8.6));
	points.push(vec2(-2, 7));
	points.push(vec2(-1.5, 5.8));
    // end mouth

	// begin nose (5 points)
	points.push(vec2(-1.8, 9.2));
	points.push(vec2(-1, 9.8));
	points.push(vec2(-1.1, 10.6));
	points.push(vec2(-1.6, 10.8));
	points.push(vec2(-1.9, 10));

    // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
    // outer eye, draw line loop (9 points)
	points.push(vec2(-2.9, 10.8));
	points.push(vec2(-2.2, 11));
	points.push(vec2(-2, 12));
	points.push(vec2(-2, 12.8));
	points.push(vec2(-2.2, 13));
	points.push(vec2(-2.5, 13));
	points.push(vec2(-2.9, 12));
	points.push(vec2(-3, 11));
	points.push(vec2(-2.9, 10.5));

    // eye ball, draw triangle_fan (7 points)
	points.push(vec2(-2.5, 11.4));  // middle point
	points.push(vec2(-2.9, 10.8));
	points.push(vec2(-2.2, 11));
	points.push(vec2(-2, 12));
	points.push(vec2(-2.9, 12));
	points.push(vec2(-3, 11));
	points.push(vec2(-2.9, 10.5));
    // end left eye
    

}

function DrawSky() {
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
}

function DrawStars() {
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    for(var i=0; i<numStars; i++) {
        gl.drawArrays( gl.TRIANGLE_FAN, 4+(i*11), 11);
    }
}


function DrawGround() {
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4);
}

function DrawMountains() {
    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 3);
}

function DrawGhost() {
    modelViewMatrix=mult(modelViewMatrix, scale4(1/25, 1/25, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 84, 91); // body
    gl.drawArrays( gl.LINE_LOOP, 175, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 181, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 186, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 195, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 186, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 195, 7);  // right eye ball
}

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-5, 5, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(.5, .5*1.618, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 80);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
    console.log("Drawing Sky");
    DrawSky();
    console.log("Drawing Stars");
    DrawStars();
    //console.log("Drawing Ground");
    //DrawGround();
    // draw stars and mountains... next
    //console.log("Drawing Mountains");
    //DrawMountains();
    // then, draw planet, add rings too
    //console.log("Drawing Planet");
    //DrawFullPlanet();

    // then, draw ghost
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-3, -2, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(2, 2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    //console.log("Drawing Ghost");
    //DrawGhost();

    // add other things, like bow, arrow, spider, flower, tree ...
}
