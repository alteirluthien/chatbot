// src/app/api/auth/getPreviousChat/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { userEmail, sessionId } = await request.json();

    if (!userEmail) {
      return Response.json({ status: "error", message: "Not logged in" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("chatbot");
    const collection = db.collection("user_chats");

    const query = sessionId
      ? { user_email: userEmail, session_id: sessionId }
      : { user_email: userEmail };

    const sortOrder = sessionId ? { created_at: 1 } : { created_at: -1 };

    const chats = await collection
      .find(query)
      .sort(sortOrder)
      .toArray();

    if (!chats.length) {
      return Response.json({ status: "error", message: "No previous chats found" }, { status: 404 });
    }

    // If no sessionId was provided, get only the latest session
    if (!sessionId) {
      const latestSessionId = chats[0].session_id;
      const latestSessionChats = chats.filter(chat => chat.session_id === latestSessionId);
      return Response.json({ 
        status: "success", 
        chat: latestSessionChats.map(chat => ({
          sender: chat.sender,
          text: chat.chat_message  // Use 'text' property for consistency
        })), 
        sessionId: latestSessionId 
      }, { status: 200 });
    }

    return Response.json({ 
      status: "success", 
      chat: chats.map(chat => ({
        sender: chat.sender,
        text: chat.chat_message  // Use 'text' property for consistency
      }))
    }, { status: 200 });
  } catch (err) {
    console.error("Open previous chat error:", err);
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}