import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Investment from '@/models/Investment';
import { getProduct } from '@/lib/products';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const investments = await Investment.find({ userId: authUser.userId }).sort({ createdAt: -1 });

    // Check maturity status
    const now = new Date();
    const updatedInvestments = investments.map((inv) => ({
      ...inv.toObject(),
      status: inv.maturityDate <= now && inv.status === 'active' ? 'matured' : inv.status,
    }));

    return NextResponse.json({ investments: updatedInvestments }, { status: 200 });
  } catch (error) {
    console.error('Get investments error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, amount } = await req.json();

    // Validation
    if (!productId || !amount) {
      return NextResponse.json(
        { error: 'Product ID and amount are required' },
        { status: 400 }
      );
    }

    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (amount < product.minInvestment || amount > product.maxInvestment) {
      return NextResponse.json(
        {
          error: `Investment amount must be between ${product.minInvestment} and ${product.maxInvestment}`,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate expected return and maturity date
    const expectedReturn = amount * (product.returnRate / 100);
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + product.durationMonths);

    const investment = await Investment.create({
      userId: authUser.userId,
      productId: product.id,
      productName: product.name,
      amount,
      returnRate: product.returnRate,
      durationMonths: product.durationMonths,
      expectedReturn,
      maturityDate,
    });

    return NextResponse.json(
      {
        message: 'Investment created successfully',
        investment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create investment error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
