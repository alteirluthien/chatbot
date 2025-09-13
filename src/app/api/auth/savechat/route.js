// src/app/api/auth/savechat/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { chat, userEmail, sessionId } = await request.json();
    
    console.log('Save chat request:', { userEmail, sessionId, chatLength: chat?.length }); // Debug log
    
    if (!userEmail) {
      return Response.json({ status: 'error', message: 'Not logged in' }, { status: 401 });
    }
    
    if (!chat || !Array.isArray(chat)) {
      return Response.json({ status: 'error', message: 'Invalid chat data' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("chatbot");
    const collection = db.collection("user_chats");
    
    const session_id = sessionId || new Date().getTime().toString();
    
    // Process each message to handle both 'text' and 'content' properties
    const chatDocs = chat.map((msg, index) => {
      console.log(`Processing message ${index}:`, msg); // Debug log
      
      // Get the message content, supporting both 'text' and 'content' properties
      const messageContent = msg.text || msg.content || '';
      
      return {
        user_email: userEmail,
        chat_message: msg.sender === "bot" 
          ? messageContent  // Bot messages don't need sanitization
          : messageContent.replace(/</g, "&lt;").replace(/>/g, "&gt;"),  // Sanitize user messages
        sender: msg.sender,
        session_id,
        created_at: new Date()
      };
    });
    
    console.log('Processed chat docs:', chatDocs); // Debug log
    
    await collection.insertMany(chatDocs);
    
    return Response.json({ 
      status: 'success', 
      message: 'Chat saved successfully',
      sessionId: session_id,
      messagesSaved: chatDocs.length
    }, { status: 200 });
  } catch (err) {
    console.error("Save chat error:", err);
    return Response.json({ 
      status: 'error', 
      message: 'Failed to save chat',
      details: err.message 
    }, { status: 500 });
  }
}