// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without 
// the use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc

var canvas, gl;
var iterations = 100000;
var fernOption = false;
colorChoice = 1;

//create fern object
class Fern {
    constructor () {
        //fern 1 or fern 2
        this.name = '';
        //points to display
        this.points = [];
        //set of calues for a - f
        this.set = [];
        //probabilities
        this.probs = [];
        //starting point
        this.vertex = [];
        //count
        this.count = 0;
    }

    //Class Methods

    //push points to points array
    fern(pointPrime) {
        this.points.push(pointPrime);
    }

    buildFern(point, sets, probabilities, count) {
        console.log("building ", this.name);
        var x = point[0][0];
        var y = point[0][1];

        for(var i = 0; i < count; i++) {
            //determine set with probabilities
            let set = this.getRandomSet(sets, probabilities);
    
            //get a-f
            var a = set[0];
            var b = set[1];
            var c = set[2];
            var d = set[3];
            var e = set[4];
            var f = set[5];
    
            //get x and y prime
            var xPrime = (a * x) + (b * y) + e;
            var yPrime = (c * x) + (d * y) + f;
    
            //make a point
            var pointPrime = vec2(xPrime, yPrime);
            this.fern(pointPrime);
    
            //use primes for next iteration
            x = xPrime;
            y = yPrime;
        }
    }

    getRandomSet(sets, probabilities) {
        var set = [];
        var num = Math.random();
    
        if (num <= probabilities[0]) {
            set = sets[0];
        } else if (num <= probabilities[1]) {
            set = sets[1];
        } else if (num <= probabilities[2]) {
            set = sets[2];
        } else {
            set = sets[3];
        }

        return set;
    }

    NormalizePoints() {
        console.log("Normalizeing Points of ", this.name);
        var maxX = -Infinity, minX = Infinity;
        var maxY = -Infinity, minY = Infinity;
    
        // Find the max and min values for x and y
        for (var i = 0; i < this.points.length; i++) {
            var vector = this.points[i];
            var a = vector[0];
            var b = vector[1];
            if (a > maxX) maxX = a;
            if (a < minX) minX = a;
            if (b > maxY) maxY = b;
            if (b < minY) minY = b;
        }
    
        // Normalize a and b values between -1 and 1
        for (var i = 0; i < this.points.length; i++) {
            var vector = this.points[i];
            var a = vector[0];
            var b = vector[1];
            a = 2 * ((a - minX) / (maxX - minX)) - 1;
            b = 2 * ((b - minY) / (maxY - minY)) - 1;
    
            // Update points[i]
            this.points[i][0] = a;
            this.points[i][1] = b;
        }
    }

    // END Class Methods
}

function main() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log("WebGL isn't available");
        return;
    }

    //initialize an array of length 2 of fern objects
    var ferns = new Array(2);
    ferns[0] = new Fern();
    ferns[0].name = 'fern1';
    ferns[1] = new Fern();
    ferns[1].name = 'fern2';

    // Initialize starting point for ferns
    var vertex = [
        vec2(0, 0)
    ];

    //Initialize first ferns sets
    var set1 = [
        [0.0, 0.0, 0.0, 0.16, 0.0, 0.0],
        [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
        [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
        [0.75, 0.04, -0.04, 0.85, 0.0, 1.6]
    ];

    //Initialize second ferns sets
    var set2 = [
        [0.0, 0.0, 0.0, 0.16, 0.0, 0.0],
        [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
        [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
        [0.85, 0.04, -0.04, 0.85, 0.0, 1.6]
    ];

    var prob1 = [0.01, 0.09, 0.17, 0.91];
    var prob2 = [0.01, 0.08, 0.15, 1.0];

    //build ferns
    ferns[0].buildFern(vertex, set1, prob1, iterations);
    ferns[1].buildFern(vertex, set2, prob2, iterations);

    //normalize ferns
    ferns[0].NormalizePoints();
    ferns[1].NormalizePoints();

    //get vertex arrays for both fern objects
    var vertexArray1 = new Float32Array(ferns[0].points.flat());
    var vertexArray2 = new Float32Array(ferns[1].points.flat());

    // Configure WebGL
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //send original color
    gl.uniform1i(gl.getUniformLocation(program, "colorChoice"), colorChoice);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray1, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);    
    render();

    //get mousedown
    window.addEventListener("mousedown", function(){
        //change fern to be rendered
        fernOption = !fernOption;

        if(fernOption === true) {
            // Load the data into the GPU
            var bufferId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArray1, gl.STATIC_DRAW);
    
            // Associate out shader variables with our data buffer
            var vPosition = gl.getAttribLocation(program, "vPosition");
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vPosition);    
            render();
        }
        else {
            // Load the data into the GPU
            var bufferId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArray2, gl.STATIC_DRAW);
    
            // Associate out shader variables with our data buffer
            var vPosition = gl.getAttribLocation(program, "vPosition");
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vPosition);    
        }
        render();
    });

    window.addEventListener("keydown", function (event) {
        //change color based on c keypress
        if (event.keyCode == 67) {
                if (colorChoice===1)
                    colorChoice = 0;
                else
                    colorChoice = 1;

                gl.uniform1i(gl.getUniformLocation(program, "colorChoice"), colorChoice);
                render();

        } // end if
    });
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, iterations);
}
