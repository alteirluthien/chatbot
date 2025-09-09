// Temporary local storage-based feedback for testing
export async function POST(request) {
  try {
    const { message, rating } = await request.json();

    // Validate input
    if (!message || !rating) {
      return Response.json(
        { error: "Message and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating (must be 1–5)
    const ratingValue = parseInt(rating, 10);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return Response.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    // Fake storage: just return the feedback object
    return Response.json(
      {
        success: true,
        feedback: {
          id: Date.now().toString(), // simple fake ID
          message,
          rating: ratingValue,
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Feedback error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
