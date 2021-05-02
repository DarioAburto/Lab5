// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const input = document.getElementById("image-input");
const form = document.querySelector("[type='submit']");
const clear = document.querySelector("[type='reset']");
const readText = document.querySelector("[type='button']");
var voiceSelection = document.getElementById('voice-selection');
const volume = document.querySelector("[type='range']");
voiceSelection.remove(0);
voiceSelection.disabled = false;



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  var ctx = document.getElementById('user-image').getContext('2d');
  var dimensions = getDimmensions(400, 400, img.width, img.height);
  ctx.clearRect(0,0, 400, 400);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,400,400);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
  readText.disabled = false;
  clear.disabled = false;

});

input.addEventListener('change',() => {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = input.files[0].name;
});

form.addEventListener('click', function(event){
  event.preventDefault();
  var ctx = document.getElementById('user-image').getContext('2d');
  var topText = document.getElementById('text-top');
  var bottomText = document.getElementById('text-bottom');
  ctx.font  = '35px Arial';
  ctx.textAlign = "center";
  ctx.fillText(topText.value, 200, 50);
  ctx.fillText(bottomText.value, 200, 370 );
  clear.disabled = false;
  readText.disabled = false;
  form.disabled = true;
  event.preventDefault();
});


clear.addEventListener('click', () => {
  var ctx = document.getElementById('user-image').getContext('2d');
  ctx.clearRect(0,0, 400, 400);
  form.disabled = false;

});

var synth = window.speechSynthesis;
var voices = [];
function populateVoices() {
  voices = synth.getVoices();
  for(var i =0; i < voices.length ; i++){
    var option = document.createElement('option');
    option.textContent = voices[i].name + '(' + voices[i].lang + ')';

    if(voices[i].default){
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelection.appendChild(option);
    }
  }

  populateVoices();
  if(speechSynthesis.onvoiceschanged !== undefined){
    speechSynthesis.onvoiceschanged = populateVoices;
  }

readText.addEventListener('click', function(event) {
  event.preventDefault();
  var topText = document.getElementById('text-top');
  var bottomText = document.getElementById('text-bottom');
  var readTop = new SpeechSynthesisUtterance(topText.value);
  var readBottom = new SpeechSynthesisUtterance(bottomText.value);
  var selectedOption = voiceSelection.selectedOptions[0].getAttribute('data-name');
  for(var i =0; i < voices.length ; i++){
    if(voices[i].name === selectedOption){
      readTop.voice = voices[i];
      readBottom.voices = voices[i];

    }
  }
  readTop.volume = volume.value / 100;
  readBottom.volume = volume.value / 100;
  synth.speak(readTop);
  synth.speak(readBottom);
});

volume.addEventListener('input' ,() => {

  if( volume.value >= 67 && volume.value <= 100){
    document.querySelector("#volume-group > img").src = "icons/volume-level-3.svg";

  }else if (volume.value >= 34 && volume.value <= 66 ){
    document.querySelector("#volume-group > img").src = "icons/volume-level-2.svg";
  
  }else if(volume.value >= 1 && volume.value <= 33){
    document.querySelector("#volume-group > img").src = "icons/volume-level-1.svg";
  }else{
    document.querySelector("#volume-group > img").src = "icons/volume-level-0.svg";
  }

});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
