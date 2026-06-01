import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  // Identity
  name: string;
  slug: string;
  type: 'player' | 'team' | 'moment';
  active: boolean;

  // Background
  country: string;
  isIndian: boolean;
  ageGroup: 'u25' | '25-30' | '30-35' | '35+';

  // Role
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  isBatsman: boolean;
  isBowler: boolean;
  isAllrounder: boolean;
  isWicketkeeper: boolean;

  // Batting Style
  leftHanded: boolean;
  isOpener: boolean;
  isFinisher: boolean;
  isAnchor: boolean;

  // Bowling Style
  bowlingStyle: 'fast' | 'medium' | 'spin' | 'none';
  isFastBowler: boolean;
  isSpinner: boolean;
  isMediumPacer: boolean;
  isLeftArmBowler: boolean;

  // IPL Career
  teams: string[];
  currentTeam: string;
  captainedTeam: boolean;
  isCaptain: boolean;
  debutYear: number;

  // IPL Achievements
  hasWonIPL: boolean;
  hasOrangeCap: boolean;
  hasPurpleCap: boolean;
  isMVP: boolean;
  isIcon: boolean;

  // Stats Profile
  strikeRateAbove140: boolean;
  economyBelow8: boolean;
  has50s: boolean;
  has100s: boolean;
  hasFifer: boolean;

  // Fame / Tier
  tier: 'legend' | 'star' | 'regular' | 'fringe';
  isRetired: boolean;
  hasPlayedWorldCup: boolean;

  // Tags for extra context
  tags: string[];

  // Learning stats
  guessedCorrectlyCount: number;
  guessedWrongCount: number;
  averageQuestionsToGuess: number;
}

const PlayerSchema = new Schema<IPlayer>({
  name:               { type: String, required: true, index: true },
  slug:               { type: String, required: true, unique: true },
  type:               { type: String, enum: ['player', 'team', 'moment'], default: 'player' },
  active:             { type: Boolean, default: true },

  country:            { type: String, required: true },
  isIndian:           { type: Boolean, default: false },
  ageGroup:           { type: String, enum: ['u25', '25-30', '30-35', '35+'] },

  role:               { type: String, enum: ['batsman', 'bowler', 'allrounder', 'wicketkeeper'] },
  isBatsman:          { type: Boolean, default: false },
  isBowler:           { type: Boolean, default: false },
  isAllrounder:       { type: Boolean, default: false },
  isWicketkeeper:     { type: Boolean, default: false },

  leftHanded:         { type: Boolean, default: false },
  isOpener:           { type: Boolean, default: false },
  isFinisher:         { type: Boolean, default: false },
  isAnchor:           { type: Boolean, default: false },

  bowlingStyle:       { type: String, enum: ['fast', 'medium', 'spin', 'none'], default: 'none' },
  isFastBowler:       { type: Boolean, default: false },
  isSpinner:          { type: Boolean, default: false },
  isMediumPacer:      { type: Boolean, default: false },
  isLeftArmBowler:    { type: Boolean, default: false },

  teams:              [{ type: String }],
  currentTeam:        { type: String },
  captainedTeam:      { type: Boolean, default: false },
  isCaptain:          { type: Boolean, default: false },
  debutYear:          { type: Number },

  hasWonIPL:          { type: Boolean, default: false },
  hasOrangeCap:       { type: Boolean, default: false },
  hasPurpleCap:       { type: Boolean, default: false },
  isMVP:              { type: Boolean, default: false },
  isIcon:             { type: Boolean, default: false },

  strikeRateAbove140: { type: Boolean, default: false },
  economyBelow8:      { type: Boolean, default: false },
  has50s:             { type: Boolean, default: false },
  has100s:            { type: Boolean, default: false },
  hasFifer:           { type: Boolean, default: false },

  tier:               { type: String, enum: ['legend', 'star', 'regular', 'fringe'] },
  isRetired:          { type: Boolean, default: false },
  hasPlayedWorldCup:  { type: Boolean, default: false },

  tags:               [{ type: String }],

  guessedCorrectlyCount:    { type: Number, default: 0 },
  guessedWrongCount:        { type: Number, default: 0 },
  averageQuestionsToGuess:  { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
