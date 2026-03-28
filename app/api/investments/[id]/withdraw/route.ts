import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Investment from '@/models/Investment';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const investment = await Investment.findById(id);

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (investment.userId.toString() !== authUser.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if already withdrawn
    if (investment.status === 'withdrawn') {
      return NextResponse.json(
        { error: 'Investment already withdrawn' },
        { status: 400 }
      );
    }

    // Check maturity
    const now = new Date();
    if (investment.maturityDate > now) {
      return NextResponse.json(
        { error: 'Investment has not matured yet' },
        { status: 400 }
      );
    }

    // Update investment
    investment.status = 'withdrawn';
    investment.withdrawnAt = now;
    await investment.save();

    return NextResponse.json(
      {
        message: 'Withdrawal successful',
        investment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Withdraw error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
