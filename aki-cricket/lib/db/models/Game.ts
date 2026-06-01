import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGame extends Document {
  sessionId: string;
  userId?: string;
  playerName?: string;
  actualPlayer?: string;
  guessedPlayer?: string;
  target: string;
  targetType: 'player' | 'team' | 'moment';
  guessedCorrectly: boolean;
  questionsAsked: number;
  questionHistory: { questionId: string; q: string; a: string }[];
  finalConfidence: number;
  duration: number;
  persona: string;
  dailyMode: boolean;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>({
  sessionId:        { type: String, required: true, unique: true },
  userId:           { type: String },
  playerName:       { type: String },
  actualPlayer:     { type: String },
  guessedPlayer:    { type: String },
  target:           { type: String },
  targetType:       { type: String, enum: ['player', 'team', 'moment'] },
  guessedCorrectly: { type: Boolean },
  questionsAsked:   { type: Number },
  questionHistory:  [{ questionId: String, q: String, a: String }],
  finalConfidence:  { type: Number },
  duration:         { type: Number },
  persona:          { type: String },
  dailyMode:        { type: Boolean, default: false },
  createdAt:        { type: Date, default: Date.now },
});

const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
export default Game;
