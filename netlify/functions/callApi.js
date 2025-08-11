// Bestand: leef/netlify/functions/callApi.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API-sleutel niet gevonden (GEMINI_API_KEY ontbreekt)" })
            };
        }

        // De API-aanroep met de CORRECTE modelnaam
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
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
            console.error('Fout van Gemini API:', data);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.error.message || 'Onbekende Gemini API-fout' })
            };
        }

        const textResponse = data.candidates[0].content.parts[0].text;

        // Je headers zijn perfect om CORS-fouten te voorkomen
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ response: textResponse })
        };
    } catch (error) {
        console.error("Fout in functie:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: `Fout in functie: ${error.message}` })
        };
    }
};