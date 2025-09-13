import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { userEmail, rating, comment, sessionId } = await request.json();

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return Response.json({ 
        status: 'error', 
        message: 'Valid rating is required (1-5)' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("chatbot");
    const collection = db.collection("feedback");

    const feedbackDoc = {
      user_email: userEmail || null,
      rating,
      comment: comment || '',
      session_id: sessionId || null,
      created_at: new Date()
    };

    await collection.insertOne(feedbackDoc);

    return Response.json({ 
      status: 'success', 
      message: 'Feedback submitted successfully' 
    }, { status: 200 });
  } catch (err) {
    console.error("Feedback submission error:", err);
    return Response.json({ 
      status: 'error', 
      message: 'Failed to submit feedback',
      details: err.message 
    }, { status: 500 });
  }
}