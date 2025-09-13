// src/app/api/debug-chats/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { userEmail } = await request.json();
    
    if (!userEmail) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("chatbot");
    const collection = db.collection("user_chats");
    
    // Get all sessions for this user
    const sessions = await collection
      .aggregate([
        { $match: { user_email: userEmail } },
        { $group: { _id: "$session_id", count: { $sum: 1 }, lastMessage: { $max: "$created_at" } } },
        { $sort: { lastMessage: -1 } }
      ])
      .toArray();
    
    // Get all messages for the latest session
    let latestMessages = [];
    if (sessions.length > 0) {
      latestMessages = await collection
        .find({ user_email: userEmail, session_id: sessions[0]._id })
        .sort({ created_at: 1 })
        .toArray();
    }
    
    return Response.json({
      sessions,
      latestSessionMessages: latestMessages,
      totalSessions: sessions.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}