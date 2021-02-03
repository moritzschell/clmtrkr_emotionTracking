//Video Capture (Webcam)
var capture;

//clmtrackr
var tracker;

/*
Emotion-specific global variables
*/
//delete emotionModel['disgusted'];
//elete emotionModel['fear'];
var ec = new emotionClassifier();
var predictedEmotions;
ec.init(emotionModel);
var emotionData = ec.getBlank();


var w = 640;
var h = 480;
var captureReady = false;


function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO, function () {
    console.log('capture ready.');
    captureReady = true;
  });
  capture.elt.setAttribute('playsinline', '');
  capture.size(w, h);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(capture.elt);
}

function draw() {
  background(0);
  image(capture, 0, 0);

  noStroke();
  fill(0, 100);
  rect(0, 0, width, height);

  drawFacePoints();
  getEmotions();
}


//preview of emotion estimation
function getEmotions() {
  if (captureReady) {
    var cp = tracker.getCurrentParameters();
    predictedEmotions = ec.meanPredict(cp);

    if (predictedEmotions) {
      //print(predictedEmotions);
      textSize(20);
      noStroke();
      fill(255);
      for (var i = 0; i < predictedEmotions.length; i++) {
        //print(i + " - " + predictedEmotions[i].emotion + ": " + predictedEmotions[i].value);
        text(predictedEmotions[i].emotion + ": " + predictedEmotions[i].value.round(2), 50, i * 50 + 50);

        var barLength = predictedEmotions[i].value * 100;
        rect(50, i * 50 + 55, barLength, 20);
      }

    }

  }
}

//preview of faceFeature recognition
function drawFacePoints() {
  if (captureReady) {

    //Based on the example of Kyle MCDonald: 
    //https://editor.p5js.org/kylemcdonald/sketches/BJOcyD9hm

    var positions = tracker.getCurrentPosition();
    //print(positions);

    /*
    noFill();
    stroke(255);
    beginShape();
    for (var i = 0; i < positions.length; i++) {
      vertex(positions[i][0], positions[i][1]);
    }
    endShape();
    */

    noStroke();
    for (var i = 0; i < positions.length; i++) {
      fill(255, 0, 0);
      ellipse(positions[i][0], positions[i][1], 4, 4);
      textSize(10);
      text(i, positions[i][0], positions[i][1]);
    }
    /*
    // uncomment the below to show an estimate of amount "smiling"
    if (positions.length > 0) {
        var mouthLeft = createVector(positions[44][0], positions[44][1]);
        var mouthRight = createVector(positions[50][0], positions[50][1]);
        var smile = mouthLeft.dist(mouthRight);
        rect(20, 20, smile * 3, 20);
    }
    */
  }
}

//Helper - Round numbers to n-decimals
Number.prototype.round = function (places) {
  return +(Math.round(this + "e+" + places) + "e-" + places);
}