const azureTTS = require('./azure-tts');

(async () => {
  try {
    const text = 'apple';
    const audioUrl = await azureTTS.textToSpeech(text);
    console.log('Audio URL:', audioUrl);
  } catch (error) {
    console.error('Error:', error);
  }
})();