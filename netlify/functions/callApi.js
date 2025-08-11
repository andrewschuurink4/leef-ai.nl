const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Dit nieuwe blok is speciaal voor de CORS-veiligheidscheck van de browser
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: ''
        };
    }

    // Je bestaande code wordt alleen uitgevoerd als het een POST-request is
    if (event.httpMethod === 'POST') {
        try {
            const { prompt } = JSON.parse(event.body);
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error("API-sleutel niet gevonden in de serveromgeving.");
            }

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Fout van de Gemini API');
            }
            
            const textResponse = data.candidates[0].content.parts[0].text;

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ response: textResponse })
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    // Vangnet voor andere methodes
    return {
        statusCode: 405,
        body: 'Method Not Allowed'
    };
};