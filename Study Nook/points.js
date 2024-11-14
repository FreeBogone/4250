// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// PROGRAM: points.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points and drawing
// shapes that are used in studynook.js

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),

        // file holder
        vec4( 0.5, 0, 0, 1.0 ),
        vec4( 0.5, 0.4, 0, 1.0 ),
        vec4( 0.5, 0.4, 0.1, 1.0 ),
        vec4( 0.5, 0.1, 0.3, 1.0 ),
        vec4( 0.5, 0, 0.3, 1.0 ),

        vec4( 0.25, 0, 0, 1.0 ),
        vec4( 0.25, 0.4, 0, 1.0 ),
        vec4( 0.25, 0.4, 0.1, 1.0 ),
        vec4( 0.25, 0.1, 0.3, 1.0 ),
        vec4( 0.25, 0, 0.3, 1.0 ),

        vec4( 0, 0, 0, 1.0 ),
        vec4( 0, 0.4, 0, 1.0 ),
        vec4( 0, 0.4, 0.1, 1.0 ),
        vec4( 0, 0.1, 0.3, 1.0 ),
        vec4( 0, 0, 0.3, 1.0 ),

        vec4( -0.25, 0, 0, 1.0 ),
        vec4( -0.25, 0.4, 0, 1.0 ),
        vec4( -0.25, 0.4, 0.1, 1.0 ),
        vec4( -0.25, 0.1, 0.3, 1.0 ),
        vec4( -0.25, 0, 0.3, 1.0 ),

        vec4( -0.5, 0, 0, 1.0 ),
        vec4( -0.5, 0.4, 0, 1.0 ),
        vec4( -0.5, 0.4, 0.1, 1.0 ),
        vec4( -0.5, 0.1, 0.3, 1.0 ),
        vec4( -0.5, 0, 0.3, 1.0 ),

        vec4( 0.5, 0, 0, 1.0 ),
        vec4( 0.5, 0, 0.3, 1.0 ),
        vec4( -0.5, 0, 0.3, 1.0 ),
        vec4( -0.5, 0, 0, 1.0 ),

        vec4( 0.5, 0.4, 0, 1.0 ),
        vec4( 0.5, 0, 0, 1.0 ),
        vec4( -0.5, 0, 0, 1.0 ),
        vec4( -0.5, 0.4, 0, 1.0 ),

        vec4( 0.5, 0.1, 0.3, 1.0 ),
        vec4( -0.5, 0.1, 0.3, 1.0 ),
        vec4( -0.5, 0, 0.3, 1.0 ),
        vec4( 0.5, 0, 0.3, 1.0 ),

        // curtain
        // part 1:
        vec4( 0.05, 0.8, 0.12, 1.0 ),
        vec4( 0, 0.8, 0, 1.0 ),
        vec4( 0, 0, 0, 1.0 ),
        vec4( 0.05, 0, 0.12, 1.0 ),

        vec4( 0.1, 0.8, 0.2, 1.0 ),
        vec4( 0.05, 0.8, 0.12, 1.0 ),
        vec4( 0.05, 0, 0.12, 1.0 ),
        vec4( 0.1, 0, 0.2, 1.0 ),

        vec4( 0.15, 0.8, 0.25, 1.0 ),
        vec4( 0.1, 0.8, 0.2, 1.0 ),
        vec4( 0.1, 0, 0.2, 1.0 ),
        vec4( 0.15, 0, 0.25, 1.0 ),

        vec4( 0.2, 0.8, 0.25, 1.0 ),
        vec4( 0.15, 0.8, 0.25, 1.0 ),
        vec4( 0.15, 0, 0.25, 1.0 ),
        vec4( 0.2, 0, 0.25, 1.0 ),

        vec4( 0.25, 0.8, 0.2, 1.0 ),
        vec4( 0.2, 0.8, 0.25, 1.0 ),
        vec4( 0.2, 0, 0.25, 1.0 ),
        vec4( 0.25, 0, 0.2, 1.0 ),

        vec4( 0.3, 0.8, 0.12, 1.0 ),
        vec4( 0.25, 0.8, 0.2, 1.0 ),
        vec4( 0.25, 0, 0.2, 1.0 ),
        vec4( 0.3, 0, 0.12, 1.0 ),

        vec4( 0.35, 0.8, 0, 1.0 ),
        vec4( 0.3, 0.8, 0.12, 1.0 ),
        vec4( 0.3, 0, 0.12, 1.0 ),
        vec4( 0.35, 0, 0, 1.0 ),

        vec4( 0.375, 0.8, -0.01, 1.0 ),
        vec4( 0.35, 0.8, 0, 1.0 ),
        vec4( 0.35, 0, 0, 1.0 ),
        vec4( 0.375, 0, -0.01, 1.0 ),

        vec4( 0.4, 0.8, 0, 1.0 ),
        vec4( 0.375, 0.8, -0.01, 1.0 ),
        vec4( 0.375, 0, -0.01, 1.0 ),
        vec4( 0.4, 0, 0, 1.0 ),

        // part 2:
        vec4( 0.45, 0.8, 0.12, 1.0 ),
        vec4( 0.4, 0.8, 0, 1.0 ),
        vec4( 0.4, 0, 0, 1.0 ),
        vec4( 0.45, 0, 0.12, 1.0 ),

        vec4( 0.5, 0.8, 0.2, 1.0 ),
        vec4( 0.45, 0.8, 0.12, 1.0 ),
        vec4( 0.45, 0, 0.12, 1.0 ),
        vec4( 0.5, 0, 0.2, 1.0 ),

        vec4( 0.55, 0.8, 0.25, 1.0 ),
        vec4( 0.5, 0.8, 0.2, 1.0 ),
        vec4( 0.5, 0, 0.2, 1.0 ),
        vec4( 0.55, 0, 0.25, 1.0 ),

        vec4( 0.6, 0.8, 0.25, 1.0 ),
        vec4( 0.55, 0.8, 0.25, 1.0 ),
        vec4( 0.55, 0, 0.25, 1.0 ),
        vec4( 0.6, 0, 0.25, 1.0 ),

        vec4( 0.65, 0.8, 0.2, 1.0 ),
        vec4( 0.6, 0.8, 0.25, 1.0 ),
        vec4( 0.6, 0, 0.25, 1.0 ),
        vec4( 0.65, 0, 0.2, 1.0 ),

        vec4( 0.7, 0.8, 0.12, 1.0 ),
        vec4( 0.65, 0.8, 0.2, 1.0 ),
        vec4( 0.65, 0, 0.2, 1.0 ),
        vec4( 0.7, 0, 0.12, 1.0 ),

        vec4( 0.75, 0.8, 0, 1.0 ),
        vec4( 0.7, 0.8, 0.12, 1.0 ),
        vec4( 0.7, 0, 0.12, 1.0 ),
        vec4( 0.75, 0, 0, 1.0 ),

        // book (inside)
        vec4( 0, 0.2, -0.05, 1.0 ),
        vec4( 0, 0.2, 0.05, 1.0 ),
        vec4( 0.2, 0.2, 0.05, 1.0 ),
        vec4( 0.2, 0.2, -0.05, 1.0 ),

        vec4( 0.2, 0.2, -0.05, 1.0 ),
        vec4( 0.2, 0.2, 0.05, 1.0 ),
        vec4( 0.2, -0.1, 0.05, 1.0 ),
        vec4( 0.2, -0.1, -0.05, 1.0 ),

        vec4( 0, -0.1, -0.05, 1.0 ),
        vec4( 0.2, -0.1, -0.05, 1.0 ),
        vec4( 0.2, -0.1, 0.05, 1.0 ),
        vec4( 0, -0.1, 0.05, 1.0 ),

        // book (outside)
        vec4( 0, 0.21, 0.05, 1.0 ),
        vec4( 0, 0.21, -0.05, 1.0 ),
        vec4( 0, -0.11, -0.05, 1.0 ),
        vec4( 0, -0.11, 0.05, 1.0 ),

        vec4( 0.2, 0.21, 0.05, 1.0 ),
        vec4( 0, 0.21, 0.05, 1.0 ),
        vec4( 0, -0.11, 0.05, 1.0 ),
        vec4( 0.2, -0.11, 0.05, 1.0 ),

        vec4( 0, 0.21, -0.05, 1.0 ),
        vec4( 0.21, 0.21, -0.05, 1.0 ),
        vec4( 0.21, -0.11, -0.05, 1.0 ),
        vec4( 0, -0.11, -0.05, 1.0 ),

    ];

