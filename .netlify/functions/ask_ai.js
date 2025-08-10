// Bestand: .netlify/functions/ask_ai.js
import fetch from 'node-fetch';

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY, // Gebruik GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error.message || 'Onbekende Gemini API-fout' }),
      };
    }

    // De Gemini-API respons heeft een andere structuur dan OpenAI
    return {
      statusCode: 200,
      body: JSON.stringify({ response: data.candidates[0].content.parts[0].text }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};