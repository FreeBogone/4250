var gl;				// Reference to the canvas of the WebGL framework
var points;			// array holding points to be rendered
var SIZE=100;			// number of points used to make the circle
var STAR_POINTS=6;		// number of points where star touches circle
var program;			// used to initialize shaders

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;

// Function initiated when all HTML5 and WebGL programs have been loaded
function main() {
    // Initialization of WebGL canvas
    var canvas = document.getElementById( "gl-canvas" );
    var Ratio = canvas.width/canvas.height;

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var center= vec2(0.0, 0.0);  // location of the center of the circle
    var Radius = 1.0;			// Radius of circle
    var radius = 0.5;    // radius of smaller circle created by star
    points = GeneratePoints(center, Radius, radius);

    // version 1
    window.onresize = function() {
       var min = window.innerWidth;

       if (window.innerHeight < min) {
          min = window.innerHeight;
       }

       if (min < canvas.width || min < canvas.height)  {
           canvas.width = min;
           canvas.height= min;
       }
       gl.viewport(0, 0, min, min);
       render();
    };

    // version 2: what if the ratio of the original canvas was not 1:1?
    // does not work as well as openGL setting -- skip
    /*
    window.onresize = function() {
      var iw = window.innerWidth;
      var ih = window.innerHeight;

      if (iw/ih < Ratio)   { // width is smaller, set canvas width to window width
 	 	canvas.width = iw;
        canvas.height = iw/Ratio;   // set canvas height according to ratio
      }
      else if (iw/ih > Ratio)  { // height is smaller, set canvas height to window height
         canvas.width=ih*Ratio;   // set canvas width according to ratio
         canvas.height=ih;
      }
      render();
    };  */

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
    //SIZE += STAR_POINTS*2;	// increase size to include points for both circle and star

	  render();
};

// generate points to draw a (non-solid) circle centered at (center[0], center[1]) using GL_Line_LOOP
function GeneratePoints(center, Radius, radius) {
    var vertices=[];

	var angle = 2*Math.PI/SIZE;	// angle between each point on the circle

    // Loop variable adjusted so that rendering of circle begins and ends on the positive y-axis
	// this is so rendering of star can begin immediately thereafter
	for  (var i=SIZE/4; i<5*SIZE/4; i++) {
	    vertices.push([center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)]);
	}

	angle=2*Math.PI/(STAR_POINTS*2);	// angle between each line used to make star

	circle=1;	// flag to determine if point rendered is touching outer circle
	for (var i=STAR_POINTS/2; i<5*STAR_POINTS/2; i++) {
		if (circle) {
			vertices.push([center[0]+Radius*Math.cos(i*angle), center[1]+Radius*Math.sin(i*angle)]);
			circle=0;
		}
		else {
			vertices.push([center[0]+radius*Math.cos(i*angle), center[1]+radius*Math.sin(i*angle)]);
			circle=1;
		}
	}
	return vertices;
}

// render with line_loop in order to complete star
function render() {
    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4())); // not using transformation here

    gl.viewport(0, 0, 500, 500);  // default square viewport
    //gl.viewport(0, 0, 300*1.618, 300); // golden ratio viewport
    //gl.viewport(0, 0, 100, 200);  // to show the origin location in viewport

    projectionMatrix = ortho(-3, 3, -3, 3, -1, 1);
    //projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);
    //projectionMatrix = ortho(-3, 3, -5, 5, -1, 1);
    //projectionMatrix = ortho(0, 1, 0, 1, -1, 1);
    //projectionMatrix = ortho(0, 0.5, 0, 0.5, -1, 1);
    //projectionMatrix = ortho(-10, 10, -10, 10, -1, 1);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.drawArrays( gl.LINE_LOOP, 0, points.length);
}