// Draw solid sphere
function DrawSolidSphere(radius)
{
  	mvMatrixStack.push(modelViewMatrix);
  	s=scale4(radius, radius, radius);   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

   	// draw unit radius sphere
    for( var i=0; i<sphereCount; i+=3)
        gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

  	modelViewMatrix=mvMatrixStack.pop();
}

// Draw the solid cube
function DrawSolidCube(length)
{
  	mvMatrixStack.push(modelViewMatrix);
  	s=scale4(length, length, length );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
  	modelViewMatrix=mvMatrixStack.pop();
}

// Draw the file holder
function DrawFileHolder()
{
	  mvMatrixStack.push(modelViewMatrix);
    //modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount), fileHolderCount);
	  modelViewMatrix=mvMatrixStack.pop();
}

// Draw the curtain
function DrawCurtain()
{
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount), curtainCount);
}

// Draw the cylinder
function DrawCylinder(radius)
{
  	mvMatrixStack.push(modelViewMatrix);
    s=scale4(radius, radius, 1);   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount), cylinderCount);
  	modelViewMatrix=mvMatrixStack.pop();
}

// Store the points for a triangle in pointsArray
// (increment sphereCount by three)
function triangle(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     texCoordsArray.push(texCoord[0]);
     texCoordsArray.push(texCoord[1]);
     texCoordsArray.push(texCoord[2]);

     sphereCount += 3;
}

