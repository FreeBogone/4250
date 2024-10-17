/////////////////////////////////////////////////////////////////
//
// File:        swirlZoom.js
//
// The purpose of this program is to demonstrate a ZoomIn end zoom out effect and to
// further illustrate the ortho function
//
// The program draws a hexigon "swirl" and then when the user presses:
// --  key 'i' or '2': zooming in one step
// --  key 't' or '3': zooming out one step
// --  key 'a' or '4': zooms in on a portion of the beginning picture
//                     by resetting the window 20 times.
// --  key 'o' or '1': display the original drawing
//
// The corresponding buttons have been implemented on the interface.
//
/////////////////////////////////////////////////////////////////

var gl, canvas, program;
var points;
var version=1;  // initial version
var delay=500;  // 500 ms => .5 sec

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;

var modelViewStack=[];

var NumFrames = 20;		//the number of frames in the animation
var frameCount=0;
var cx = 0.0, cy = 0.0;//each world window is centered about (cx, cy)
var deltaX=2, deltaY=2;
var width=2, height=2;

var vertices;

function main() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    var a = document.getElementById("Original")
	  a.addEventListener("click", function(){version=1;
    modelViewMatrix=mat4();
	  projectionMatrix = ortho(-width, width, -height, height, -1, 1);
	  render(); });

    var a = document.getElementById("ZoomIn")
	    a.addEventListener("click", function(){version=2; render(); });

    var a = document.getElementById("ZoomOut")
	    a.addEventListener("click", function(){version=3; render();});

    var a = document.getElementById("Animate")
	    a.addEventListener("click", function(){version=4; frameCount=0; render();});

    var a = document.getElementById("Animate2")
	    a.addEventListener("click", function(){version=5; frameCount=0;
		   projectionMatrix = mat4();
		   render();});

    window.onkeydown = function(event) {
        var key=String.fromCharCode(event.keyCode);
        switch (key)  {
     	    case 'O':   // press 'o' to go back to the Original swirl shape
		      case '1':   version = 1;
	   		              modelViewMatrix=mat4();
	   		              projectionMatrix = ortho(-width, width, -height, height, -1, 1);
	   		              break;
		      case 'I':   // press 'i' to step IIInto the swirl (zoom in)
		      case '2':   version = 2;
			                break;
		      case 'T':   // press 't' to step ouTTT the swirl (zoom out)
		      case '3':   version = 3;
			                break;
	        case 'A':   // press key 'a' for animation
		      case '4':   version = 4;
	   		              frameCount = 0;
			                break;
		      case 'L':   // press key 'l' to see the last example case
		      case '5':
		                  // projection matrix is self multiplied at each step
			                version = 5;
	   		              projectionMatrix = mat4();
       			          frameCount = 0;
			                break;
	    } // end switch

      render();
    };

    initWebGL();

    render();
}

function initWebGL() {

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4()));

    if (version == 1)  {  // identity
		    projectionMatrix = ortho(-2, 2, -2, 2, -1, 1);
    }
    else if (version == 2) {  // step zooming in
		    deltaX -= 0.05;
		    deltaY -= 0.05;
		    projectionMatrix = ortho(cx-deltaX, cx+deltaX, cy-deltaY, cy+deltaY, -1, 1);
   }
   else if (version == 3) {  // step zooming out
		   deltaX += 0.05;
		   deltaY += 0.05;
		   projectionMatrix = ortho(cx-deltaX, cx+deltaX, cy-deltaY, cy+deltaY, -1, 1);
   }
   else if (version == 4)  {  // zooming in animation with 20 frames
        if (frameCount < NumFrames) {
	    	//shrink the world window
	    	width *= 0.9;
	    	height *= 0.9;

	    	// draw the hexagon swirl
	    	projectionMatrix = ortho(cx - width, cx + width, cy - height, cy + height, -1, 1);
        	setTimeout(function (){requestAnimFrame(render);}, delay);

	    	frameCount ++;
		}
		else {
	    	projectionMatrix = ortho(cx - width, cx + width, cy - height, cy + height, -1, 1);
		}
   }
   else if (version == 5) { // projectMatrix
        if (frameCount < NumFrames/2) { // only do 10 frames here
        	var tempMatrix = ortho(-1.2, 1.2, -1.2, 1.2, -1, 1);
        	projectionMatrix = mult(projectionMatrix, tempMatrix);

    		setTimeout(function (){requestAnimFrame(render);}, delay);
	 }
   }
   gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
   gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
}

function GeneratePoints() {
	var angle;			//the angle of rotation
	var angleInc = 2*Math.PI/6;	//the angle increment
	var inc = 2.0/100;		//the radius increment
	var radius = 1/100;	//the starting radius to be used
	var points=[];

	for (var j=0; j<=100; j++) {
	    //the angle of rotation depends on which hexagon is being drawn.
	    angle = j * (Math.PI/180);

	    //draw one hexagon with 6 points
	    for (var k=0; k<6; k++) {
			     angle += angleInc;
			     points.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
	    }

	    //determine the radius of the next hexagon
	    radius += inc;
	}

	return points;
}
