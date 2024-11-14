//Declare the variables
var program;
var canvas, gl;

var pointsArray = [];
var colorsArray = [];

// Variables that control the orthographic projection bounds.
var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

var N_Handle;
var Ratio = 1.618;

var pointsArray = [];
var normalsArray = [];

var projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var theta = [45.0, 45.0, 45.0];
var thetaLoc;

var points;     //Array of points to be extruded or revolved around an axis
var radius;     //The radius of a cylinder pr a torus
var num;        //The number of points in a circle
var height;     //The height of the extruded shape
var alpha;      //The angle of each chunk of the circle
var D;          //The distance between the revolved surface and the axis
var r;

//Variables for animation
var seesawAnim = 0, mgrAnim = 0;
var start = false;
var goUp = false, goDown = false, spinAround = false;
var springPoints = [];

var springPoints;

// namespace contain all the project information
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 4*4,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

var indices = [];
var vertices = [];

  function DrawWall()
  {
    vertices = [
      //xz
      vec4( -1, 0.2, -1, 1),
      vec4( -1,   0, -1, 1),
      vec4(  1, 0.2, -1, 1),
      vec4(  1,   0, -1, 1),
      vec4( -1, 0.2,  1, 1),
      vec4( -1,   0,  1, 1),
      vec4(  1, 0.2,  1, 1),
      vec4(  1,   0,  1, 1),
    ]

    quad(2, 3, 1, 0);
    quad(4, 5, 1, 0);
    quad(6, 7, 3, 2);
    quad(6, 7, 5, 4);
    quad(4, 6, 2, 0);
    quad(5, 7, 3, 1);
  }

  function DrawSeeSaw()
  {
    vertices = [
      //Back of seesaw
      vec4( 0.2,   0, -2, 1),       //0
      vec4( 0.2, 0.2, -2, 1),       //1
      vec4(-0.2,   0, -2, 1),       //2
      vec4(-0.2, 0.2, -2, 1),       //3

      //Front of seesaw
      vec4( 0.2,   0, 2, 1),        //4
      vec4( 0.2, 0.2, 2, 1),        //5
      vec4(-0.2,   0, 2, 1),        //6
      vec4(-0.2, 0.2, 2, 1),        //7

      //Bottom of base
      vec4( 0.2, -1,-1, 1),         //8
      vec4(-0.2, -1,-1, 1),         //9
      vec4( 0.2, -1, 1, 1),         //10
      vec4(-0.2, -1, 1, 1),         //11

      //Top of base
      vec4( 0.2,  0, 0, 1),         //12
      vec4(-0.2,  0, 0, 1)          //13
      ]

    //Generate the faces for the seesaw platform
    quad( 0, 1, 3, 2);    //back
    quad( 0, 1, 5, 4);    //side
    quad( 0, 2, 6, 4);    //bottom
    quad( 4, 5, 7, 6);    //front
    quad( 2, 3, 7, 6);    //side
    quad( 1, 3, 7, 5);    //top

    //Generate the faces for the triangular bases
    quad( 8, 9, 11, 10);  //Bottom
    quad( 8, 9, 13, 12);  //Side
    quad(10,11, 13, 12);  //Side
    tri(  8, 10, 12);     //Front
    tri(  9, 11, 13);     //Back

    vertices = [];

    //Generate the handle bars for the seesaw
    points = [];
    radius=1;
    num= 25;
    alpha=2*Math.PI/num;
    D = 5;

    //Generate points for handle
    for (var i=0; i <= num ; i++)
    {
      points.push(vec4(D+(radius*Math.cos(i*alpha)), (radius*Math.sin(i*alpha)), 0, 1));
    }

    points.push(vec4(D+0, 0, 0, 1));

    //Rotate the circle around the y-axis to create the handle
    MakeTorus( points, 1);

    vertices = [];

    //Generate the fulcrum
    points = [];
    radius=1.5;
    num=50;
    alpha=2*Math.PI/num;

    //Generate points for fulcrum
    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
      vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    MakeCylinder(2);
  }

  function DrawSandBox()
  {
    //Points of the sandbox
    vertices = [
      vec4(-0.25, 0,     1, 1),         //0
      vec4(   -1, 0,  0.25, 1),         //1
      vec4(   -1, 0, -0.25, 1),         //2
      vec4(-0.25, 0,    -1, 1),         //3
      vec4( 0.25, 0,    -1, 1),         //4
      vec4(    1, 0, -0.25, 1),         //5
      vec4(    1, 0,  0.25, 1),         //6
      vec4( 0.25, 0,     1, 1),         //7

      vec4(-0.25, -0.5,     1, 1),      //8
      vec4(   -1, -0.5,  0.25, 1),      //9
      vec4(   -1, -0.5, -0.25, 1),      //10
      vec4(-0.25, -0.5,    -1, 1),      //11
      vec4( 0.25, -0.5,    -1, 1),      //12
      vec4(    1, -0.5, -0.25, 1),      //13
      vec4(    1, -0.5,  0.25, 1),      //14
      vec4( 0.25, -0.5,     1, 1),      //15

      vec4(-0.2, -0.5,  0.8, 1),        //16
      vec4(-0.8, -0.5,  0.2, 1),        //17
      vec4(-0.8, -0.5, -0.2, 1),        //18
      vec4(-0.2, -0.5, -0.8, 1),        //19
      vec4( 0.2, -0.5, -0.8, 1),        //20
      vec4( 0.8, -0.5, -0.2, 1),        //21
      vec4( 0.8, -0.5,  0.2, 1),        //22
      vec4( 0.2, -0.5,  0.8, 1),        //23

      vec4(-0.2, 0.1,  0.8, 1),         //24
      vec4(-0.8, 0.1,  0.2, 1),         //25
      vec4(-0.8, 0.1, -0.2, 1),         //26
      vec4(-0.2, 0.1, -0.8, 1),         //27
      vec4( 0.2, 0.1, -0.8, 1),         //28
      vec4( 0.8, 0.1, -0.2, 1),         //29
      vec4( 0.8, 0.1,  0.2, 1),         //30
      vec4( 0.2, 0.1,  0.8, 1)          //31
      ]

    //Bottom
    octagon(0, 1, 2, 3, 4, 5, 6, 7);

    //Sides
    quad(0, 1, 9, 8);
    quad(1, 2, 10, 9);
    quad(2, 3, 11, 10);
    quad(3, 4, 12, 11);
    quad(4, 5, 13, 12);
    quad(5, 6, 14, 13);
    quad(6, 7, 15, 14);
    quad(7, 0, 8, 15);

    //Top
    quad(15, 8, 16, 23);
    quad(8, 9, 17, 16);
    quad(9, 10, 18, 17);
    quad(10, 11, 19, 18);
    quad(11, 12, 20, 19);
    quad(12, 13, 21, 20);
    quad(13, 14, 22, 21);
    quad(14, 15, 23, 22);

    //Inside
    quad(25, 24, 16, 17);
    quad(24, 31, 23, 16);
    quad(31, 30, 22, 23);
    quad(30, 29, 21, 22);
    quad(29, 28, 20, 21);
    quad(28, 27, 19, 20);
    quad(27, 26, 18, 19);
    quad(26, 25, 17, 18);
  }

  function DrawBench()
  {
    vertices = [

      //Top of right peg
      vec4(  2, 0, -0.2, 1),    //0
      vec4(  2, 0,  0.2, 1),    //1
      vec4(1.8, 0,  0.2, 1),    //2
      vec4(1.8, 0, -0.2, 1),    //3

      //Bottom of left peg
      vec4(  -2, 0, -0.2, 1),   //4
      vec4(  -2, 0,  0.2, 1),   //5
      vec4(-1.8, 0,  0.2, 1),   //6
      vec4(-1.8, 0, -0.2, 1),   //7

      //Top of right peg
      vec4(   2, -2, -0.2, 1),  //8
      vec4(   2, -2,  0.2, 1),  //9
      vec4( 1.8, -2,  0.2, 1),  //10
      vec4( 1.8, -2, -0.2, 1),  //11

      //Bottom of left peg
      vec4(   -2, -2, -0.2, 1), //12
      vec4(   -2, -2,  0.2, 1), //13
      vec4( -1.8, -2,  0.2, 1), //14
      vec4( -1.8, -2, -0.2, 1), //15

      //Bottom of base
      vec4( 4, -2.5, -1, 1),    //16
      vec4( 4, -2.5,  1, 1),    //17
      vec4(-4, -2.5,  1, 1),    //18
      vec4(-4, -2.5, -1, 1),    //19

      //Top of base
      vec4( 2,  -2,-0.5, 1),    //20
      vec4( 2,  -2, 0.5, 1),    //21
      vec4(-2,  -2, 0.5, 1),    //22
      vec4(-2,  -2,-0.5, 1),    //23

      //Bottom of the seat
      vec4(-3.5, 0,   1, 1),    //24
      vec4(  -4, 0, 0.5, 1),    //25
      vec4(  -4, 0,-0.5, 1),    //26
      vec4(-3.5, 0,  -1, 1),    //27
      vec4( 3.5, 0,  -1, 1),    //28
      vec4(   4, 0,-0.5, 1),    //29
      vec4(   4, 0, 0.5, 1),    //30
      vec4( 3.5, 0,   1, 1),    //31

      //Top of the seat
      vec4(-3.5, 0.5,   1, 1),  //32
      vec4(  -4, 0.5, 0.5, 1),  //33
      vec4(  -4, 0.5,-0.5, 1),  //34
      vec4(-3.5, 0.5,  -1, 1),  //35
      vec4( 3.5, 0.5,  -1, 1),  //36
      vec4(   4, 0.5,-0.5, 1),  //37
      vec4(   4, 0.5, 0.5, 1),  //38
      vec4( 3.5, 0.5,   1, 1),  //39

      //Bottom of poles
      vec4(  -3, 0.5, -0.8, 1), //40
      vec4(  -3, 0.5, -0.6, 1), //41
      vec4(-2.5, 0.5, -0.6, 1), //42
      vec4(-2.5, 0.5, -0.8, 1), //43

      vec4(-0.25,0.5, -0.8, 1), //44
      vec4(-0.25,0.5, -0.6, 1), //45
      vec4( 0.25,0.5, -0.6, 1), //46
      vec4( 0.25,0.5, -0.8, 1), //47

      vec4(2.5, 0.5, -0.8, 1),  //48
      vec4(2.5, 0.5, -0.6, 1),  //49
      vec4(  3, 0.5, -0.6, 1),  //50
      vec4(  3, 0.5, -0.8, 1),  //51

      //Top of poles
      vec4(  -3, 2.5, -0.8, 1), //52
      vec4(  -3, 2.5, -0.6, 1), //53
      vec4(-2.5, 1.5,-0.6 , 1), //54
      vec4(-2.5, 1.5, -0.8, 1), //55

      vec4(-0.25, 1.5, -0.8, 1), //56
      vec4(-0.25, 1.5, -0.6, 1), //57
      vec4( 0.25, 1.5, -0.6, 1), //58
      vec4( 0.25, 1.5, -0.8, 1), //59

      vec4(2.5, 1.5, -0.8, 1),  //60
      vec4(2.5, 1.5, -0.6, 1),  //61
      vec4(  3, 2.5, -0.6, 1),  //62
      vec4(  3, 2.5, -0.8, 1),  //63

      //Front of the back of the bench
      vec4(  -3, 3.5, -0.4, 1), //64
      vec4(-2.5, 4.5, -0.4, 1), //65
      vec4( 2.5, 4.5, -0.4, 1), //66
      vec4(   3, 3.5, -0.4, 1), //67
      vec4(   3, 2.5, -0.4, 1), //68
      vec4( 2.5, 1.5, -0.4, 1), //69
      vec4(-2.5, 1.5, -0.4, 1), //70
      vec4(  -3, 2.5, -0.4, 1), //71

      //Back of the bench
      vec4(  -3, 3.5, -1, 1),   //72
      vec4(-2.5, 4.5, -1, 1),   //73
      vec4( 2.5, 4.5, -1, 1),   //74
      vec4(   3, 3.5, -1, 1),   //75
      vec4(   3, 2.5, -1, 1),   //76
      vec4( 2.5, 1.5, -1, 1),   //77
      vec4(-2.5, 1.5, -1, 1),   //78
      vec4(  -3, 2.5, -1, 1)    //79
      ]

    quad(0, 1, 2, 3);       //Top of the right peg
    quad(4, 5, 6, 7);       //Top of the left peg

    //Right peg
    quad( 0, 1, 9, 8);
    quad(3, 0, 8, 11);
    quad( 1, 2, 10, 9);
    quad( 2, 3, 11, 10);

    //Left peg
    quad( 5, 4, 12, 13);
    quad( 4, 7, 15, 12);
    quad( 6, 5, 13, 14);
    quad( 7, 6, 14, 15);

    //Top of the base
    quad( 16, 17, 18, 19);
    quad(8, 9, 21, 20);
    quad(9, 13, 22, 21);
    quad(12, 8, 20, 23);
    quad(10, 11, 15, 14);
    quad(13, 12, 23, 22);

    //Bottom of the base
    quad(20, 21, 17, 16);
    quad(16, 19, 23, 20);
    quad(19, 18, 22, 23);
    quad(18, 17, 21, 22);

    //Bottom of the seat
    octagon(24, 25, 26, 27, 28, 29, 30, 31);

    //Sides of the seat
    quad(24, 31, 39, 32);
    quad(32, 33, 25, 24);
    quad(33, 34, 26, 25);
    quad(34, 35, 27, 26);
    quad(35, 36, 28, 27);
    quad(36, 37, 29, 28);
    quad(37, 38, 30, 29);
    quad(38, 39, 31, 30);

    //Top of the seat
    quad(35, 34, 33, 40);
    quad(38, 37, 36, 51);
    quad(32, 39, 50, 41);
    quad(36, 35, 40, 51);
    quad(39, 38, 51, 50);
    quad(33, 32, 41, 40);

    //Bottom of back poles
    quad(45, 44, 43, 42);
    quad(49, 48, 47, 46);

    //Back-support poles
    quad(53, 52, 40, 41);
    quad(54, 53, 41, 42);
    quad(55, 54, 42, 43);
    quad(52, 55, 43, 40);

    quad(57, 56, 44, 45);
    quad(58, 57, 45, 46);
    quad(59, 58, 46, 47);
    quad(47, 44, 56, 59);

    quad(61, 60, 48, 49);
    quad(62, 61, 49, 50);
    quad(63, 62, 50, 51);
    quad(51, 48, 60, 63);

    octagon(65, 64, 71, 70, 69, 68, 67, 66);      //Front of back-support
    octagon(73, 72, 79, 78, 77, 76, 75, 74);      //Back of back-support

    //Sides of back-support
    quad(65, 66, 74, 73);
    quad(64, 65, 73, 72);
    quad(71, 64, 72, 79);
    quad(70, 71, 79, 78);
    quad(69, 70, 78, 77);
    quad(76, 77, 69, 68);
    quad(68, 67, 76, 77);
    quad(74, 75, 65, 66)
  }

  function DrawSwing()
  {
    //Points for seats and posts
    vertices = [

      vec4(0, 0, 0, 1),
      vec4(2, 0, 0, 1),
      vec4(2, 0, 2, 1),
      vec4(0, 0, 2, 1)
      ]

    //Extrude the rectangle
    MakeCylinder(6);

    //Support beam and ropes
    vertices = [];
    radius=1.5;
    num=50;
    alpha=2*Math.PI/num;

    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
      vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    MakeCylinder(2);
  }

  function DrawSpringRider()
  {
    //Body of spring rider
    vertices = [
      vec4(   1, 0,     1, 1),
      vec4(  -3, 0,     2, 1),
      vec4(  -4, 0,   1.5, 1),
      vec4(-5.5, 0,  1.25, 1),
      vec4(-5.5, 0,     1, 1),
      vec4(-3.5, 0,   0.5, 1),
      vec4(  -3, 0, -0.25, 1),
      vec4(  -3, 0,  -1.5, 1),
      vec4(  -2, 0,  -1.5, 1),
      vec4(  -1, 0,    -1, 1),
      vec4(   1, 0,    -1, 1),
      vec4( 1.5, 0,  -1.5, 1),
      vec4( 2.5, 0,  -1.5, 1),
      vec4(   2, 0,    -1, 1),
      vec4(   3, 0,    -1, 1),
      vec4(   4, 0,    -1, 1),
      vec4(4.25, 0,  -0.5, 1),
      ]

    //Create the animal (alligator) for the spring rider
    MakeCylinder(2);

    //Create the spring
    vertices = [];
    var springPoints = [];
    radius = 1;
    num = 25;
    alpha = 2 * Math.PI / num;
    D = 5;

    for (var i = 0; i <= num; i++)
    {
      springPoints.push(vec4(D + (radius * Math.cos(i * alpha)), (radius * Math.sin(i * alpha)), 0, 1));
    }

    springPoints.push(vec4(D + 0, 0, 0, 1));

    MakeSpring(springPoints, 0,  2 );
  }

  function DrawSlide()
  {
    //Slide
    var slidePoints = [

      [1, 0, 0],
      [1, 1, 0],
      [0.8, 1, 0],
      [0.8, 0.2, 0],
      [-0.8, 0.2, 0],
      [-0.8, 1, 0],
      [-1, 1, 0],
      [-1, 0, 0],
      [1, 0, 0]
    ]

    //Create a twisty slide
    MakeSpring(slidePoints,2 , 1/3);

    vertices = [];

    //Platform of the slide
    vertices = [
      vec4(-1, 0, 0.2, 1),
      vec4(-1, 0,   0, 1),
      vec4( 1, 0,   0, 1),
      vec4( 1, 0, 0.2, 1)
     ]

    //Extrude the platform
    MakeCylinder(2.5);

    //Poles, ladder, and ladder steps
    vertices = [];
    radius=0.1;
    num=50;
    alpha=2*Math.PI/num;

    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
      vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    MakeCylinder(2);

    //Arches for the guard rails
    vertices = [];
    points = [];
    radius=0.05;
    num= 25;
    height=2;
    alpha=2*Math.PI/num;
    D = 0.5;

    for (var i=0; i <= num ; i++)
    {
      points.push(vec4(D+(radius*Math.cos(i*alpha)), (radius*Math.sin(i*alpha)), 0, 1));
    }

    points.push(vec4(D+0, 0, 0, 1));

    MakeTorus(points,  1);
  }

  function DrawMGR()
  {
    //Merry-go-round
    var mgrPoints = [
      [  2,   0, 0],
      [  2, 0.2, 0],
      [0.2, 0.2, 0],
      [0.2,   2, 0],
      [0.1,   2, 0],
      [0.2,   0, 0],
      [  2,   0, 0]
    ]

    MakeTorus(mgrPoints, 1/5);

    //Handles for the merry-go-round
    vertices = [];
    points = [];
    radius=1;
    num= 25;
    alpha=2*Math.PI/num;
    D = 5;

    for (var i=0; i <= num ; i++)
    {
      points.push(vec4(D+(radius*Math.cos(i*alpha)), (radius*Math.sin(i*alpha)), 0, 1));
    }

    points.push(vec4(D+0, 0, 0, 1));

    MakeTorus(points , 1/2);

    //Poles for the handles
    vertices = [];
    radius=1;
    num=25;
    alpha=2*Math.PI/num;

    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
      vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    MakeCylinder(1);
  }

  //Revolves a surface around an axis
  function MakeTorus( points,  n)
  {
    N_Handle = points.length;

    //Setup initial points matrix
    for (var i = 0; i<N_Handle; i++)
    {
      vertices.push(vec4(points[i][0], points[i][1], points[i][2], 1));
    }

    t = n*Math.PI/(N_Handle-1);

    //Rotate around the y axis
    for (var j = 0; j < ((N_Handle-1)); j++)
    {
      var angle = (j+1)*t;

      for(var i = 0; i < N_Handle ; i++ )
      {
        r = vertices[i][0];
        vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
      }
    }

    N = N_Handle;

    //Create the faces on the handle
    for (var i=0; i<(N_Handle-1); i++) // slices
    {
      for (var j=0; j<(N_Handle-1); j++)  // layers
      {
        quad(i*N_Handle+j, (i+1)*N_Handle+j, (i+1)*N_Handle+(j+1), i*N_Handle+(j+1));
      }
    }
  }

  //Revolves a surface around an axis while extruding it upwards
  function MakeSpring(springPoints,  D, n)
  {
    N = springPoints.length;

    //Setup initial points matrix
    for (var i = 0; i < N; i++)
    {
        vertices.push(vec4(D + springPoints[i][0], springPoints[i][1], springPoints[i][2], 1));
    }

    t = n * Math.PI / (N - 1);

    // sweep the original curve another "angle" degree
    for (var j = 0; j < (N - 1); j++) {
        var angle = (j + 1) * t;

        for (var i = 0; i < N; i++) {
            r = vertices[i][0];
            vertices.push(vec4(r * Math.cos(angle), vertices[i][1] + (angle), -r * Math.sin(angle), 1));
        }
    }

    for (var i = 0; i < (N - 1); i++) // slices
    {
        for (var j = 0; j < (N - 1); j++)  // layers
        {
            quad(i * N + j, (i + 1) * N + j, (i + 1) * N + (j + 1), i * N + (j + 1));
        }
    }
  }

  //Extrudes an object to a certain height
  function MakeCylinder(height)
  {
    N=vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
      vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape();
  }

  function ExtrudedShape()
  {
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
      quad(j, j+N, (j+1)%N+N, (j+1)%N);
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
      basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
      topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
  }

  function multiply(m, v)
  {
    var vv=vec4(
    m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
    m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
    m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
    m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
  }

  function polygon(indices)
  {
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
      pointsArray.push(vertices[indices[0]]);
      normalsArray.push(normal);

      pointsArray.push(vertices[indices[prev]]);
      normalsArray.push(normal);

      pointsArray.push(vertices[indices[next]]);
      normalsArray.push(normal);

      prev=next;
      next=next+1;
    }
  }

  function triangle(a, b, c)
  {
    var points=[a, b, c];
    var normal = Newell(points);

    // triangle abc
    pointsArray.push(a);
    normalsArray.push(normal);
    pointsArray.push(b);
    normalsArray.push(normal);
    pointsArray.push(c);
    normalsArray.push(normal);
  }

  //Form an octagon shape
  function octagon(a, b, c, d, e, f, g, h)
  {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    pointsArray.push(vertices[e]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[e]);
    normalsArray.push(normal);
    pointsArray.push(vertices[f]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[f]);
    normalsArray.push(normal);
    pointsArray.push(vertices[g]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[g]);
    normalsArray.push(normal);
    pointsArray.push(vertices[h]);
    normalsArray.push(normal);
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

  var lightPosition = vec4(1.8, 1., 2, 0.0 );
  var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
  var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
  var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

  var materialAmbient = vec4( 0.0, 1.0, 0.1, 1.0 );
  var materialDiffuse = vec4( 0.0, 1.0, 0.1, 1.0);
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
  var axis = 0;
  var theta =[0, 0, 0];

  var thetaLoc;

  var flag = true;

  function tri(a, b, c)
  {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
  }


  function quad(a, b, c, d)
  {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
        normal = normalize(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
  }

  function pentagon(a, b, c, d, e)
  {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
        normal = normalize(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    pointsArray.push(vertices[e]);
    normalsArray.push(normal);
  }

  window.onload = function init()
  {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    DrawWall();
    vertices = [];
    DrawSeeSaw();
    vertices = [];
    DrawSandBox();
    vertices = [];
    DrawBench();
    vertices = [];
    DrawSwing();
    vertices = [];
    DrawSpringRider();
    vertices = [];
    DrawSlide();
    vertices = [];
    DrawMGR();
    vertices = [];

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(4.0, 4.0, 4.0 );

    projection = ortho(-2, 2, -2, 2, -20, 20);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),  flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),  flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),   flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),false, flatten(projection));

       window.addEventListener("keydown", function()
       {
         //If the A key is pressed,
         if(event.keyCode == 65)
           {
             start = !start;        //Start becomes the opposite of itself (true = false, false = true)

             goUp = start;          //The seesaw goes up or stops
             goDown = start;        //The seesaw goes down or stops

             spinAround = start;    //The merry-go-round spins or stops

             render();
           }
         }
       );

    // Set the position of the eye
    document.getElementById("eyeValue").onclick=function() {
        eyeX=document.parameterForm.xValue.value;
        eyeY=document.parameterForm.yValue.value;
        eyeZ=document.parameterForm.zValue.value;
        render();
    };

    // These four just set the handlers for the buttons.
    document.getElementById("thetaup").addEventListener("click", function(e) {
        AllInfo.theta += AllInfo.dr;
        render();
    });
    document.getElementById("thetadown").addEventListener("click", function(e) {
        AllInfo.theta -= AllInfo.dr;
        render();
    });
    document.getElementById("phiup").addEventListener("click", function(e) {
        AllInfo.phi += AllInfo.dr;
        render();
    });
    document.getElementById("phidown").addEventListener("click", function(e) {
        AllInfo.phi -= AllInfo.dr;
        render();
    });

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
            //console.log(AllInfo.zoomFactor);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
      //  console.log(AllInfo.zoomFactor);
        render();
    });

    //************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in AllInfo. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });

    render();
  }


  function scale4(a, b, c)
  {
    var matrix = mat4();
    matrix[0][0] = a;
    matrix[1][1] = b;
    matrix[2][2] = c;
    return matrix;
  }

  //Apply color to the object
  function color(a, b, c)
  {
    materialAmbient = vec4( a, b, c, 1.0 );
    materialDiffuse = vec4( a, b, c, 1.0);
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  }

  function Walls()
  {
    //xz
    modelView = lookAt(eye, at, up);
    color(0.0, 1.0, 0.1);
    modelView = mult(modelView, scale4(3/2, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES,0, 36);

    //xy
    modelView = mult(modelView, translate(-1.1, 0.5, 0));
    modelView = mult(modelView, rotate(-90, 0, 0, 1));
    modelView = mult(modelView, scale4(1/2, 1/2, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES,0, 36);

    //yz
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, translate(0, 0.5, -1.1));
    modelView = mult(modelView, rotate(90, 1, 0, 0));
    modelView = mult(modelView, scale4(1, 1/2, 1/2));
    modelView = mult(modelView, scale4(3/2, 1, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView));
    gl.drawArrays( gl.TRIANGLES,0, 36);
  }

  function SeeSaw()
  {
    modelView = lookAt(eye, at, up);
    color(0.5, 0.5, 0.5);

    //Draw SeeSaw
    modelView = mult(modelView, translate(1.25, 0.3, -0.5));
    modelView = mult(modelView, rotate(seesawAnim, 1, 0, 0));
    modelView = mult(modelView, scale4(4, 1, 2));
    modelView = mult(modelView, scale4(1/10, 1/10, 1/10));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 36, 36 );

    //Draw triangle bases
    color(0, 0, 0);
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, translate(1.25, 0.3, -0.5));
    modelView = mult(modelView, scale4(1/10, 1/10, 1/10));
    modelView = mult(modelView, translate(-1, 0, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 36+36, 24);

    modelView = mult(modelView, translate(2, 0, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 36+36, 24);

    //Draw handle bars
    modelView = lookAt(eye, at, up);
    color(0.0, 0.0, 0.75);
    modelView = mult(modelView, translate(1.25, 0.3, -0.5));
    modelView = mult(modelView, rotate(90, 1, 0, 0));
    modelView = mult(modelView, rotate(seesawAnim, 1, 0, 0));
    modelView = mult(modelView, scale4(1/100, 1/100, 1/100));
    modelView = mult(modelView, translate(0, 20, -1));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 36+36+24, 4056);

    modelView = mult(modelView, translate(0, -40, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 36+36+24, 4056);

    //Draw fulcrum
    modelView = lookAt(eye, at, up);
    color(1.0, 0.0, 0);
    modelView = mult(modelView, translate(1.25, 0.3, -0.5));
    modelView = mult(modelView, rotate(90, 0 , 0, 1));
    modelView = mult(modelView, scale4(1/15, 2/5, 1/15));
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    modelView = mult(modelView, translate(-1,-1, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 4116+36, 612);
  }

  function Sandbox()
  {
    //Sandbox
    modelView = lookAt(eye, at, up);
    color(0.4, 0.3, 0.2);
    modelView = mult(modelView, translate(-0.75, 0.205, 0.5));
    modelView = mult(modelView, rotate(180, 0, 0, 1));
    modelView = mult(modelView, rotate(45, 0, 1, 0));
    modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 4116+36+612, 162 );
  }

  function Benches()
  {
    //Benches
    modelView = lookAt(eye, at, up);
    color(0.0, 0.25, 0.75);
    modelView = mult(modelView, translate(-0.75-0.65, 0.32, -0.8+0.25));
    modelView = mult(modelView, rotate(90,0 , 1, 0));
    modelView = mult(modelView, scale4(1/20, 1/20, 1/20));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 4926, 342 - 36 + 18+18 + 6*8 );

    modelView = mult(modelView, translate(-9, 0, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 4926, 342 - 36 + 18+18 + 6*8 );

    modelView = mult(modelView, translate(-9, 0, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 4926, 342 - 36 + 18+18 + 6*8 );
  }

  function Swing()
  {
    //Swing Legs
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(0.8, 0.75, -0.5));
    modelView = mult(modelView, rotate(170, 0, 0, 1));
    modelView = mult(modelView, scale4(0.125, 0.5, 0.125));
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    color(1.0, 0, 0.2);
    gl.drawArrays(gl.TRIANGLES, 5316, 36);

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(0.8, 0.75, -0.5));
    modelView = mult(modelView, rotate(-170, 0, 0, 1));
    modelView = mult(modelView, scale4(0.125, 0.5, 0.125));
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5316, 36);

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(0.8, 0.75, -0.5));
    modelView = mult(modelView, rotate(170, 0, 0, 1));
    modelView = mult(modelView, scale4(0.125, 0.5, 0.125));
    modelView = mult(modelView, translate(0, 0, -25/5));
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5316, 36);

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(0.8, 0.75, -0.5));
    modelView = mult(modelView, rotate(-170, 0, 0, 1));
    modelView = mult(modelView, scale4(0.125, 0.5, 0.125));
    modelView = mult(modelView, translate(0, 0, -25/5))
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5316, 36);

    //Seats
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, rotate(90, 0, 0, 1));
    modelView = mult(modelView, translate(0.8, 0, -0.5));
    modelView = mult(modelView, rotate(180, 0, 0, 1));
    modelView = mult(modelView, translate(0.5, 0.7, -0.225));
    modelView = mult(modelView, scale4(1/10, 1/10, 1/2));
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5316, 36);

    modelView = mult(modelView, translate(0, 0, -3))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5316, 36);

    //Main support beam
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(0.8, 1, -0.5));
    modelView = mult(modelView, rotate(90, -90, 0, 1));
    modelView = mult(modelView, scale4(0.09, 1.5, 0.125));
    modelView = mult(modelView, translate(-0.35, 0, -2.5))
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    color(0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 5352, 612);

    //Ropes
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(0.8, 1, -0.5));
    modelView = mult(modelView, scale4(0.03, 0.87, 0.03));
    modelView = mult(modelView, translate(-1, -0.8, -10/5));
    modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    color(0.5, 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 5352, 612);
    modelView = mult(modelView, translate(0, 0, -20))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5352, 612);
    modelView = mult(modelView, translate(0, 0, -30))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5352, 612);
    modelView = mult(modelView, translate(0, 0, -20))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 5352, 612);
  }

  function SpringRider()
  {
    //Spring rider
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(-0.7, 0.5-0.125, 1/7+1.25));
    modelView = mult(modelView, rotate(-90, 1, 0, 0));
    modelView = mult(modelView, scale4(0.65, 0.65, 0.65));
    modelView = mult(modelView, scale4(1/15, 1/15, 1/15));
    modelView = mult(modelView, scale4(1.5, 1.5, 1.5));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    color(0.0, 0.25, 0.0);
    gl.drawArrays(gl.TRIANGLES, 5964, 192);

    //Draw Spring
    for (var i = 0; i < 3; i++)
    {
      modelView = lookAt(eye, at, up);
      modelView = mult(modelView, rotate(90, 0, 1, 0));
      modelView = mult(modelView, translate(-0.7, 0.15-0.125, 0.05+1.25-0.02));
      modelView = mult(modelView, rotate(-90, 1, 0, 0));
      modelView = mult(modelView, rotate(90, 1, 0, 0));
      modelView = mult(modelView, scale4(1/15, 1/15, 1/15));
      modelView = mult(modelView, translate(0, (2 * i / Math.PI) + 0.5 - 0.5, 0.75));
      modelView = mult(modelView, scale4(1 / 10, 1 / 10, 1 / 10));
      modelView = mult(modelView, translate(0, 25, 0));
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
      color(0.5, 0.5, 0.5);
      gl.drawArrays(gl.TRIANGLES, 6156, 4056);
    }

    //Draw handle bars
    color(1, 1, 1);
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(90, 0, 1, 0));
    modelView = mult(modelView, translate(-0.7, 0.6-0.125, 0.05+1.25-0.025));
    modelView = mult(modelView, rotate(180, 0, 1, 0));
    modelView = mult(modelView, scale4(1/12, 1/12, 1/12));
    modelView = mult(modelView, translate(1.5, -0.75, -1.25));
    modelView = mult(modelView, scale4(1 / 10, 1 / 10, 1 / 10));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 6156, 2028);

    modelView = mult(modelView, scale4(1, 1, -1));
    modelView = mult(modelView, translate(0, 0, -12));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 6156, 2028);
  }

  function Slide()
  {
    //Draw slide
    for(var i = 0; i < 8; i++)
    {
      if(i == 7)
        color(1, 0, 0);         //Red
      else if(i == 6)
        color(1, 0.5, 0);       //Orange
      else if(i == 5)
        color(1, 1, 0);         //Yellow
      else if(i == 4)
        color(0, 1, 0);         //Green
      else if(i == 3)
        color(0, 0.5, 1);       //Blue-green
      else if(i == 2)
        color(0, 0, 1);         //Blue
      else if(i == 1)
        color(0.5, 0, 0.5);     //Purple
      else if(i == 0)
        color(1, 0, 0.5);       //Pink

      modelView = lookAt(eye, at, up);
      modelView = mult(modelView, translate(0, 0.3, -0.5));
      modelView = mult(modelView, rotate(-120, 0, 1, 0));
      modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
      modelView = mult(modelView, translate(0, i*Math.PI/15, 0));
      modelView = mult(modelView, rotate(360/6*i, 0, 1, 0));
      modelView = mult(modelView, scale4(1/5, 1/5, 1/5));
      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES, 10212, 384 );
    }

    //Draw slide platform
    color(0, 0, 0.4);
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, translate(0, 0.3, -0.5));
    modelView = mult(modelView, rotate(-120, 0, 1, 0));
    modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
    modelView = mult(modelView, translate(-0.1, 1.7, -0.4));
    modelView = mult(modelView, rotate(90, 1, 0, 0));
    modelView = mult(modelView, rotate(60, 0, 0, 1));
    modelView = mult(modelView, scale4(1/3, 1/2, 1/5));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES,10596 , 36  );

    //Draw ladder
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, translate(0, 0.3, -0.5));
    modelView = mult(modelView, rotate(-120, 0, 1, 0));
    modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
    modelView = mult(modelView, translate(-1.2, -0.3, 0));
    modelView = mult(modelView, scale4(1/2, 1, 1/2));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES,10632, 612  );

    modelView = mult(modelView, scale4(2, 1, 2));
    modelView = mult(modelView, translate(0.2, 0, 0.4));
    modelView = mult(modelView, scale4(1/2, 1, 1/2));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES,10632, 612  );


    //Draw ladder steps
    for(var i = 0; i < 7; i++)
    {
      modelView = lookAt(eye, at, up);
      modelView = mult(modelView, translate(0, 0.3, -0.5));
      modelView = mult(modelView, rotate(-120, 0, 1, 0));
      modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
      modelView = mult(modelView, translate(-1.2, i/4 - 1/10, 0))
      modelView = mult(modelView, rotate(90, 0, 0, 1));
      modelView = mult(modelView, rotate(120, 1, 0, 0));
      modelView = mult(modelView, scale4(1/2, 1/5, 1/2));
      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES,10632, 612  );
    }

    //Draw guard rails
    for(var i = 0; i <2; i++)
    {
      modelView = lookAt(eye, at, up);
      modelView = mult(modelView, translate(0, 0.3, -0.5));
      modelView = mult(modelView, rotate(-120, 0, 1, 0));
      modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
      modelView = mult(modelView, translate(-i/4, 0, -i/2));
      modelView = mult(modelView, translate(-0.5, 1.75, 0.15));
      modelView = mult(modelView, scale4(1/2, 1/5, 1/2));
      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES,10632, 612  );

      modelView = mult(modelView, scale4(2, 5, 2));
      modelView = mult(modelView, translate(-0.2, 0, 0.1));
      modelView = mult(modelView, scale4(1/2, 1/6, 1/2));
      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES,10632, 612  );

      modelView = mult(modelView, scale4(2, 5, 2));
      modelView = mult(modelView, translate(0.4, 0, -0.22));
      modelView = mult(modelView, scale4(1/2, 1/6, 1/2));
      gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES,10632, 612  );

      //Draw arches
      modelView = lookAt(eye, at, up);
      modelView = mult(modelView, translate(0, 0.3, -0.5));
      modelView = mult(modelView, rotate(-120, 0, 1, 0));
      modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
      modelView = mult(modelView, translate(i*-0.25, 0, i*-0.45));
      modelView = mult(modelView, translate(-0.55, 1.65, 0.15));
      modelView = mult(modelView, rotate(90, 1, 0, 0));
      modelView = mult(modelView, rotate(-30, 0, 0,1));
      modelView = mult(modelView, scale4(1, 1, 1));
      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES, 11244, 4056  );
    }

    //Draw support beams
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, translate(0, 0.3, -0.5));
    modelView = mult(modelView, rotate(-120, 0, 1, 0));
    modelView = mult(modelView, scale4(1/3, 1/3, 1/3));
    modelView = mult(modelView, translate(0.3, -0.35, -0.1));
    modelView = mult(modelView, scale4(1/2, 1/5, 1/2));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES,10632, 612  );

    modelView = mult(modelView, translate(0.4,  0, 0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES,10632, 612  );
  }

  function MGR()
  {
    //Draw merry-go-round
    for(var i = 0; i < 10; i++)
    {
      if(i%2 == 0)
        color(1, 0, 0.5);     //Pink
      else
        color(1, 1, 1);       //White

      modelView = lookAt(eye, at, up);
      modelView = mult(modelView, translate(0.2, 0.25, 0.5));
      modelView = mult(modelView, rotate(mgrAnim, 0, 1, 0));
      modelView = mult(modelView, scale4(1/6, 1/6, 1/6));
      modelView  = mult(modelView, rotate(36*i,0, 1, 0 ));
      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
      gl.drawArrays( gl.TRIANGLES, 15300, 216);
    }

    //Draw support-beam for merry-go-round
    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, translate(0.2, 0.2, 0.5));
    modelView = mult(modelView, scale4(1/6, 1/6, 1/6));
    modelView = mult(modelView, translate(0, -0.25, 0));
    modelView  = mult(modelView, scale4(1/10, 1, 1/10));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES,19572 , 312);

    //Draw handles for merry-go-round
    for(var j = 0; j < 4; j++)
    {
      for(var i = 0; i < 2; i++)
      {
        color(0, 0, 0);
        modelView = lookAt(eye, at, up);
        modelView = mult(modelView, translate(0.2, 0.25, 0.5));
        modelView = mult(modelView, rotate(mgrAnim, 0, 1, 0));
        modelView = mult(modelView, scale4(1/6, 1/6, 1/6));
        modelView = mult(modelView, rotate(90*j, 0, 1, 0));
        modelView = mult(modelView, translate(-3*i, 0, 0));
        modelView = mult(modelView, rotate(180*i, 0, 1, 0));
        modelView = mult(modelView, translate(-1.5, 1.5, 0));
        modelView = mult(modelView, rotate(90, 1, 0, 0));
        modelView = mult(modelView, rotate(90, 0, 0, 1));
        modelView  = mult(modelView, scale4(1/10, 1/10, 1/10));
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
        gl.drawArrays( gl.TRIANGLES,15516, 4056);

        color(0, 0, 0);
        modelView = lookAt(eye, at, up);
        modelView = mult(modelView, translate(0.2, 0.25, 0.5));
        modelView = mult(modelView, rotate(mgrAnim, 0, 1, 0));
        modelView = mult(modelView, scale4(1/6, 1/6, 1/6));
        modelView = mult(modelView, rotate(90*j, 0, 1, 0));
        modelView = mult(modelView, translate(-3*i, 0, 0));
        modelView = mult(modelView, rotate(180*i, 0, 1, 0));
        modelView = mult(modelView, translate(-1.5, 0, 0.5));
        modelView  = mult(modelView, scale4(1/10, 1.5, 1/10));
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
        gl.drawArrays( gl.TRIANGLES, 19572  ,312);
      }
    }
  }


  var at = vec3(0, 0, 0);
  var up = vec3(0, 1, 0);
  var eye = vec3(2, 2, 2);

  var eyeX=2, eyeY=2, eyeZ=2; // default eye position input values

  var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projectionMatrix = ortho( x_min*AllInfo.zoomFactor - AllInfo.translateX,
                              x_max*AllInfo.zoomFactor - AllInfo.translateX,
                              y_min*AllInfo.zoomFactor - AllInfo.translateY,
                              y_max*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));

    Walls();

    //Seesaw goes up
    if(goUp)
    {
      seesawAnim = seesawAnim + 0.5;
      if(seesawAnim >= 15)                //Stop when the seesaw hits 15 degrees
      {
        goUp = false;
        goDown = true;
      }
    }
    //Seesaw goes down
    else if(goDown){
      seesawAnim = seesawAnim - 0.5;
      if(seesawAnim <= -15)               //Stop when the seesaw hits -15 degrees
      {
        goUp = true;
        goDown = false;
      }
    }

    SeeSaw();
    Sandbox();
    Benches();
    Swing();
    SpringRider();
    Slide();

    if(spinAround)
    {
      mgrAnim++;
    }

    MGR();

    if(!goUp && !goDown && !spinAround)
    {
      start = false;
    }

    if(start)
    {
      requestAnimFrame(render);
    }
  }
