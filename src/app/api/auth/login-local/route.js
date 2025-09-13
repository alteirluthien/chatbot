// Temporary local storage-based login for testing
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // For testing purposes, accept any email/password combination
    if (password.length >= 6) {
      // Generate a mock token (for testing only)
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return Response.json({
        success: true,
        user: {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email: email,
          token: mockToken  // Add token field
        }
      });
    } else {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}