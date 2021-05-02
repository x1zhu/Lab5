// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

let generate_button = document.querySelector('button[type="submit"]');
let reset_button = document.querySelector('button[type="reset"]');
let read_button = document.querySelector('button[type="button"]');
let volume = document.querySelector('input[type="range"]');
let volumeImage = document.getElementById('volume-group').getElementsByTagName('img')[0];
let voiceSelect = document.getElementById('voice-selection');
let upper_text = document.getElementById('text-top');
let lower_text = document.getElementById('text-bottom');
let form = document.getElementById("generate-meme");

let canvas = document.getElementById('user-image');
let canvasContent = canvas.getContext('2d');
let currentLanguages;


function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }
  document.getElementById("voice-selection").disabled = false;
  document.getElementById("voice-selection").innerHTML = '';
  currentLanguages = speechSynthesis.getVoices();
  for(var i = 0; i < currentLanguages.length; i++) {
    var option = document.createElement('option');
    option.textContent = currentLanguages[i].name + ' (' + currentLanguages[i].lang + ')';
    option.setAttribute('value', i);
    document.getElementById("voice-selection").appendChild(option);
  }
}

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

read_button.addEventListener('click', ()=>{
  let speak = new SpeechSynthesisUtterance(upper_text.value+" , "+lower_text.value);
  speak.volume =  volume.value / 100;
  speak.voice =  currentLanguages[voiceSelect.value];
  speechSynthesis.speak(speak);
});


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  let imageDetails = getDimmensions(canvas.width, canvas.height,img.width,img.height);

  canvasContent.clearRect(0, 0, canvas.width, canvas.height);
  canvasContent.fillStyle="black";
  canvasContent.fillRect(0,0,canvas.width,canvas.height);

  reset_button.disabled =  true;
  read_button.disabled =  true;
  generate_button.disabled = false;

  form.reset();

  canvasContent.drawImage(img, imageDetails.startX, imageDetails.startY, imageDetails.width, imageDetails.height);
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



document.getElementById('image-input').addEventListener("change", function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(this.files[0]);
    }
})


reset_button.addEventListener('click',()=>{
  form.reset();
  canvasContent.clearRect(0, 0, canvas.width, canvas.height);
  reset_button.disabled =  true;
  read_button.disabled =  true;
})

form.addEventListener('submit',(e)=>{
  e.preventDefault();
  let ut = upper_text.value;
  let lt = lower_text.value;

  canvasContent.font = "25px Calibri";
  canvasContent.fillStyle = "white";
  canvasContent.textAlign = 'center';
  canvasContent.fillText(ut, canvas.width/2, 40);

  canvasContent.font = "25px Calibri";
  canvasContent.fillStyle = "white";
  canvasContent.textAlign = 'center';
  canvasContent.fillText(lt, canvas.width/2, canvas.height - 40);

  reset_button.disabled =  false;
  read_button.disabled =  false;

});


volume.addEventListener("input", ()=>{
  let volumeCurrently = volume.value;
  
  if(volumeCurrently == 0)
    volumeImage.src="icons/volume-level-0.svg";
  else if(volumeCurrently <= 33)
    volumeImage.src="icons/volume-level-1.svg";
  else if(volumeCurrently <= 66)
    volumeImage.src="icons/volume-level-2.svg";
  else
    volumeImage.src="icons/volume-level-3.svg";
  

});