// tweening between two polygons
 
var gl, program, canvas;
var points;
var start=false;
var t=0;
var delay=500;  // 500 ms => .5 sec
var MAX_STEPS=50;
var steps=0;

var polyA = [vec2(0, 10),
            vec2(-25, 10),
            vec2(-25, 0),
            vec2(-5, 0),
            vec2(-5, -20),
            vec2(5, -20),
            vec2(5, 0),
            vec2(25, 0),
            vec2(25, 10)];

var polyB = [vec2(-25, 10),
            vec2(-25, -20),
            vec2(-5, -20),
            vec2(-5, -10),
            vec2(5, -10),
            vec2(5, -20),
            vec2(25, -20),
            vec2(25, 10),
            vec2(0, 20)]
    
function main() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    document.getElementById("StartStop").onclick = function () {
        start = !start;
        t=0;
        render();
    };

    initWebGL();

    render();
};

function initWebGL() {
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load polygon A's data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(polyA), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var A_Position = gl.getAttribLocation( program, "A_Position" );
    gl.vertexAttribPointer( A_Position, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( A_Position );

    // Load polygon B's data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(polyB), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var B_Position = gl.getAttribLocation( program, "B_Position" );
    gl.vertexAttribPointer(B_Position, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( B_Position );
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (start) {
        if (steps < MAX_STEPS) {
            // increment t 
            t = steps*1/MAX_STEPS;
            steps++;
        }
        else {
            start = !start;
        }
    }
    else {
        steps = 0;
    }

	// pass the t value over to vertex shader
    gl.uniform1f(gl.getUniformLocation(program, "t"), t);

    gl.drawArrays( gl.LINE_LOOP, 0, 9);

    setTimeout(function (){requestAnimFrame(render);}, delay);
}
