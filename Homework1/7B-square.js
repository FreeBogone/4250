var gl;
var program;

function main() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Four Vertices
    var vertices = [
        vec2(-0.5, -0.5),
        vec2(-0.5,  0.5),
        vec2(0.5, 0.5),
        vec2(0.5, -0.5),

        vec2(0.6, 0.25),
        vec2(0.6, -0.25),
        vec2(1, 0)
    ];

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function render() {
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    // draw the square with the first color
    gl.uniform1i(gl.getUniformLocation(program, "colorChoice"), 1);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    // draw the triangle with the second color
    gl.uniform1i(gl.getUniformLocation(program, "colorChoice"), 0);
    gl.drawArrays( gl.TRIANGLES, 4, 3);
}
