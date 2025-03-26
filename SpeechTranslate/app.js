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

speechButton.addEventListener("click", () => {
  const targetLang = targetLangSelect.value; // Get the selected target language

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("GFG53crPSR5szAry9KXJHYkXthtIgTBUXAIhww5CufDPVSmuNlbDJQQJ99BCACYeBjFXJ3w3AAAYACOG8nMM",
    "eastus");
  const translationConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription("GFG53crPSR5szAry9KXJHYkXthtIgTBUXAIhww5CufDPVSmuNlbDJQQJ99BCACYeBjFXJ3w3AAAYACOG8nMM",
    "eastus");

  // Set the source language to Spanish (Spain)
  translationConfig.speechRecognitionLanguage = "es-ES";

  // Set the target language to the selected language
  translationConfig.addTargetLanguage(targetLang);

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new SpeechSDK.TranslationRecognizer(translationConfig, audioConfig);

  recognizer.recognizeOnceAsync((result) => {
    if (result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
      const translatedText = result.translations.get(targetLang); // Get translation in the selected language
      console.log("Translated Text: ", translatedText);

      // Synthesize the translated text into audio
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("GFG53crPSR5szAry9KXJHYkXthtIgTBUXAIhww5CufDPVSmuNlbDJQQJ99BCACYeBjFXJ3w3AAAYACOG8nMM",
    "eastus");
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

      synthesizer.speakTextAsync(translatedText, () => {
        console.log("Translation audio playback complete.");
      });
    } else {
      console.error("Translation failed: ", result.errorDetails);
    }
    recognizer.close();
  });
});