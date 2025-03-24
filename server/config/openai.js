const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// OpenAIの設定（Configuration は不要）
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai; 