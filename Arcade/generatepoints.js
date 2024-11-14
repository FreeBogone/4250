//*******************************************************************************
//* Program: generatepoints.js
//* Authors: Taylor Harvin
//*          Alex Charles
//* Vertex definition information for Project Four
//*
//* NOTE:     Some borrowed and modified from Dr. Li's ortho.js 
//*           and surfaceRevolution.js
//*           Each primitive function requires that you pass in the source array
//*           from which to choose the vertices rather than using a certain array.
//*
//*           This is mostly a mess just because of the sheer number of vertex 
//*           definitions, but it's all mostly straightforward. 
//*           Vertex definitions -> generate objects 
//*             (ex. objPoints -> generateObj).
//*******************************************************************************

function GeneratePoints()
{
    // See charlesharvinp4.js for the Scene definition.
    Scene.objects["goblet"] = new Scene.SceneObject(points.length, 1014, gl.TRIANGLES);
    generateGoblet();

    Scene.objects["gun"] = new Scene.SceneObject(points.length, 282, gl.TRIANGLES);
    generateGun();

    Scene.objects["target"] = new Scene.SceneObject(points.length, 300, gl.TRIANGLES);
    generateTarget();

    Scene.objects["giraffe"] = new Scene.SceneObject(points.length, 528, gl.TRIANGLES);
    generateGiraffe();

    Scene.objects["cube"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 5);
    quad( cubePoints, 2, 3, 7, 6, 5);
    quad( cubePoints, 3, 0, 4, 7, 5);
    quad( cubePoints, 6, 5, 1, 2, 5);
    quad( cubePoints, 4, 5, 6, 7, 5);
    quad( cubePoints, 5, 4, 0, 1, 5);

    Scene.objects["darkcube"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 10);
    quad( cubePoints, 2, 3, 7, 6, 10);
    quad( cubePoints, 3, 0, 4, 7, 10);
    quad( cubePoints, 6, 5, 1, 2, 10);
    quad( cubePoints, 4, 5, 6, 7, 10);
    quad( cubePoints, 5, 4, 0, 1, 10);

    Scene.objects["sign"] = new Scene.SceneObject(points.length, 150, gl.TRIANGLES);
    generateSign();
}

// Definitions for different colors.
var vertexColors = [
  vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
  vec4( 0.5, 0.5, 0.0, 1.0 ),  // yellow
  vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
  vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
  vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
  vec4( 97/255, 66/255, 0, 1.0 ),  // brownish
  vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
  vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
  vec4( 166/255, 166/255, 166/255, 1.0 ), // grey
  vec4( 89/255, 89/255, 89/255, 1.0 ), // dark grey
  vec4( 56/255, 38/255, 0, 1.0 ),  // brownish
];

// Calculate the normals for the indices in sourceArray.
function Newell(sourceArray, indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (sourceArray[index][1] - sourceArray[nextIndex][1])*
            (sourceArray[index][2] + sourceArray[nextIndex][2]);
       y += (sourceArray[index][2] - sourceArray[nextIndex][2])*
            (sourceArray[index][0] + sourceArray[nextIndex][0]);
       z += (sourceArray[index][0] - sourceArray[nextIndex][0])*
            (sourceArray[index][1] + sourceArray[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}


function SurfaceRevolution(pointsArray) {
  var tempVertices = [];

  var len = pointsArray.length;

  for (var i = 0; i<len; i++) {
        tempVertices.push( vec4(pointsArray[i][0], 
                                pointsArray[i][1], 
                                pointsArray[i][2], 1) );
  }

  var r;
  var t=Math.PI/6;

  for (var j = 0; j < len-1; j++) {
    var angle = (j+1)*t; 

    // for each sweeping step, generate 25 new points corresponding to the original points
    for(var i = 0; i < 14 ; i++ ) {   
        r = tempVertices[i][0];
        tempVertices.push( vec4(r*Math.cos(angle), 
                           tempVertices[i][1], 
                           -r*Math.sin(angle), 1) );
    }       
  }
 
  // quad strips are formed slice by slice (not layer by layer)
  for (var i = 0; i < len-1; i++) {
    for (var j = 0; j < len-1; j++) {
      quad( tempVertices,
            i*len+j, 
            (i+1)*len+j, 
            (i+1)*len+(j+1), 
            i*len+(j+1),
            1); 
    }
  }  
}

function quad(sourceArray, a, b, c, d, colorIndex) {

  var indices=[a, b, c, d];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[b]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);   
  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[d]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

// General triangle generation
function triangle(sourceArray, a, b, c, colorIndex) {

  var indices=[a, b, c];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[b]); 
    colors.push(vertexColors[colorIndex]); 
    normals.push(normal);
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

// General shape
function generalShape(sourceArray, vertGroup, center, colorGroup) {
  var colorIndex = 0;
  for(var i = 0; i < vertGroup.length-1; i++) {
    var indices=[vertGroup[i], center, vertGroup[i+1]];
    var normal = Newell(sourceArray, indices);

    points.push(sourceArray[vertGroup[i]]); 
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal); 
    points.push(sourceArray[center]); 
      colors.push(vertexColors[colorGroup[colorIndex]]); 
      normals.push(normal);
    points.push(sourceArray[vertGroup[i+1]]);
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal);
    if(colorIndex < colorGroup.length-1)
      colorIndex++;
  }
}

