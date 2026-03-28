import { connectDB } from '@/lib/db';
import { signToken, setAuthToken } from '@/lib/auth';
import User from '@/models/User';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Sign token
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set cookie
    await setAuthToken(token);

    return NextResponse.json(
      {
        message: 'Login successful',
        userId: user._id,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Login error:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: `Login failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
