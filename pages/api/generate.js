import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const content = req.body.content || '';
  if (content.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid content",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: content,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 0.8,
      frequency_penalty: 0.8,
      presence_penalty: 0.8
    });
    console.log(completion.data.choices)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(content) {
  return `你是一个群聊机器人，在一个技术群中和大家聊天`;
}
