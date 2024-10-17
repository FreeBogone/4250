var gl, program;
var points;
var SIZE;
var CIRCLE_SIZE;

function main() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0, 0);  // location of the center of the circle
    var radius = 0.5;    // radius of the circle
    var Radius = 1.0;
    var points = GeneratePoints(center, radius, Radius);

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
 	if (!program) { console.log('Failed to intialize shaders.'); return; }
	gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


// generate points to draw a symbol from two concentric circles,
// the inner circle one with radius, the outer circle with Radius
// centered at (center[0], center[1]) using GL_Line_STRIP
function GeneratePoints(center, radius, Radius)
{
    var vertices=[];
    SIZE=12; // slices
    CIRCLE_SIZE=100;

    var angle = 2*Math.PI/SIZE;
    var circleAngle = 2*Math.PI/CIRCLE_SIZE;

    for (var i=0; i<SIZE; i+=2) {
        //generate points for star
        vertices.push(vec2(center[0], center[1]));
        // point from outer circle
        vertices.push(vec2(center[0]+Radius*Math.cos(i*angle + angle), center[1]+Radius*Math.sin(i*angle + angle)));
       // point from inner circle
        vertices.push(vec2(center[0]+radius*Math.cos((i+1)*angle + angle), center[1]+radius*Math.sin((i+1)*angle + angle)));

        vertices.push(vec2(center[0], center[1]));
       // point from inner circle
        vertices.push(vec2(center[0]+radius*Math.cos((i+1)*angle + angle), center[1]+radius*Math.sin((i+1)*angle + angle)));
        // point from outer circle
        vertices.push(vec2(center[0]+Radius*Math.cos((i+2)*angle + angle), center[1]+Radius*Math.sin((i+2)*angle + angle)));

        //changes: added "+ angle" inside all of the cos or sine functions to align the top point to face north
    }

    for(var i=0; i<CIRCLE_SIZE+1; i++) {
        //generate points for circle
        console.log([center[0]+Radius*Math.cos(i*circleAngle), ", ", center[1]+Radius*Math.sin(i*circleAngle)]);
	    vertices.push([center[0]+Radius*Math.cos(i*circleAngle),
		               center[1]+Radius*Math.sin(i*circleAngle)]);
    }

    return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // interleaving color symbol
    for (var i=0; i<SIZE; i+=2)
    {
      gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
      gl.drawArrays( gl.TRIANGLES, i*3, 3);

      gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 1);
      gl.drawArrays( gl.TRIANGLES, (i+1)*3, 3);
    }

    //use size * 3 for starting point
    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 3);
    gl.drawArrays( gl.LINE_STRIP, SIZE * 3, CIRCLE_SIZE+1);
}
