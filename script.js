// script.js


var canvas = document.getElementById("user-image");
var ctx = canvas.getContext("2d");
const img = new Image(); // used to load image from <input> and draw to canvas

var synth = window.speechSynthesis;
var voices = [];
var voiceSelect = document.getElementById('voice-selection');

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function populateVoiceList() {
  voices = synth.getVoices();
  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);

    
  }
}

var image = document.querySelector("input");
image.addEventListener('change', (event) => {
  var url = URL.createObjectURL(image.files[0]);
  img.src = url;
  img.alt = image.value.replace("C:\\fakepath\\", "")
  //ctx.fillText(image.value, canvas.width/2, canvas.height/2);
});


function printText(event) {
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "40px Arial"
  let top = document.getElementById('text-top');
  let bot = document.getElementById('text-bottom');
  ctx.fillText(top.value, canvas.width/2, 40);
  ctx.fillText(bot.value, canvas.width/2, canvas.height - 10);
  document.querySelector('button[type="submit"]').disabled = true;
  document.querySelector('button[type="reset"]').disabled = false;
  document.querySelector('button[type="button"]').disabled = false;
  document.getElementById('voice-selection').disabled = false;
  event.preventDefault();
}
var form = document.getElementById('generate-meme');
form.addEventListener('submit', printText);

const resetbutton = document.querySelector('button[type="reset"]');
const readbutton = document.querySelector('button[type="button"]');

resetbutton.addEventListener('click', event => {
  document.querySelector('button[type="submit"]').disabled = false;
  document.querySelector('button[type="reset"]').disabled = true;
  document.querySelector('button[type="button"]').disabled = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

readbutton.addEventListener('click', event => {
  let top = document.getElementById('text-top').value;
  let bot = document.getElementById('text-bottom').value;
  let final = top + bot;

  event.preventDefault();

  var utterThis = new SpeechSynthesisUtterance(final);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  // ctx.fillText(document.querySelector('input[type="range"]').value, canvas.width/2, canvas.height/2);
  utterThis.volume = 1 * (document.querySelector('input[type="range"]').value)/100;
  synth.speak(utterThis);

}); 

var slider = document.querySelector('input[type="range"]');
var volume = document.querySelector('img');
slider.addEventListener('input', updateValue);

function updateValue(event) {
  // ctx.fillText(volume.src, canvas.width/2, canvas.height/2);
  if (slider.value >= 67) {
    volume.src = "icons/volume-level-3.svg";
  } else if (slider.value >= 34) {
    volume.src = "icons/volume-level-2.svg";
  } else if (slider.value >= 1) {
    volume.src = "icons/volume-level-1.svg";
  } else { 
    volume.src = "icons/volume-level-0.svg";
  }
}

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  var list = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, list['startX'], list['startY'], list['width'], list['height']);
  ctx.globalCompositeOperation = 'source-over';
  //ctx.fillText(img.alt, 10, 50);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
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
