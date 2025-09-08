// Temporary local storage-based login for testing
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For testing purposes, accept any email/password combination
    // In real implementation, this would check against MongoDB
    if (password.length >= 6) {
      return Response.json({
        success: true,
        user: {
          id: Date.now().toString(),
          name: email.split('@')[0], // Use email prefix as name
          email: email,
        }
      });
    } else {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}