// Store the points for a trianle in pointsArray
// (sphereCount not incremented by three)
function triangle2(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     texCoordsArray.push(texCoord3[0]);
     texCoordsArray.push(texCoord3[1]);
     texCoordsArray.push(texCoord3[2]);
}

// Function used in generating the points for a sphere
function divideTriangle(a, b, c, count)
{
    if ( count > 0 )
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

// Function used in generating the points for a sphere
function tetrahedron(a, b, c, d, n)
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

// Save points for a quad in pointsArray
function quad(a, b, c, d)
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

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

// Save points for a pentagon in pointsArray
function pentagon(a, b, c, d, e) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[0]);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[1]);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[2]);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[0]);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[2]);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[3]);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[0]);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[3]);
     pointsArray.push(vertices[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord2[4]);
}

// Call quad to save the points for a cube
function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

// Generate cylinder points
function cylinder()
{
      SIZE=50; // slices
      center1 = vec3(0, 0, 0.5);
      center2 = vec3(0, 0, 0);
      radius = .5;
      var angle = 2*Math.PI/SIZE;
      var count = 0;
      // 105

      // generate the two circles and the connecting quads of a cylinder
      for  (var i=0; i<SIZE; i++) {
          // triangle forming a portion of one of the circles
          triangle2(vec4(center1[0], center1[1], center1[2], 1),
                   vec4(center1[0]+radius*Math.cos(i*angle), center1[1]+radius*Math.sin(i*angle), center1[2], 1),
                   vec4(center1[0]+radius*Math.cos((i+1)*angle), center1[1]+radius*Math.sin((i+1)*angle), center1[2], 1));

          // calculate points of connecting quad and save in the array vertices
          vertices.push(vec4(center2[0]+radius*Math.cos(i*angle), center2[1]+radius*Math.sin(i*angle), center2[2], 1));
          vertices.push(vec4(center2[0]+radius*Math.cos((i+1)*angle), center2[1]+radius*Math.sin((i+1)*angle), center2[2], 1));
          vertices.push(vec4(center1[0]+radius*Math.cos((i+1)*angle), center1[1]+radius*Math.sin((i+1)*angle), center1[2], 1));
          vertices.push(vec4(center1[0]+radius*Math.cos(i*angle), center1[1]+radius*Math.sin(i*angle), center1[2], 1));
          // call quad to save rectangle
          quad(133+count, 134+count, 135+count, 136+count);

          // triangle forming a portion of the other circle
          triangle2(vec4(center2[0], center2[1], center2[2], 1),
                   vec4(center2[0]+radius*Math.cos((i+1)*angle), center2[1]+radius*Math.sin((i+1)*angle), center2[2], 1),
                   vec4(center2[0]+radius*Math.cos(i*angle), center2[1]+radius*Math.sin(i*angle), center2[2], 1));

          count += 4;
      }
}

// Generate point for a sphere formed by revolution
function GenSpherePoints() {
    radius = 0.5;
    slices = 24;
    stacks = 8;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var prev, curr;

    var half=[];
    // generate half circle: PI/2 --> -PI/2
    // points are defined from top to bottom in the XY-plane
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc)
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<slices; i++) {

        var curr=[];
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // create the quads(triangles) for this slice
        //         ith slice      (i+1)th slice
        //           prev[j] ------ curr[j]
        //             |               |
        //             |               |
        //           prev[j+1] ---  curr[j+1]
        // each quad is defined with points specified in counter-clockwise rotation
        for (var j=0; j<stacks; j++)
            quad5(prev[j], prev[j+1], curr[j+1], curr[j]);

        prev = curr;
    }
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     1);
    return vv;
}

