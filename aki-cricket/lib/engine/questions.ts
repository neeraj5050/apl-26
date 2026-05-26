export interface PlayerAttributes {
  active: boolean;
  country: string;
  role: string;
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
}

export interface Question {
  id: string;
  text: string;
  attribute: keyof PlayerAttributes;
  expectedTrue: string;
  /** Questions that become irrelevant if THIS question gets a certain answer */
  invalidates?: { answer: 'yes' | 'no'; questionIds: string[] };
}

export const QUESTION_BANK: Question[] = [
  // --- Nationality ---
  { id: "q_indian", text: "Does your player represent India internationally?", attribute: "country", expectedTrue: "India",
    invalidates: { answer: 'no', questionIds: [] } },

  // --- Role (these are mutually exclusive, so each invalidates the others) ---
  { id: "q_batsman", text: "Is your player primarily a batsman (not all-rounder or keeper)?", attribute: "role", expectedTrue: "Batsman",
    invalidates: { answer: 'yes', questionIds: ["q_bowler", "q_allrounder", "q_wk", "q_pace", "q_spin", "q_5w", "q_death", "q_purple"] } },
  { id: "q_bowler", text: "Is your player primarily a bowler?", attribute: "role", expectedTrue: "Bowler",
    invalidates: { answer: 'yes', questionIds: ["q_batsman", "q_allrounder", "q_wk", "q_orange", "q_century", "q_finisher"] } },
  { id: "q_allrounder", text: "Is your player an all-rounder (bats and bowls)?", attribute: "role", expectedTrue: "All-rounder",
    invalidates: { answer: 'yes', questionIds: ["q_batsman", "q_bowler", "q_wk"] } },
  { id: "q_wk", text: "Is this player a wicketkeeper-batsman?", attribute: "role", expectedTrue: "WK-Batsman",
    invalidates: { answer: 'yes', questionIds: ["q_batsman", "q_bowler", "q_allrounder", "q_pace", "q_spin", "q_5w", "q_purple"] } },

  // --- Playing Style ---
  { id: "q_left", text: "Is this player left-handed?", attribute: "leftHanded", expectedTrue: "true" },
  { id: "q_captain", text: "Has this player ever captained an IPL team?", attribute: "captain", expectedTrue: "true" },
  { id: "q_pace", text: "Is this player a pace bowler?", attribute: "paceBowler", expectedTrue: "true" },
  { id: "q_spin", text: "Is this player a spin bowler?", attribute: "spinBowler", expectedTrue: "true" },

  // --- Teams (covering all 10 IPL teams) ---
  { id: "q_mi", text: "Has this player played for Mumbai Indians?", attribute: "teams", expectedTrue: "Mumbai Indians" },
  { id: "q_csk", text: "Is this player associated with Chennai Super Kings?", attribute: "teams", expectedTrue: "Chennai Super Kings" },
  { id: "q_rcb", text: "Has this player played for Royal Challengers Bengaluru?", attribute: "teams", expectedTrue: "Royal Challengers Bengaluru" },
  { id: "q_kkr", text: "Has this player played for Kolkata Knight Riders?", attribute: "teams", expectedTrue: "Kolkata Knight Riders" },
  { id: "q_srh", text: "Has this player played for Sunrisers Hyderabad?", attribute: "teams", expectedTrue: "Sunrisers Hyderabad" },
  { id: "q_rr", text: "Has this player played for Rajasthan Royals?", attribute: "teams", expectedTrue: "Rajasthan Royals" },
  { id: "q_dc", text: "Has this player played for Delhi Capitals or Delhi Daredevils?", attribute: "teams", expectedTrue: "Delhi Capitals" },
  { id: "q_gt", text: "Has this player played for Gujarat Titans?", attribute: "teams", expectedTrue: "Gujarat Titans" },
  { id: "q_lsg", text: "Has this player played for Lucknow Super Giants?", attribute: "teams", expectedTrue: "Lucknow Super Giants" },
  { id: "q_pbks", text: "Has this player played for Punjab Kings?", attribute: "teams", expectedTrue: "Punjab Kings" },

  // --- Achievements ---
  { id: "q_orange", text: "Has this player won the Orange Cap?", attribute: "hasOrangeCap", expectedTrue: "true" },
  { id: "q_purple", text: "Has this player won the Purple Cap?", attribute: "hasPurpleCap", expectedTrue: "true" },
  { id: "q_century", text: "Has this player scored a century in IPL?", attribute: "century", expectedTrue: "true" },
  { id: "q_5w", text: "Has this player taken a five-wicket haul in IPL?", attribute: "fiveWickets", expectedTrue: "true" },
  { id: "q_worldcup", text: "Has this player played in a Cricket World Cup?", attribute: "worldCupPlayed", expectedTrue: "true" },

  // --- Specialization ---
  { id: "q_finisher", text: "Is this player famous for finishing matches?", attribute: "finisher", expectedTrue: "true" },
  { id: "q_powerplay", text: "Is this player a powerplay specialist?", attribute: "powerplaySpecialist", expectedTrue: "true" },
  { id: "q_death", text: "Is this player a death-overs specialist?", attribute: "deathOversSpecialist", expectedTrue: "true" },

  // --- Era ---
  { id: "q_active", text: "Is your player currently active in IPL?", attribute: "active", expectedTrue: "true" },
  { id: "q_debut", text: "Did this player debut in IPL before 2018?", attribute: "debutBefore2018", expectedTrue: "true" },
];
