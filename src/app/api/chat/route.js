import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return Response.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI API errors
    if (error.status === 429) {
      return Response.json(
        { 
          error: 'OpenAI quota exceeded. Please check your billing details or try again later.',
          type: 'quota_exceeded'
        },
        { status: 429 }
      );
    }
    
    if (error.status === 401) {
      return Response.json(
        { 
          error: 'Invalid OpenAI API key. Please check your configuration.',
          type: 'auth_error'
        },
        { status: 401 }
      );
    }
    
    return Response.json(
      { 
        error: 'Failed to process your request. Please try again later.',
        type: 'general_error'
      },
      { status: 500 }
    );
  }
}