// Draw the wire sphere for the fan
function DrawWireSphere() {

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw wireframe
    gl.drawArrays(gl.LINES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount+cylinderCount+additionalCount), wireCount);
}

// generate points for an open cylinder (no top or bottom)
function openCylinder()
{
    var my_count = 0;
    slices = 32;
    var sliceInc = 2*Math.PI/slices;

    var curr1, curr2, prev1, prev2;

    var radius = .5;
    var height = 2.5;

    var half = [];
    // number of stacks = number of points - 1 = 25 - 1 = 24
    for (var i=0; i<25; i++)
    {
      half.push(vec4(radius, height*i/24, 0, 1.0));
    }

    for (var i=0; i<4; i++) {
        // the initial two points
        prev1=init1=half[i];
        prev2=init2=half[i+1];

        // rotate around y axis
        for (var j=0; j<slices; j++) {
            var m=rotate((j+1)*360/slices, 0, 1, 0);
            curr1 = multiply(m, init1);
            curr2 = multiply(m, init2);
            my_count +=1;
            quad5(prev1, curr1, curr2, prev2);

            // currs used as prevs for the next two points
            prev1 = curr1;
            prev2 = curr2;
        }
    }
}

// General quad function. Not attached to a specific vector array.
// Used by openCylinder
function quad5(a, b, c, d) {

    var t1 = subtract(b, a);
    var t2 = subtract(c, b);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    pointsArray.push(a);
    pointsArray.push(c);
    pointsArray.push(d);

    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[1]);
    texCoordsArray.push(texCoord[2]);
    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[2]);
    texCoordsArray.push(texCoord[3]);

    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
}

// Draw the open cylinder (used as past of the fan)
function DrawOpenCylinder() {

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    // draw open cylinder
    gl.drawArrays(gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount), openCylinderCount);
}

// Draw the open cylinder (used as past of the fan)
function DrawOpenWireCylinder() {

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    // draw open wire cylinder
    gl.drawArrays(gl.LINES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount), openCylinderCount);
}

function GenerateSphereRevolution1(radius, slices, stacks)
{
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var prev, curr;
    var curr1, curr2, prev1, prev2;

    var half=[];
    // generate half circle: PI/2 (0) --> -PI/2 (stack)
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) {
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=0; i<slices; i++) {

        var curr=[];
        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // create the quads(triangles) for this slice
        //         ith slice      (i+1)th slice
        //           prev[j] ------ curr[j]
        //             |               |
        //             |               |
        //           prev[j+1] ---  curr[j+1]
        // each quad is defined with points specified in counter-clockwise rotation
        for (var j=0; j<stacks; j++)
            quad5(prev[j], prev[j+1], curr[j+1], curr[j]);

        prev = curr;
    }
}

function multiply2(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

// Sphere made up of more slices and stacks, whole
function DrawSphereSimple(radius) {
    var s = scale4(radius, radius, radius);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, EndPartTwoCount+510+revolutionSphereCount, revolutionSphereLargeCount);
}

// Sphere made up of fewer slices and stacks, whole, miniscule radius
function DrawSphereSimple2(radius) {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, EndPartTwoCount+510, revolutionSphereCount);
}

// Sphere made up of more slices and stacks, not whole
function DrawSphereSimple3(radius) {
    var s = scale4(radius, radius, radius);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, EndPartTwoCount+510+revolutionSphereCount-1, revolutionSphereLargeCount);
}

// Sphere made up of fewer slices and stacks, whole
function DrawSphereSimple4(radius) {
    var s = scale4(radius, radius, radius);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, EndPartTwoCount+510+revolutionSphereCount+revolutionSphereLargeCount, revolutionSphereCount2);
}

var roofPoints = [
    vec4(-0.1, 0, -0.1, 1),
    vec4(1.3, 1, 1.3, 1),
    vec4(1.3, 0, -0.1, 1),
    vec4(-0.1, 0, 1.3, 1)
]

// Save roof points
function roof()
{
    quad5(roofPoints[2], roofPoints[0], roofPoints[1], roofPoints[1]);
    quad5(roofPoints[0], roofPoints[3], roofPoints[1], roofPoints[1]);
}

function DrawRoof() {
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
                        "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.drawArrays( gl.TRIANGLES,EndPartTwoCount+510+revolutionSphereCount+revolutionSphereLargeCount+revolutionSphereCount2+6+candleCount+potCount, 12);
}
