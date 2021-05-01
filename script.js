// script.js



const EL = (sel) => document.querySelector(sel);
const ctx = EL("#user-image").getContext("2d");

function readImage() {
  if (!this.files || !this.files[0]) return;
  
  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {	
	
  // TODO
  //clear the canvas context
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//fill the canvas context with black
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//toggle the relevant buttons

document.getElementById("reset").disabled = false;
document.getElementById("read").disabled = false;

//draw the uploaded image 
// use returned values 
const obj = getDimmensions(ctx.canvas.width,ctx.canvas.height,img.width,img.height);

ctx.drawImage(img,obj.startX, obj.startY, obj.width, obj.height);


  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
img.src = evt.target.result;
  });
  FR.readAsDataURL(this.files[0]);
}
EL("#image-input").addEventListener("change", readImage);

// On form: submit
document.getElementById("submit").onclick = function () 
{ 
// read text from 
	if (document.getElementById("text-top").value.length == 0&& document.getElementById("text-bottom").value.length == 0)
	{
		alert("Fill in the texts");
		return;
	}
	else
	{
		// grab the text values
		var text_top = document.getElementById("text-top").value;
		var text_bottom = document.getElementById("text-bottom").value;
		
		// fill the text on canvas		

		ctx.font = "12px Comic Sans MS";
		ctx.fillStyle = "red";
		
		var centerPointWidth = 10;
		var centerPointHeight = 10;
		ctx.fillText(text_top,(ctx.canvas.width / 2) - (centerPointWidth / 2), (ctx.canvas.height / 2) - (centerPointHeight+40 / 2));
		ctx.fillText(text_bottom,(ctx.canvas.width / 2) - (centerPointWidth / 2), (ctx.canvas.height / 2) - (centerPointHeight / 2));
		
		//toggle the relevant buttons

		document.getElementById("reset").disabled = false;
		document.getElementById("read").disabled = false;
		document.getElementById("voice-selection").disabled = false;
		
	}


return false
};

//button: clear
document.getElementById("reset").onclick = function () 
{ 

	//clear the canvas context
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
// clear the text
document.getElementById("text-top").value="";
document.getElementById("text-bottom").value="";
	
//toggle the relevant buttons
document.getElementById('image-input').value= null;
document.getElementById("reset").disabled = true;
document.getElementById("read").disabled = true;
document.getElementById("voice-selection").disabled = true;


return false
};


var synth = window.speechSynthesis;
var inputForm = document.querySelector('form');
var voiceSelect = document.querySelector('select');

var text_top = document.getElementById("text-top");
var text_bottom = document.getElementById("text-bottom");
var vol = document.querySelector('#vol');


// A function to populate the voice list
var voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}


//button: read text
document.getElementById("read").onclick = function () 
{

	speak(text_top.value);
	speak(text_bottom.value);
	


	return false
}
function speak(text_top)
{
	
 if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if ( text_top !== '') {
    var utterThis = new SpeechSynthesisUtterance(text_top);
	
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
	
  // change the volume	
vol.addEventListener("change", function(e) {
	utterThis.volume = vol.value/100; 
})
 // utterThis.volume = vol.value; 
    synth.speak(utterThis);
	
	if (vol.value >= 67 && vol.value  <= 100) 
		{
			document.querySelector("img").src = "icons/volume-level-3.svg";
		}
	else if (vol.value >= 34 && vol.value  <= 66) 
		{
			document.querySelector("img").src = "icons/volume-level-2.svg";
		}
		
		else if (vol.value >= 1 && vol.value  <= 33) 
		{
			document.querySelector("img").src = "icons/volume-level-1.svg";
		}
		else if(vol.value == 0 )
		{
			document.querySelector("img").src = "icons/volume-level-0.svg";
		}
  }
}


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
