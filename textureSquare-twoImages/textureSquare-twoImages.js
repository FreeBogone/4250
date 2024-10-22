var canvas;
var gl;
var program;
var image;

var pointsArray = [];
var texCoordsArray = [];

var texture1, texture2;

// vertex positions
var vertices = [
    vec2( -1, 1),
    vec2( -1, 0),
    vec2( 0, 1),
    vec2( 0, 0),   // switch A & D points?

    vec2( 0, 0),
    vec2( 0, -1),
    vec2( 1, 0),
    vec2( 1, -1),
];

// texture coordinates
// version 1 -- basic version
var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 1),
    vec2(1, 0),

    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 1),
    vec2(1, 0),
];


// version 2
// set TEXTURE_WRAP_T and TEXTURE_WRAP_S
/*
var texCoord = [
    vec2(-.3, 1.7),
    vec2(-0.3, -0.2),
    vec2(1.7, 1.7),
    vec2(1.7, -0.2),

    vec2(-.3, 1.7),
    vec2(-0.3, -0.2),
    vec2(1.7, 1.7),
    vec2(1.7, -0.2),
];
*/

// version 3
/*
var texCoord = [
    vec2(0, 1),
    vec2(0, 0.5),
    vec2(0.6, 0.6),
    vec2(0.6, 0.5),

    vec2(0.3, 0.6),
    vec2(0.3, 0.3),
    vec2(0.6, 0.6),
    vec2(0.6, 0.3),
];
*/

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, .5, 1.0, 1.0 );
    
    //  =======  Load shaders  ===============
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // ========  Initiailze Vertex buffers =============
    InitVertexBuffers();

    render();
}


function InitVertexBuffers()
{
    // position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
}

function loadTexture(texture, whichTexture) 
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit passed in as parameter "texture"
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // version 1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // version 2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // mipmap option (only if the image is of power of 2 dimension)
    //gl.generateMipmap( gl.TEXTURE_2D );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT);

    // ========  Establish Textures =================
    // --------create texture object 1----------
    texture1 = gl.createTexture();

    // create the image object
    texture1.image = new Image();

    // Tell the broswer to load an image
    texture1.image.src='leaves.jpg';

    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

 	// draw the first square
    // Enable texture unit 0
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);

    // -------create texture object 2------------
    texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();

    // Tell the broswer to load an image
    texture2.image.src='Lotus.gif';

    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }

    // draw the second square
    // Enable texture unit 1
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    gl.drawArrays( gl.TRIANGLE_STRIP, 4, 4);

    requestAnimFrame(render);
}
