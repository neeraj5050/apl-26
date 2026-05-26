import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  bestStreak: number;
  avgQuestions: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name:           { type: String, required: true },
  email:          { type: String },
  gamesPlayed:    { type: Number, default: 0 },
  wins:           { type: Number, default: 0 },
  currentStreak:  { type: Number, default: 0 },
  bestStreak:     { type: Number, default: 0 },
  avgQuestions:   { type: Number, default: 0 },
  createdAt:      { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
