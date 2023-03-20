const { OpenAIApi, Configuration } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function speechToText(audioBuffer) {
  const result = await openai.asr.recognize({
    data: audioBuffer,
    format: "audio/x-wav"
  });
  return result;
}

module.exports = {
  speechToText
};
