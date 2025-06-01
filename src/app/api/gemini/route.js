import { NextResponse } from 'next/server';
import axios from 'axios';
import { generatePromptFromCode,generatePromptFromQuestion } from './generatePrompt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, content } = body;

    if (!type || !content) {
      return NextResponse.json({ error: 'Both type and content are required' }, { status: 400 });
    }

    let prompt;
    if (type === 'question') {
      prompt = generatePromptFromQuestion(content);



    } else if (type === 'code') {
      prompt = generatePromptFromCode(content);
    } else {
      return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;

    const response = await axios.post(
      apiUrl,
      {
        // your request payload per Gemini docs
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', response.data);

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return NextResponse.json({ error: 'No answer received from API' }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to get response from Gemini' }, { status: 500 });
  }
}
