import mongoose from 'mongoose';

export interface IInvestment extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  productId: string;
  productName: string;
  amount: number;
  returnRate: number;
  durationMonths: number;
  expectedReturn: number;
  maturityDate: Date;
  status: 'active' | 'matured' | 'withdrawn';
  createdAt: Date;
  withdrawnAt?: Date;
}

const InvestmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  returnRate: {
    type: Number,
    required: true,
  },
  durationMonths: {
    type: Number,
    required: true,
  },
  expectedReturn: {
    type: Number,
    required: true,
  },
  maturityDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'matured', 'withdrawn'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  withdrawnAt: {
    type: Date,
  },
});

export default mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