// Form an octagon shape
// 24 points
function octagon(sourceArray, a, b, c, d, e, f, g, h, center, colorIndex) {

  var indices=[a, b, c, d, e, f, g, h];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  
  points.push(sourceArray[c]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[e]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  
  points.push(sourceArray[e]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[f]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[f]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[g]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  
  
  points.push(sourceArray[g]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[h]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 

  points.push(sourceArray[h]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal); 
  points.push(sourceArray[a]); 
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

// All verticies for the 3D gun
var gunPoints = [
  // back
  vec4(0.5,  -1,  0, 1.0 ), // A    0
  vec4(0.2,  -1,  0, 1.0 ), // B    1
  vec4(0.2,-0.5,  0, 1.0 ), // C    2
  vec4(0.5, 0,  0, 1.0 ), // D    3
  vec4(0.2,  0.3,  0.075, 1.0 ), // E   4
  vec4(0.1,  -0.2,  0.075, 1.0 ), // F    5
  vec4(-0.075,  0,  0.075, 1.0 ), // G    6
  vec4(0,  0.3,  0, 1.0 ), // H   7
  vec4(0.1,  0.5,  0.25, 1.0 ), // I    8
  vec4(-0.325,  0.3,  0, 1.0 ), // J  9
  vec4(-0.575,  0,  0.075, 1.0 ), // K  10
  vec4(-0.575,  0.5,  0.25, 1.0 ), // L   11
  vec4(-0.825,  0.3,  0, 1.0 ), // M    12
  vec4(-1.075,  0,  0.075, 1.0 ), // N  13
  vec4(-1.075,  0.5,  0.25, 1.0 ), // O   14
  vec4(-1.325,  0.3,  0, 1.0 ), // P    15
  vec4(-1.575,  0,  0.075, 1.0 ), // Q    16

  
  // Front
  vec4(0.5,  -1,  0.5, 1.0 ), // A    17
  vec4(0.2,  -1,  0.5, 1.0 ), // B    18
  vec4(0.2,-0.5,  0.5, 1.0 ), // C    19
  vec4(0.5, 0,  0.5, 1.0 ), // D    20
  vec4(0.2,  0.3,  0.425, 1.0 ), // E   21
  vec4(0.1,  -0.2,  0.425, 1.0 ), // F    22
  vec4(-0.075,  0,  0.425, 1.0 ), // G    23
  vec4(0,  0.3,  0.5, 1.0 ), // H   24
  //vec4(0.1,  0.35,  0.25, 1.0 ), // I
  vec4(-0.325,  0.3,  0.5, 1.0 ), // J  25
  vec4(-0.575,  0,  0.425, 1.0 ), // K  26
  //vec4(-0.575,  0.35,  0.25, 1.0 ), // L
  vec4(-0.825,  0.3,  0.5, 1.0 ), // M    27
  vec4(-1.075,  0,  0.425, 1.0 ), // N  28
  //vec4(-1.075,  0.35,  0.25, 1.0 ), // O
  vec4(-1.325,  0.3,  0.5, 1.0 ), // P    29
  vec4(-1.575,  0,  0.425, 1.0 ), // Q    30
  
  
  // Gun barrell -- Front
  vec4(-1.775*1.5,0, 0.25, 1.0 ), // 31
  vec4(-1.775*1.5,0,0.35, 1.0 ),    // 32
  vec4(-1.775*1.5,0.1,0.45, 1.0 ),  // 33
  vec4(-1.775*1.5,0.2,0.45, 1.0 ),  // 34
  vec4(-1.775*1.5,0.3,0.35, 1.0 ),  // 35
  vec4(-1.775*1.5,0.3,0.25, 1.0 ),  // 36
  vec4(-1.775*1.5,0.2,0.15, 1.0 ),  // 37
  vec4(-1.775*1.5,0.1,0.15, 1.0 ),  // 38
  vec4(-1.775*1.5,0.15,0.3, 1.0 ),  // 39
  
  // Gun barrell -- Back
  vec4(-1.525,0, 0.25, 1.0 ), // 40  -- bottom back
  vec4(-1.525,0,0.35, 1.0 ),    // 41  -- bottom front
  vec4(-1.475,0.1,0.45, 1.0 ),  // 42 -- front side bottom
  vec4(-1.425,0.2,0.45, 1.0 ),  // 43 -- front side top
  vec4(-1.325,0.3,0.35, 1.0 ),    // 44 -- top front
  vec4(-1.325,0.3,0.25, 1.0 ),  // 45 -- top back
  vec4(-1.425,0.2,0.15, 1.0 ),  // 46 -- back side top
  vec4(-1.475,0.1,0.15, 1.0 ),  // 47 -- back side bottom
  vec4(-1.45,0.15,0.3, 1.0 ), // 48 -- center
  
  // Trigger:
  // Top
  vec4(-0.175,  0,  0.075, 1.0 ),   // 49 
  vec4(-0.175,  0,  0.425, 1.0 ),   // 50
  // bottom
  vec4(-0.3,  -0.4,  0.075, 1.0 ),  // 51
  vec4(-0.3,  -0.4,  0.425, 1.0 ),  // 52
  
];

// All verticies for the 3D target
var targetPoints = [
    // Front
  vec4(-1,  -1.8,  0, 1.0 ), // A   0
  vec4(-1,  -1.4,  0, 1.0 ), // B   1
  vec4(-0.2,-1.4,  0, 1.0 ), // C   2
  vec4(0.2, -1.4,  0, 1.0 ), // D   3
  vec4(1,  -1.4,  0, 1.0 ), // E    4
  vec4(1,  -1.8,  0, 1.0 ), // F    5
  vec4(-0.2,  -1,  0, 1.0 ), // G   6
  vec4(0.2,  -1,  0, 1.0 ), // H    7
  vec4(-1,  -0.2,  0, 1.0 ), // I   8
  vec4(-1.4,  -0.2,  0, 1.0 ), // J   9
  vec4(-1.4,  0.2,  0, 1.0 ), // K    10
  vec4(-1,  0.2,  0, 1.0 ), // L    11
  vec4(-0.2,  1,  0, 1.0 ), // M    12
  vec4(-0.2,  1.4,  0, 1.0 ), // N    13
  vec4(0.2,  1.4,  0, 1.0 ), // O   14
  vec4(0.2,  1,  0, 1.0 ), // P   15
  vec4(1,  0.2,  0, 1.0 ), // Q   16
  vec4(1.4,  0.2,  0, 1.0 ), // R   17
  vec4(1,  -0.2,  0, 1.0 ), // S    18
  vec4(1.4,  -0.2,  0, 1.0 ), // T    19
  vec4(0,  0,  0, 1.0 ), // U   20
  
  // Back
  vec4(-1,  -1.8,  0.4, 1.0 ), // A   21
  vec4(-1,  -1.4,  0.4, 1.0 ), // B   22
  vec4(-0.2,-1.4,  0.4, 1.0 ), // C   23
  vec4(0.2, -1.4,  0.4, 1.0 ), // D   24
  vec4(1,  -1.4,  0.4, 1.0 ), // E    25
  vec4(1,  -1.8,  0.4, 1.0 ), // F    26
  vec4(-0.2,  -1,  0.4, 1.0 ), // G   27
  vec4(0.2,  -1,  0.4, 1.0 ), // H    28
  vec4(-1,  -0.2,  0.4, 1.0 ), // I   29
  vec4(-1.4,  -0.2,  0.4, 1.0 ), // J 30
  vec4(-1.4,  0.2,  0.4, 1.0 ), // K  31
  vec4(-1,  0.2,  0.4, 1.0 ), // L    32
  vec4(-0.2,  1,  0.4, 1.0 ), // M    33
  vec4(-0.2,  1.4,  0.4, 1.0 ), // N  34
  vec4(0.2,  1.4,  0.4, 1.0 ), // O   35
  vec4(0.2,  1,  0.4, 1.0 ), // P   36
  vec4(1,  0.2,  0.4, 1.0 ), // Q   37
  vec4(1.4,  0.2,  0.4, 1.0 ), // R   38
  vec4(1,  -0.2,  0.4, 1.0 ), // S    39
  vec4(1.4,  -0.2,  0.4, 1.0 ), // T  40
  vec4(0,  0,  0.4, 1.0 ), // U     41
  
  
  // Inner target 1
  vec4(-0.2,  -0.8,  0.41, 1.0 ), // G    42
  vec4(0.2,  -0.8,  0.41, 1.0 ), // H   43
  vec4(0.8,  -0.2,  0.41, 1.0 ), // S   44
  vec4(0.8,  0.2,  0.41, 1.0 ), // Q      45
  vec4(0.2,  0.8,  0.41, 1.0 ), // P      46
  vec4(-0.2,  0.8,  0.41, 1.0 ), // M   47
  vec4(-0.8,  0.2,  0.41, 1.0 ), // L   48
  vec4(-0.8,  -0.2,  0.41, 1.0 ), // I    49
  vec4(0,  0,  0.41, 1.0 ), // U        50
  
  // Inner target 2
  vec4(-0.2,  -0.6,  0.42, 1.0 ), // G    51
  vec4(0.2,  -0.6,  0.42, 1.0 ), // H     52
  vec4(0.6,  -0.2,  0.42, 1.0 ), // S     53
  vec4(0.6,  0.2,  0.42, 1.0 ), // Q      54
  vec4(0.2,  0.6,  0.42, 1.0 ), // P      55
  vec4(-0.2,  0.6,  0.42, 1.0 ), // M     56
  vec4(-0.6,  0.2,  0.42, 1.0 ), // L     57
  vec4(-0.6,  -0.2,  0.42, 1.0 ), // I    58
  vec4(0,  0,  0.42, 1.0 ), // U        59
  
  // Inner target 3
  vec4(-0.2,  -0.4,  0.43, 1.0 ), // G    60
  vec4(0.2,  -0.4,  0.43, 1.0 ), // H     61
  vec4(0.4,  -0.2,  0.43, 1.0 ), // S     62
  vec4(0.4,  0.2,  0.43, 1.0 ), // Q      63
  vec4(0.2,  0.4,  0.43, 1.0 ), // P      64
  vec4(-0.2,  0.4,  0.43, 1.0 ), // M     65
  vec4(-0.4,  0.2,  0.43, 1.0 ), // L     66
  vec4(-0.4,  -0.2,  0.43, 1.0 ), // I    67
  vec4(0,  0,  0.43, 1.0 ), // U        68
];

// All verticies for the 3D giraffe
var giraffePoints = [
  // Front
  vec4(-0.3,  -0.5,  0.5, 1.0 ), // A      0
  vec4(-0.1,  -0.35,  0.5, 1.0 ), // B    1
  vec4(0,-0.35,  0.5, 1.0 ), // C        2
  vec4(0.1, -0.5,  0.5, 1.0 ), // D      3
  vec4(0.1,  -0.25,  0.5, 1.0 ), // E    4
  vec4(0.1,  0,  0.5, 1.0 ), // F      5
  vec4(0.2,  0.1,  0.5, 1.0 ), // G    6
  vec4(0.8,  0.1,  0.5, 1.0 ), // H    7
  vec4(0.9,  0,  0.5, 1.0 ), // I      8
  vec4(0.9,  -0.25,  0.5, 1.0 ), // J    9
  vec4(0.9,  -0.35,  0.5, 1.0 ), // K    10
  vec4(0.8,  -0.35,  0.5, 1.0 ), // L    11
  vec4(0.7,  -0.5,  0.5, 1.0 ), // M    12
  vec4(1.1,  -0.5,  0.5, 1.0 ), // N    13
  vec4(1.0,  -0.25,  0.5, 1.0 ), // O    14
  vec4(1.0,  0,  0.5, 1.0 ), // P      15
  vec4(1.0,  0.5,  0.5, 1.0 ), // Q    16
  vec4(0.8,  0.6,  0.5, 1.0 ), // R    17
  vec4(0.2,  0.6,  0.5, 1.0 ), // S    18
  vec4(0, 0.7,  0.5, 1.0 ), // T      19
  vec4(-0.5,  1.2,  0.5, 1.0 ), // U    20
  vec4(-0.4,  1.3,  0.5, 1.0 ), // V    21
  vec4(-0.55,  1.25,  0.5, 1.0 ), // W  22
  vec4(-0.6,  1.25,  0.5, 1.0 ), // X    23
  vec4(-1.0,  1.25,  0.5, 1.0 ), // Y    24
  vec4(-1.05,  1.1,  0.5, 1.0 ), // Z    25
  vec4(-1.0,  1.0,  0.5, 1.0 ), // P1    26
  vec4(-0.6,  1.0,  0.5, 1.0 ), // P2    27
  vec4(-0.5,  0.9,  0.5, 1.0 ), // P3    28
  vec4(0.0, 0.35,  0.5, 1.0 ), // P4    29
  vec4(0,  0,  0.5, 1.0 ), // P5      30
  vec4(0.0, -0.25,  0.5, 1.0 ), // P6    31
  
  // Back
  vec4(-0.3,  -0.5,  0, 1.0 ), // A    32
  vec4(-0.1,  -0.35,  0, 1.0 ), // B    33
  vec4(0,-0.35,  0, 1.0 ), // C      34
  vec4(0.1, -0.5,  0, 1.0 ), // D      35
  vec4(0.1,  -0.25,  0, 1.0 ), // E    36
  vec4(0.1,  0,  0, 1.0 ), // F      37
  vec4(0.2,  0.1,  0, 1.0 ), // G      38
  vec4(0.8,  0.1,  0, 1.0 ), // H      39
  vec4(0.9,  0,  0, 1.0 ), // I      40
  vec4(0.9,  -0.25,  0, 1.0 ), // J    41
  vec4(0.9,  -0.35,  0, 1.0 ), // K    42
  vec4(0.8,  -0.35,  0, 1.0 ), // L    43
  vec4(0.7,  -0.5,  0, 1.0 ), // M    44
  vec4(1.1,  -0.5,  0, 1.0 ), // N    45
  vec4(1.0,  -0.25,  0, 1.0 ), // O    46
  vec4(1.0,  0,  0, 1.0 ), // P      47
  vec4(1.0,  0.5,  0, 1.0 ), // Q      48
  vec4(0.8,  0.6,  0, 1.0 ), // R      49
  vec4(0.2,  0.6,  0, 1.0 ), // S      50
  vec4(0, 0.7,  0, 1.0 ), // T      51
  vec4(-0.5,  1.2,  0, 1.0 ), // U    52
  vec4(-0.4,  1.3,  0, 1.0 ), // V    53
  vec4(-0.55,  1.25,  0, 1.0 ), // W    54
  vec4(-0.6,  1.25,  0, 1.0 ), // X    55
  vec4(-1.0,  1.25,  0, 1.0 ), // Y    56
  vec4(-1.05,  1.1,  0, 1.0 ), // Z    57
  vec4(-1.0,  1.0,  0, 1.0 ), // P1    58
  vec4(-0.6,  1.0,  0, 1.0 ), // P2    59
  vec4(-0.5,  0.9,  0, 1.0 ), // P3    60
  vec4(0.0, 0.35,  0, 1.0 ), // P4    61
  vec4(0,  0,  0, 1.0 ), // P5      62
  vec4(0.0, -0.25,  0, 1.0 ), // P6    63
  
  
  // Inner leg --front, front
  vec4(-0.3,  -0.5,  0.375, 1.0 ), // A      64
  vec4(-0.1,  -0.35, 0.375, 1.0 ), // B    65
  vec4(0,-0.35,  0.375, 1.0 ), // C        66
  vec4(0.1, -0.5,  0.375, 1.0 ), // D      67
  vec4(0.1,  -0.25,  0.375, 1.0 ), // E      68
  vec4(0.1,  0,  0.375, 1.0 ), // F        69
  vec4(0,  0,  0.375, 1.0 ), // P5        70
  vec4(0.0, -0.25,  0.375, 1.0 ), // P6      71
  
  // Inner leg -- front, back
  vec4(-0.3,  -0.5,  0.125, 1.0 ), // A      72
  vec4(-0.1,  -0.35, 0.125, 1.0 ), // B      73
  vec4(0,-0.35,  0.125, 1.0 ), // C        74
  vec4(0.1, -0.5,  0.125, 1.0 ), // D        75
  vec4(0.1,  -0.25,  0.125, 1.0 ), // E      76
  vec4(0.1,  0,  0.125, 1.0 ), // F        77
  vec4(0,  0,  0.125, 1.0 ), // P5        78
  vec4(0.0, -0.25,  0.125, 1.0 ), // P6      79
  
  
  // Inner leg --back, front
  vec4(0.7,  -0.5,  0.375, 1.0 ), // M    80
  vec4(0.8,  -0.35,  0.375, 1.0 ), // L    81
  vec4(0.9,  -0.35,  0.375, 1.0 ), // K    82
  vec4(1.1,  -0.5,  0.375, 1.0 ), // N    83
  vec4(1.0,  -0.25,  0.375, 1.0 ), // O    84
  vec4(1.0,  0,  0.375, 1.0 ), // P      85
  vec4(0.9,  0,  0.375, 1.0 ), // I      86
  vec4(0.9,  -0.25,  0.375, 1.0 ), // J    87
  
  // Inner leg -- back, back
  vec4(0.7,  -0.5,  0.125, 1.0 ), // M    88
  vec4(0.8,  -0.35,  0.125, 1.0 ), // L    89
  vec4(0.9,  -0.35,  0.125, 1.0 ), // K    90
  vec4(1.1,  -0.5,  0.125, 1.0 ), // N    91
  vec4(1.0,  -0.25,  0.125, 1.0 ), // O    92
  vec4(1.0,  0,  0.125, 1.0 ), // P      93
  vec4(0.9,  0,  0.125, 1.0 ), // I      94
  vec4(0.9,  -0.25,  0.125, 1.0 ), // J    95
    
];

// All verticies for the 3D target
var signPoints = [
  // Front
  vec4(0.9, 0,  0.5, 1.0 ), // A      0
  vec4(0.9, 0.2,  0.5, 1.0 ), // B    1
  vec4(0.6, 0.2,  0.5, 1.0 ), // C    2
  vec4(0.6, 0.4,  0.5, 1.0 ), // D    3
  vec4(0.3,  0.4,  0.5, 1.0 ), // E   4
  vec4(0.3,  0.6,  0.5, 1.0 ), // F   5
  vec4(0,  0.6,  0.5, 1.0 ), // G     6
  vec4(-0.3,  0.6,  0.5, 1.0 ), // H    7
  vec4(-0.3,  0.4,  0.5, 1.0 ), // I    8
  vec4(-0.6,  0.4,  0.5, 1.0 ), // J    9
  vec4(-0.6,  0.2,  0.5, 1.0 ), // K    10
  vec4(-0.9,  0.2,  0.5, 1.0 ), // L    11
  vec4(-0.9,  0,  0.5, 1.0 ), // M    12
  vec4(0,  0,  0.5, 1.0 ), // N     13

  
  // Back
  vec4(0.9, 0,  0, 1.0 ), // A      14
  vec4(0.9, 0.2,  0, 1.0 ), // B      15
  vec4(0.6, 0.2,  0, 1.0 ), // C      16
  vec4(0.6, 0.4,  0, 1.0 ), // D      17
  vec4(0.3,  0.4,  0, 1.0 ), // E     18
  vec4(0.3,  0.6,  0, 1.0 ), // F     19
  vec4(0,  0.6,  0, 1.0 ), // G     20
  vec4(-0.3,  0.6,  0, 1.0 ), // H    21
  vec4(-0.3,  0.4,  0, 1.0 ), // I    22
  vec4(-0.6,  0.4,  0, 1.0 ), // J    23
  vec4(-0.6,  0.2,  0, 1.0 ), // K    24
  vec4(-0.9,  0.2,  0, 1.0 ), // L    25
  vec4(-0.9,  0,  0, 1.0 ), // M      26
  vec4(0,  0,  0, 1.0 ), // N       27
];

var gobletPoints = [
  vec4(.3, 0, 0, 1.0),
  vec4(.25, .1, 0, 1.0),
  vec4(.18, .125, 0, 1.0),
  vec4(.05, .2, 0, 1.0),
  vec4(.05, .25, 0, 1.0),
  vec4(.07, .28, 0, 1.0),
  vec4(.25, .32, 0, 1.0),
  vec4(.3, .45, 0, 1.0),
  vec4(.4, .52, 0, 1.0),
  vec4(.46, .6, 0, 1.0),
  vec4(.5, .75, 0, 1.0),
  vec4(.51, .875, 0, 1.0),
  vec4(.53, .875, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
];

var cubePoints = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5, -0.5, -0.5, 1.0 ),
];

// Creates 31 quads
// 14 triangles
// 2 octos
function generateGun() {
  // back
  quad( gunPoints, 3, 2, 1, 0,  0);
  quad( gunPoints, 3, 4, 5, 2,  7);
  quad( gunPoints, 4, 7, 6, 5,  7);
  quad( gunPoints, 7, 9, 10, 6,  7);
  quad( gunPoints, 9, 12, 13, 10,  0);
  quad( gunPoints, 12, 15, 16, 13,  0);
  triangle( gunPoints, 8, 9, 4,  3);
  triangle( gunPoints, 8, 11, 9,  3);
  triangle( gunPoints, 11, 12, 9,  3);
  triangle( gunPoints, 11, 14, 12,  3);
  triangle( gunPoints, 14, 15, 12,  3);
  
  // Sides
  quad( gunPoints, 20,  21,  4,  3,  7); // 13
  quad( gunPoints, 17,  20,  3,  0,  6); // 14
  quad( gunPoints, 0,  1,  18,  17,  7); // bot of gun handle
  quad( gunPoints, 2,  19,  18,  1,  6); // front of gun handle
  quad( gunPoints, 2,  5,  22,  19,  6); // front of gun handle -- bot curve
  quad( gunPoints, 5,  6,  23,  22,  6); // front of gun handle -- top curve
  quad( gunPoints, 6,  10,  26,  23,  6); // first bottom
  quad( gunPoints, 10,  13,  28,  26,  7); // second bottom
  quad( gunPoints, 13,  16,  30,  28,  7); // third bottom
  quad( gunPoints, 15,  29,  30,  16,  7); // Front ( gunPoints, before tube)
  triangle( gunPoints, 21, 8, 4,  6); // 12
  triangle( gunPoints, 15, 14, 29,  6); // 12  // Front
  
  //front
  quad( gunPoints, 17, 18, 19, 20,  0);
  quad( gunPoints, 19, 22, 21, 20,  7);
  quad( gunPoints, 22, 23, 24, 21,  7);
  quad( gunPoints, 23, 26, 25, 24,  7);
  quad( gunPoints, 26, 28, 27, 25,  0);
  quad( gunPoints, 28, 30, 29, 27,  0);
  triangle( gunPoints, 21, 25, 8,  3);
  triangle( gunPoints, 25, 11, 8,  3);
  triangle( gunPoints, 25, 27, 11,  3);
  triangle( gunPoints, 27, 14, 11,  3);
  triangle( gunPoints, 27, 29, 14,  3);
  
  
  // Barrel of the gun
  octagon( gunPoints, 31, 32, 33, 34, 35, 36, 37, 38, 39,  7);
  octagon( gunPoints, 40, 41, 42, 43, 44, 45, 46, 47, 48,  7);
  quad( gunPoints, 36, 45, 44, 35,  8);
  quad( gunPoints, 46, 45, 36, 37,  9);
  quad( gunPoints, 38, 47, 46, 37,  0);
  quad( gunPoints, 31, 40, 47, 38,  9);
  quad( gunPoints, 32, 41, 40, 31,  8);
  quad( gunPoints, 33, 42, 41, 32,  9);
  quad( gunPoints, 34, 43, 42, 33,  0);
  quad( gunPoints, 35, 44, 43, 34,  9);
  
  // Trigger:
  triangle( gunPoints, 49, 51, 6,  0);
  quad( gunPoints, 50, 52, 51, 49,  3);
  quad( gunPoints, 6, 51, 52, 23,  7);
  triangle( gunPoints, 52, 50, 23,  0);
}

// 31 quads
// 5 octo
function generateTarget(){
  // Back
  quad( targetPoints, 5, 4, 1, 0, 7);  //  6
  quad( targetPoints, 3, 7, 6, 2, 7);  //  6
  octagon( targetPoints, 8, 11, 12, 15, 16, 18, 7, 6, 20,  7); //  24`
  quad( targetPoints, 19, 17, 16, 18, 7);  //  6
  quad( targetPoints, 15, 14, 13, 12, 7);  //  6
  quad( targetPoints, 11, 10, 9, 8, 7);  //  6
  
  // Side:
  // Bottom box
  quad( targetPoints, 1, 22, 21, 0, 3);
  quad( targetPoints, 2, 23, 22, 1, 3);
  quad( targetPoints, 4, 25, 24, 3, 3);
  quad( targetPoints, 26, 25, 4, 5, 3);
  quad( targetPoints, 0, 21, 26, 5, 3);
  // main
  quad( targetPoints, 6, 27, 23, 2, 3);
  quad( targetPoints, 24, 28, 7, 3, 3);
  
  quad( targetPoints, 28, 39, 18, 7, 3);
  
  quad( targetPoints, 39, 40, 19, 18, 3);
  quad( targetPoints, 40, 38, 17, 19, 3);
  quad( targetPoints, 38, 37, 16, 17, 3);
  
  quad( targetPoints, 37, 36, 15, 16, 3);
  
  
  quad( targetPoints, 36, 35, 14, 15, 3);
  quad( targetPoints, 35, 34, 13, 14, 3);
  quad( targetPoints, 34, 33, 12, 13, 3);
  
  quad( targetPoints, 33, 32, 11, 12, 3);
  
  quad( targetPoints, 32, 31, 10, 11, 3);
  quad( targetPoints, 31, 30, 9, 10, 3);
  quad( targetPoints, 30, 29, 8, 9, 3);
  
  quad( targetPoints, 29, 27, 6, 8, 3);
  
  // Front
  quad( targetPoints, 21, 22, 25, 26, 0);  //  6
  quad( targetPoints, 23, 27, 28, 24, 0);  //  6
  octagon( targetPoints, 27, 28, 39, 37, 36, 33, 32, 29, 41,  0); //  24`
  quad( targetPoints, 39, 37, 38, 40, 0);  //  6
  quad( targetPoints, 33, 34, 35, 36, 0);  //  6
  quad( targetPoints, 29, 30, 31, 32, 0);  //  6
  
  
  // Inner target  1
  octagon( targetPoints, 44, 45, 46, 47, 48, 49, 42, 43, 50, 1);
  octagon( targetPoints, 53, 54, 55, 56, 57, 58, 51, 52, 59, 2);
  octagon( targetPoints, 62, 63, 64, 65, 66, 67, 60, 61, 68, 7);
}

// 84 quad
// 8 triangle
function generateGiraffe(){
  // Front
  quad( giraffePoints, 0, 1, 2, 3, 7);  //  1
  quad( giraffePoints, 2, 31, 4, 3, 7);  //  2
  quad( giraffePoints, 31, 30, 5, 4, 7);  //  3
  quad( giraffePoints, 30, 29, 6, 5, 7);  //  4
  quad( giraffePoints, 29, 19, 18, 6, 7);  //  5
  quad( giraffePoints, 6, 18, 17, 7, 7);  //  6
  quad( giraffePoints, 7, 17, 16, 8, 7);  //  7
  triangle( giraffePoints, 8, 16, 15, 7);  //  8
  quad( giraffePoints, 9, 8, 15, 14, 7);  //  9
  quad( giraffePoints, 10, 9, 14, 13, 7);  //  10
  quad( giraffePoints, 12, 11, 10, 13, 7);  //  11
  quad( giraffePoints, 29, 28, 20, 19, 7);  //  12
  triangle( giraffePoints, 28, 27, 20, 7);  //  13
  quad( giraffePoints, 27, 23, 22, 20, 7);  //  14
  triangle( giraffePoints, 22, 21, 20, 7);  //  15
  quad( giraffePoints, 27, 26, 24, 23, 7);  //  16
  triangle( giraffePoints, 26, 25, 24, 7);  //  17
  
  // Inner leg -- front
  quad( giraffePoints, 67, 66, 65, 64, 7);  //  1
  quad( giraffePoints, 67, 68, 71, 66, 7);  //  2
  quad( giraffePoints, 68, 69, 70, 71, 7);  //  3
  // side inner leg
  quad( giraffePoints, 3, 67, 64, 0, 1);    // Bottom
  quad( giraffePoints, 0, 64, 65, 1, 1);    // Top front
  quad( giraffePoints, 1, 65, 66, 2, 1);    // Top
  quad( giraffePoints, 2, 66, 71, 31, 1);    // front bottom
  quad( giraffePoints, 31, 71, 70, 30, 1);    // front top
  quad( giraffePoints, 3, 4, 68, 67, 1);    // back bottom
  quad( giraffePoints, 4, 5, 69, 68, 1);    // back top
  
  // Inner leg -- back
  quad( giraffePoints, 83, 82, 81, 80, 7);  //  1
  quad( giraffePoints, 83, 84, 87, 82, 7);  //  2
  quad( giraffePoints, 84, 85, 86, 87, 7);  //  3
  // side inner leg
  quad( giraffePoints, 13, 83, 80, 12, 1);    // Bottom
  quad( giraffePoints, 12, 80, 81, 11, 1);    // Top front
  quad( giraffePoints, 11, 81, 82, 10, 1);    // Top
  quad( giraffePoints, 10, 82, 87, 9, 1);    // front bottom
  quad( giraffePoints, 9, 87, 86, 15, 1);    // front top
  quad( giraffePoints, 13, 14, 84, 83, 1);    // back bottom
  quad( giraffePoints, 14, 15, 85, 84, 1);    // back top
  
  
  // Side -- non Leg
  quad( giraffePoints, 15, 16, 48, 47, 0);  //  8- 8
  quad( giraffePoints, 16, 17, 49, 48, 0);  // 
  quad( giraffePoints, 17, 18, 50, 49, 0);  // 
  quad( giraffePoints, 18, 19, 51, 50, 0);  // 
  quad( giraffePoints, 19, 20, 52, 51, 0);  // 
  quad( giraffePoints, 20, 22, 54, 52, 0);  // 
  quad( giraffePoints, 22, 23, 55, 54, 0);  // 
  quad( giraffePoints, 23, 24, 56, 55, 0);  // 
  quad( giraffePoints, 24, 25, 57, 56, 0);  // 
  quad( giraffePoints, 26, 58, 57, 25, 0);  // 
  quad( giraffePoints, 26, 27, 59, 58, 0);  //
  quad( giraffePoints, 28, 60, 59, 27, 0);  //
  quad( giraffePoints, 29, 61, 60, 28, 0);  //
  quad( giraffePoints, 30, 62, 61, 29, 0);  //
  quad( giraffePoints, 5, 37, 62, 30, 0);  //
  quad( giraffePoints, 6, 38, 37, 5, 0);  //
  quad( giraffePoints, 7, 39, 38, 6, 0);  //
  quad( giraffePoints, 15, 47, 39, 7, 0);  //
  
  // Inner legs -- back front
  quad( giraffePoints, 72, 73, 74, 75, 7);    //   1
  quad( giraffePoints, 74, 79, 76, 75, 7);    //   2
  quad( giraffePoints, 79, 78, 77, 76, 7);    //   3
  // side inner leg
  quad( giraffePoints, 32, 72, 75, 35, 1);    // Bottom
  quad( giraffePoints, 33, 73, 72, 32, 1);    // Top front
  quad( giraffePoints, 34, 74, 73, 33, 1);    // Top
  quad( giraffePoints, 63, 79, 74, 34, 1);    // front bottom
  quad( giraffePoints, 62, 78, 79, 63, 1);  // front top
  quad( giraffePoints, 75, 76, 36, 35, 1);    // back bottom
  quad( giraffePoints, 76, 77, 37, 36, 1);    // back top
  
  
  // Inner legs -- back back
  quad( giraffePoints, 88, 89, 90, 91, 7);    //   1
  quad( giraffePoints, 90, 95, 92, 91, 7);    //   2
  quad( giraffePoints, 95, 94, 93, 92, 7);    //   3
  // side inner leg
  quad( giraffePoints, 44, 88, 91, 45, 1);    // Bottom
  quad( giraffePoints, 43, 89, 88, 44, 1);    // Top front
  quad( giraffePoints, 42, 90, 89, 43, 1);    // Top
  quad( giraffePoints, 41, 95, 90, 42, 1);    // front bottom
  quad( giraffePoints, 40, 94, 95, 41, 1);    // front top
  quad( giraffePoints, 91, 92, 46, 45, 1);    // back bottom
  quad( giraffePoints, 92, 93, 47, 46, 1);    // back top
  
  // Back
  quad( giraffePoints, 35, 34, 33, 32, 7);    //   1
  quad( giraffePoints, 35, 36, 63, 34, 7);    //   2
  quad( giraffePoints, 36, 37, 62, 63, 7);    //   3
  quad( giraffePoints, 37, 38, 61, 62, 7);    //   4
  quad( giraffePoints, 38, 50, 51, 61, 7);    //   5
  quad( giraffePoints, 39, 49, 50, 38, 7);    //   6
  quad( giraffePoints, 40, 48, 49, 39, 7);    //   7
  triangle( giraffePoints, 47, 48, 40, 7);    //  8
  quad( giraffePoints, 46, 47, 40, 41, 7);      //   9
  quad( giraffePoints, 45, 46, 41, 42, 7);    //   10
  quad( giraffePoints, 45, 42, 43, 44, 7);    //   11
  quad( giraffePoints, 51, 52, 60, 61, 7);    //   12
  triangle( giraffePoints, 52, 59, 60, 7);    //   13
  quad( giraffePoints, 53, 54, 55, 59, 7);    //   14
  triangle( giraffePoints, 52, 53, 54, 7);    //   15  
  quad( giraffePoints, 55, 56, 58, 59, 7);    //   16  
  triangle( giraffePoints, 56, 57, 58, 7);    //   17  
}

function generateSign() {
  // Front
  generalShape(signPoints, [0,1,2,3,4,5,6,7,8,9,10,11,12],13,[0,1,0,1,3,3,3,3,1,0,1,0]);
  
  // Sides
  quad( signPoints, 14,26,12,0,7); // Bottom
  quad( signPoints, 0,1,15,14,0);
  quad( signPoints, 1,2,16,15,3);
  quad( signPoints, 2,3,17,16,0);
  quad( signPoints, 3,4,18,17,3);
  quad( signPoints, 4,5,19,18,0);
  quad( signPoints, 5,6,20,19,3);
  quad( signPoints, 6,7,21,20,3);
  quad( signPoints, 7,8,22,21,0);
  quad( signPoints, 8,9,23,22,3);
  quad( signPoints, 9,10,24,23,0);
  quad( signPoints, 10,11,25,24,3);
  quad( signPoints, 11,12,26,25,0);
  
  // Back
  generalShape(signPoints, [26,25,24,23,22,21,20,19,18,17,16,15,14],27,[7]);
}

function generateGoblet(){
  SurfaceRevolution(gobletPoints);
}