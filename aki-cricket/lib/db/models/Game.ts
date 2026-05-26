import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  sessionId: string;
  userId?: string;
  playerName?: string;
  target: string;
  targetType: 'player' | 'team' | 'moment';
  guessedCorrectly: boolean;
  questionsAsked: number;
  questionHistory: { q: string; a: string }[];
  finalConfidence: number;
  duration: number;
  persona: string;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>({
  sessionId:        { type: String, required: true },
  userId:           { type: String },
  playerName:       { type: String },
  target:           { type: String },
  targetType:       { type: String, enum: ['player', 'team', 'moment'] },
  guessedCorrectly: { type: Boolean },
  questionsAsked:   { type: Number },
  questionHistory:  [{ q: String, a: String }],
  finalConfidence:  { type: Number },
  duration:         { type: Number },
  persona:          { type: String },
  createdAt:        { type: Date, default: Date.now },
});

export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
