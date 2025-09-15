// src/app/api/chat/route.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Format messages for OpenAI
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: typeof msg.content === 'string' ? msg.content : String(msg.content)
    }));

    // Add system message
    formattedMessages.unshift({
      role: 'system',
      content: 'You are a helpful assistant for a college enquiry chatbot. Provide concise and helpful answers to questions about college admissions, courses, fees, and other related topics.'
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return Response.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}