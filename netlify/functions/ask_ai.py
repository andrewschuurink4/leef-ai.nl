import os
import json
import google.generativeai as genai

def handler(event, context):
    try:
        # Configureer de API met de omgevingsvariabele van Netlify
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        model = genai.GenerativeModel('gemini-pro')
        
        # Haal de prompt uit het body van het POST-verzoek
        body = json.loads(event['body'])
        prompt_text = body.get('prompt')

        if not prompt_text:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Prompt is vereist."})
            }

        response = model.generate_content(prompt_text)
        
        return {
            "statusCode": 200,
            "body": json.dumps({"response": response.text})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }