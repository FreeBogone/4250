var canvas;
var gl;

var eye= [2, 2, 2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var N;
var vertices=[];

var lightPosition = vec4(2, 3, 2, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta =[0, 0, 0];

var thetaLoc;

var flag = true;

// texture coordinates
var texCoord = [
    vec2(0, .5),
    vec2(0, 0),
    vec2(.5, .5),
    vec2(.5, 0),
];
var texture;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points
    SurfaceRevPoints();

    // set up normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // set up point buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // create the texture object
    texture = gl.createTexture();

    // create the image object
    texture.image = new Image();

    // register the event handler to be called on loading an image
    texture.image.onload = function() {  loadTexture(texture);}

    // Tell the broswer to load an image
    texture.image.src='marble2.jpg';   // test with different marble textures images
    //texture.image.src='marble.jpg';

    thetaLoc = gl.getUniformLocation(program, "theta");

    projection = ortho(-3, 3, -3, 3, -20, 20);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};


    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    render();
}

function loadTexture(texture)
{
     // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture );

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture unit 0 the sampler
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

//Pawn initial 2d line points for surface of revolution  (25 points)
var pawnPoints = [
	[0,    .104, 0.0],
	[.028, .110, 0.0],
	[.052, .126, 0.0],
	[.068, .161, 0.0],
	[.067, .197, 0.0],
	[.055, .219, 0.0],
	[.041, .238, 0.0],
	[.033, .245, 0.0],
	[.031, .246, 0.0],
	[.056, .257, 0.0],
	[.063, .266, 0.0],
	[.059, .287, 0.0],
	[.048, .294, 0.0],
	[.032, .301, 0.0],
	[.027, .328, 0.0],
	[.032, .380, 0.0],
	[.043, .410, 0.0],
	[.058, .425, 0.0],
	[.066, .433, 0.0],
	[.069, .447, 0.0],
	[.093, .465, 0.0],
	[.107, .488, 0.0],
	[.106, .512, 0.0],
	[.115, .526, 0.0],
	[0, .525, 0.0],
];


//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPoints()
{
	//Setup initial points matrix
	for (var i = 0; i<25; i++)
	{
		vertices.push(vec4(pawnPoints[i][0], pawnPoints[i][1],
                                   pawnPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
	       for (var j = 0; j < 24; j++)
	        {
                var angle = (j+1)*t;

                // for each sweeping step, generate 25 new points corresponding to the original points
		           for(var i = 0; i < 25 ; i++ )
		           {
		                r = vertices[i][0];
                    vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		           }
	       }

       var N=25;
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<24; i++) // slices
       {
           for (var j=0; j<24; j++)  // layers
           {
		           quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
           }
       }
}

function quad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     // triangle a-c-d
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
}


function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

    modelView = mult(modelView, translate(0, 2, 0));
    modelView = mult(modelView, scale4(8, -8, 8));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, 0, 24*24*6);

    requestAnimFrame(render);
}

function scale4(a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
}
