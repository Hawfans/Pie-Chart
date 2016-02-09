//main.js

//**** Remove these declartions and total loop
//var values = [12, 53, 46, 67.2, 32, 5, 77];
//var total = 0;
//var canvas, context;
//for(var i=0; i<values.length; i++){
//  total += values[i];
//}

//**** Remove this original document.addEventListener
//document.addEventListener("DOMContentLoaded", function(){
//  //set global vars for canvas and context
//  canvas = document.querySelector("#canvas1");
//  context = canvas.getContext("2d");
//
//  showPie();
//
//
//});

// replace above with ajax

// New declarations
var canvas;
var context;
var xhrequest;
var largestValueIndex = 0;
var smallestValueIndex = 0;
var total = 0;
var data = {};

// constant declarations
const RADIUS = 110;
const LINEENDPOINT = 40;
const TEXTENDPOINT = 60;

//cleaner code: using a named function
document.addEventListener("DOMContentLoaded", init);

function init() {
    canvas = document.querySelector("#canvas1");
    context = canvas.getContext("2d");
    xhrequest = new XMLHttpRequest();
    xhrequest.open("GET", "http://davidst.edumedia.ca/mad9022/browsers.json");
    xhrequest.addEventListener("load", gotResponse);
    xhrequest.send(null);
}

function gotResponse() {
    //check for status
    if (xhrequest.status === 200 || xhrequest.status === 304) {
        //parse JSON or tell user about issue
        try {
            data = JSON.parse(xhrequest.responseText);
            //    alert("JSON LOADED")
            calcTotalMinMax();
            //NOTE you can move showPie() and your second chart function call here AFTER you have made sure they work correctly!
        } catch (e) {
            JSONParseError();
            console.log("name:" + e.name + "\nmessage:" + e.message)
        }
        showPie();
        
        canvas = document.querySelector("#canvas2");
    context = canvas.getContext("2d");
    showArcs();


        
    } else {
        JSONLoadError();
    }
}

function JSONLoadError() {
    alert("Failed to Load JSON")
}

function JSONParseError() {
    alert("JSON parse error: corrupt or invalid JSON Data");
}

function calcTotalMinMax() {
    var length = data.segments.length;
    for (var i = 0; i < length; i++) {
        total += data.segments[i].value;
        if (data.segments[i].value < data.segments[smallestValueIndex].value) {
            smallestValueIndex = i;
        } else if (data.segments[i].value > data.segments[largestValueIndex].value) {
            largestValueIndex = i;
        }
    }
    // output values to console for testing
    console.log("total: " + total);
    console.log("length: " + length);
    console.log("smallest Index: " + smallestValueIndex);
    console.log("largest Index: " + largestValueIndex);
}

function setDefaultStyles() {
    //set default styles for canvas
    context.strokeStyle = "#333"; //colour of the lines
    context.lineWidth = 3;
    context.font = "bold 16pt Arial";
    context.fillStyle = "#900"; //colour of the text
    context.textAlign = "left";
}

