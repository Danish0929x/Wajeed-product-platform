import { connectDB } from '@/lib/db';
import { signToken, setAuthToken } from '@/lib/auth';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Sign token
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set cookie
    await setAuthToken(token);

    return NextResponse.json(
      {
        message: 'User registered successfully',
        userId: user._id,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Register error:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: `Registration failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
