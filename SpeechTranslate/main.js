// List of supported target languages
const targetLanguages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
  // Add more languages as needed
];

// Populate the target language dropdown
const targetLangSelect = document.querySelector(".lang");
targetLanguages.forEach((lang) => {
  const option = document.createElement("option");
  option.value = lang.code;
  option.textContent = lang.name;
  targetLangSelect.appendChild(option);
});

// Speech translation logic
const speechButton = document.querySelector(".speech");
const playbackAudio = document.querySelector(".playback");

let recognizer;

// Function to start recognition
function startRecognition() {
  const targetLang = targetLangSelect.value; // Get the selected target language

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    "4jlVCPyIlzr5NdcadGQI32O4G8TF5RGW7j5U8wkOAfUMR19lNmanJQQJ99BCACYeBjFXJ3w3AAAYACOGS0wM",
    "eastus"
  );
  const translationConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
    "4jlVCPyIlzr5NdcadGQI32O4G8TF5RGW7j5U8wkOAfUMR19lNmanJQQJ99BCACYeBjFXJ3w3AAAYACOGS0wM",
    "eastus"
  );

  // Set the source language to Spanish (Spain)
  translationConfig.speechRecognitionLanguage = "es-ES";

  // Set the target language to the selected language
  translationConfig.addTargetLanguage(targetLang);

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  recognizer = new SpeechSDK.TranslationRecognizer(
    translationConfig,
    audioConfig
  );

  recognizer.startContinuousRecognitionAsync(
    () => {
      console.log("Recognition started. Speak now...");
    },
    (error) => {
      console.error("Recognition failed to start: ", error);
    }
  );
}

// Function to stop recognition and process the result
function stopRecognition() {
  if (recognizer) {
    recognizer.stopContinuousRecognitionAsync(() => {
      console.log("Recognition stopped.");

      recognizer.recognized = (result) => {
        if (result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
          const translatedText = result.translations.get(
            targetLangSelect.value
          ); // Get translation in the selected language
          console.log("Translated Text: ", translatedText);

          // Synthesize the translated text into audio
          const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            "4jlVCPyIlzr5NdcadGQI32O4G8TF5RGW7j5U8wkOAfUMR19lNmanJQQJ99BCACYeBjFXJ3w3AAAYACOGS0wM",
            "eastus"
          );
          const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
          const synthesizer = new SpeechSDK.SpeechSynthesizer(
            speechConfig,
            audioConfig
          );

          synthesizer.speakTextAsync(translatedText, () => {
            console.log("Translation audio playback complete.");
          });
        } else {
          console.error("Translation failed: ", result.errorDetails);
        }
      };

      recognizer.close();
    });
  }
}

// Mouse click functionality
speechButton.addEventListener("mousedown", startRecognition);
speechButton.addEventListener("mouseup", stopRecognition);

// Left Ctrl key functionality
document.addEventListener("keydown", (event) => {
  if (event.key === "Control" && event.code === "ControlLeft") {
    speechButton.classList.add("active");
    startRecognition();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Control" && event.code === "ControlLeft") {
    speechButton.classList.remove("active");
    stopRecognition();
  }
});
