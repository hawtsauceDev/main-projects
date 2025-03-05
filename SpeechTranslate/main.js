let playback = document.querySelector(".playback");
let mic = document.querySelector(".speech");
let micOn = false;
let mediaRecorder;
let audioChunks = [];
let lang = document.querySelector(".lang")


const langOptions = ["Ingles", "Francés", "Italiano"]

langOptions.forEach((option, index) => {
  const newOption = document.createElement("option");
  newOption.value = index + 1; // Assigning a numeric value
  newOption.textContent = option;
  lang.appendChild(newOption);
});



async function record() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      playback.src = URL.createObjectURL(audioBlob); // Use audioPlayback here
      audioChunks = []; // Clear recorded chunks for the next recording
    };


    mediaRecorder.start();
    console.log("Recording started");
  } catch (error) {
    console.error("Error Accessing the microphone:", error);
    alert(
      "Microphone access denied. Please allow microphone permisions to record audio"
    );
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Recording stopped");
  }
}

document.addEventListener("keydown", function (event) {
  if (event.code === "ControlLeft" && !event.repeat && !micOn) {
    micOn = true;
    mic.classList.add("active");
    record();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "ControlLeft" && micOn) {
    micOn = false;
    mic.classList.remove("active");
    stopRecording();
  }
});

mic.addEventListener("click", () => {
  micOn = !micOn;
  if (micOn) {
    mic.classList.add("active");
    record();
  } else {
    mic.classList.remove("active");
    stopRecording();
  }
});
