var canvas;
var gl;

var texSize = 64;

// Create a checkerboard pattern using floats
var image1 = new Array();
for (var i =0; i<texSize; i++)  
    image1[i] = new Array();

for (var i =0; i<texSize; i++) 
    for ( var j = 0; j < texSize; j++) 
      image1[i][j] = new Float32Array(4);

// images1[i][j] = 0  or images[i][j] = 1
for (var i =0; i<texSize; i++) 
    for (var j=0; j<texSize; j++) {
      var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
      image1[i][j] = [c, c, c, 1];
    }

// Convert floats to ubytes for texture
var image2 = new Uint8Array(4*texSize*texSize);

// images1[i][j]=0  or images[i][j]=255
for ( var i = 0; i < texSize; i++ ) 
    for ( var j = 0; j < texSize; j++ ) 
       for(var k =0; k<4; k++) 
           image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];
        
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0, 1.0 ), // 0
    vec4( -0.5,  0.5,  0, 1.0 ), // 1       1  2
    vec4( 0.5,  0.5,  0, 1.0 ),  // 2       0  3
    vec4( 0.5, -0.5,  0, 1.0 ),  // 3
];

var vertexColors = [
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
];        


// version 1
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),    // B  C
    vec2(1, 1),    // A  D
    vec2(1, 0)
];


/*
// version 2
var texCoord = [
    vec2(0, 0),
    vec2(0, 0.5),   //  B(1/2) C(1/2)
    vec2(0.5, 0.5), //  A      D(1/2)
    vec2(0.5, 0)
];
*/

/*
// version 3A
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),   // B  C
    vec2(1, 1),   // A
    vec2(0, 0)
];
*/

/*
// version 3B
var texCoord = [
    vec2(0, 0),
    vec2(0, 0.5),   // B(1/2)  C
    vec2(1, 1),     // A   D(1/2)
    vec2(0.5, 0)
];
*/

// version 3C
/*
var texCoord = [
    vec2(-1, -1),
    vec2(-1, 2),  
    vec2(2, 2),     
    vec2(2, -1)
];
*/

// version 4
/*
var texCoord = [
    vec2(0, 1.5),        // switch the top two coordinates?
    vec2(-0.5, -0.5),  
    vec2(1.5, 1.5),
    vec2(-0.5, -0.5)
];
*/

// version 5
/*
var texCoord = [
    vec2(-0.3, 1.7),        // try switch top two coordinates
    vec2(-0.3, -0.2),  
    vec2(1.7, 1.7),
    vec2(1.7, -0.2)
];
*/

window.onload = init;

function configureTexture(image) {

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    texture = gl.createTexture();
    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture );

    // Enable texture unit 0
    gl.activeTexture( gl.TEXTURE0 );

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // set texture parameters
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // minmap option
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}

function quad(a, b, c, d) {

     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]); 
    
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]); 
}


function colorCube()
{
    quad( 0, 1, 2, 3 );
    //quad( 1, 0, 3, 2 );
}


function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    configureTexture(image2);

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, 6);
    requestAnimFrame(render);
}
