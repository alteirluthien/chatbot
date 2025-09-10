import clientPromise from "@/lib/mongodb"; // your MongoDB connection helper

export async function POST(request) {
  try {
    const { chat, userEmail, sessionId } = await request.json();

    if (!userEmail) {
      return Response.json({ status: 'error', message: 'Not logged in' }, { status: 401 });
    }

    if (!chat || !Array.isArray(chat)) {
      return Response.json({ status: 'error', message: 'Invalid chat data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("chatbot"); // your DB name
    const collection = db.collection("user_chats");

    const session_id = sessionId || new Date().getTime().toString();

    const chatDocs = chat.map(msg => ({
      user_email: userEmail,
      chat_message: msg.sender === "bot" ? msg.text : msg.text.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      sender: msg.sender,
      session_id,
      created_at: new Date()
    }));

    await collection.insertMany(chatDocs);

    return Response.json({ status: 'success', message: 'Chat saved' }, { status: 200 });
  } catch (err) {
    console.error("Save chat error:", err);
    return Response.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