function showPie() {

    //clear the canvas
    //canvas.width = canvas.width;

    //set the styles in case others have been set
    setDefaultStyles();
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var currentAngle = 0;

    // set variables using constant values
    var radius = RADIUS;
    var lineEndPoint = LINEENDPOINT;
    var textEndPoint = TEXTENDPOINT;

    //the difference for each wedge in the pie is arc along the circumference
    //we use the percentage to determine what percentage of the whole circle
    //the full circle is 2 * Math.PI radians long.
    //start at zero and travelling clockwise around the circle
    //start the center for each pie wedge
    //then draw a straight line out along the radius at the correct angle
    //then draw an arc from the current point along the circumference
    //stopping at the end of the percentage of the circumference
    //finally going back to the center point.


    //**** Remove loop header and pct calculation 
    //  for(var i=0; i<values.length; i++){
    //    var pct = values[i]/total;

    // new loop header and percent calculation
    for (var i = 0; i < data.segments.length; i++) {

        var pct = data.segments[i].value / total;

        //**** Remove this colour code

        //    //create colour 0 - 16777216 (2 ^ 24) based on the percentage
        //    var intColour = parseInt(pct * 16777216);
        //    //console.log(intColour);
        //    var red = ((intColour >> 16) & 255);
        //    var green = ((intColour >> 8) & 255);
        //    var blue = (intColour & 255);
        //    //console.log(red, green, blue);
        //    var colour = "rgb(" + red +"," + green+"," + blue+")";
        //    //console.log(colour);

        // new colours code  
        var colour = data.segments[i].color;

        // set the radius

        // NOTE I will go over this switch statement during Monday's class
        // however you should try to make the segment sizes change for 
        // smallest and largest
        switch (i) {
            
        default: 
                radius = RADIUS;
                lineEndPoint = LINEENDPOINT;
                textEndPoint = TEXTENDPOINT;
            break;

        case smallestValueIndex:
               radius = RADIUS * 0.8; //20% smaller
            lineEndPoint =  LINEENDPOINT + (RADIUS * 0.2);
            textEndPoint = TEXTENDPOINT + (RADIUS * 0.2);
            break;

        case largestValueIndex:
               radius = RADIUS * 1.2;
            lineEndPoint =  LINEENDPOINT - (RADIUS * 0.2);
            textEndPoint = TEXTENDPOINT - (RADIUS * 0.2);
            break;
        }

        //draw the arc
        var endAngle = currentAngle + (pct * (Math.PI * 2));
        context.moveTo(cx, cy);
        context.beginPath();
        context.fillStyle = colour;
        context.arc(cx, cy, radius, currentAngle, endAngle, false);
        context.lineTo(cx, cy);
        context.fill();


        //Now draw the lines that will point to the values
        context.save();
        context.translate(cx, cy); //make the middle of the circle the (0,0) point
        context.strokeStyle = "#0CF";
        context.lineWidth = 1;
        context.beginPath();
        //angle to be used for the lines
        var midAngle = (currentAngle + endAngle) / 2; //middle of two angles
        context.moveTo(0, 0); //this value is to start at the middle of the circle
        //to start further out...
        var dx = Math.cos(midAngle) * (0.8 * radius);
        var dy = Math.sin(midAngle) * (0.8 * radius);
        context.moveTo(dx, dy);
        //ending points for the lines
        var dx = Math.cos(midAngle) * (radius + lineEndPoint);
        var dy = Math.sin(midAngle) * (radius + lineEndPoint);
        context.lineTo(dx, dy);
        context.stroke();

        //Now draw the labels here
        
        context.font = '14px Arial';
        context.textAlign = 'center';
        context.fillStyle = "#333333";
        var label = data.segments[i].label;
        var x = Math.cos(midAngle) * (radius + textEndPoint);
        var y = Math.sin(midAngle) * (radius + textEndPoint);
        context.fillText(label, x, y);

        //put the canvas back to the original position
        context.restore();

        //update the currentAngle which is the starting angle for the next wedge
        currentAngle = endAngle;
    }
}

function showArcs(){
    //copy the array so we can work with a sorted version
//    var values_copy = data.segments[0].value;
//    values_copy.sort(function(a, b){return a-b});
    
    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set the styles in case others have been set
    setDefaultStyles();
    var cx = canvas.width/2;
    var cy = canvas.height/2;
    var radius = 40;
    var gap = 20
    var startAngle = 0;
   for (var i = 0; i < data.segments.length; i++) {

        var pct = data.segments[i].value / total;
        //find the percentage of the total for each value
        //var pct = values_copy[i]/total;
        //just use each value as a percentage
        //var pct = values_copy[i]/100;
        //create colour 0 - 16777216 (2 ^ 24) based on the percentage
//        var intColour = parseInt(pct * 16777216);
//        var red = ((intColour >> 16) & 255);
//        var green = ((intColour >> 8) & 255);
//        var blue = (intColour & 255);
//        var colour = "rgb(" + red + "," + green + "," + blue + ")";
        //they will all start at zero degrees (zero radians)
        var endAngle = startAngle + (pct * (Math.PI * 2));
        var color = data.segments[i].color;
        //console.log(values_copy[i], total, pct, endAngle);
        context.moveTo(cx+radius, cy);
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 10;
        context.arc(cx, cy, radius, startAngle, endAngle, false); 
        context.stroke();
        context.closePath();
      
        
        radius += 20;
   }
 
}