import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  type: 'player' | 'team' | 'moment';
  active: boolean;
  country: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'WK-Batsman';
  team: string;
  teams: string[];
  captain: boolean;
  leftHanded: boolean;
  paceBowler: boolean;
  spinBowler: boolean;
  debutBefore2018: boolean;
  hasOrangeCap: boolean;
  hasPurpleCap: boolean;
  worldCupPlayed: boolean;
  finisher: boolean;
  powerplaySpecialist: boolean;
  deathOversSpecialist: boolean;
  century: boolean;
  fiveWickets: boolean;
  tags: string[];
}

const PlayerSchema = new Schema<IPlayer>({
  name:                  { type: String, required: true },
  type:                  { type: String, enum: ['player', 'team', 'moment'], default: 'player' },
  active:                { type: Boolean, default: true },
  country:               { type: String, required: true },
  role:                  { type: String, enum: ['Batsman', 'Bowler', 'All-rounder', 'WK-Batsman'] },
  team:                  { type: String },
  teams:                 [{ type: String }],
  captain:               { type: Boolean, default: false },
  leftHanded:            { type: Boolean, default: false },
  paceBowler:            { type: Boolean, default: false },
  spinBowler:            { type: Boolean, default: false },
  debutBefore2018:       { type: Boolean, default: false },
  hasOrangeCap:          { type: Boolean, default: false },
  hasPurpleCap:          { type: Boolean, default: false },
  worldCupPlayed:        { type: Boolean, default: false },
  finisher:              { type: Boolean, default: false },
  powerplaySpecialist:   { type: Boolean, default: false },
  deathOversSpecialist:  { type: Boolean, default: false },
  century:               { type: Boolean, default: false },
  fiveWickets:           { type: Boolean, default: false },
  tags:                  [{ type: String }],
});

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
