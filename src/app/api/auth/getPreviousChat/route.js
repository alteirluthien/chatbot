import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { userEmail, sessionId } = await request.json();

    if (!userEmail) {
      return Response.json({ status: "error", message: "Not logged in" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("college_enquiry");
    const collection = db.collection("user_chats");

    // If sessionId is provided, fetch that session, else fetch the latest session
    const query = sessionId
      ? { user_email: userEmail, session_id: sessionId }
      : { user_email: userEmail };

    const sortOrder = sessionId ? {} : { created_at: -1 }; // latest session first

    // Fetch chat messages
    const chats = await collection
      .find(query)
      .sort(sortOrder)
      .toArray();

    if (!chats.length) {
      return Response.json({ status: "error", message: "No previous chats found" }, { status: 404 });
    }

    return Response.json({ status: "success", chat: chats }, { status: 200 });
  } catch (err) {
    console.error("Open previous chat error:", err);
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}
