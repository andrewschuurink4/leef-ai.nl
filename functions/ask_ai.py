import os
import json
import google.generativeai as genai

def handler(event, context):
    if event['httpMethod'] != 'POST':
        return { "statusCode": 405, "body": json.dumps({"error": "Method Not Allowed"}) }

    try:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            return { "statusCode": 500, "body": json.dumps({"error": "API sleutel is niet gevonden. Stel de GOOGLE_API_KEY in op Netlify."}) }
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        body = json.loads(event['body'])
        prompt_text = body.get('prompt')

        if not prompt_text:
            return { "statusCode": 400, "body": json.dumps({"error": "Prompt is vereist in de request."}) }

        response = model.generate_content(prompt_text)
        
        return {
            "statusCode": 200,
            "headers": { "Content-Type": "application/json" },
            "body": json.dumps({"response": response.text})
        }
    except Exception as e:
        print(f"Fout tijdens uitvoeren van functie: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }