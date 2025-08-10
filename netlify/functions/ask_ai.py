// Bestand: .netlify/functions/ask_ai.js
import fetch from 'node-fetch';

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error.message || 'Onbekende OpenAI API-fout' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: data.choices[0].message.content.trim() }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};