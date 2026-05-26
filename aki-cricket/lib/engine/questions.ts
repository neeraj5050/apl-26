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
}

export const QUESTION_BANK: Question[] = [
  { id: "q_active",       text: "Is your player currently active in IPL?",                attribute: "active",                expectedTrue: "true" },
  { id: "q_indian",       text: "Does your player represent India internationally?",      attribute: "country",               expectedTrue: "India" },
  { id: "q_batsman",      text: "Is your player primarily a batsman?",                    attribute: "role",                  expectedTrue: "Batsman" },
  { id: "q_bowler",       text: "Is your player primarily a bowler?",                     attribute: "role",                  expectedTrue: "Bowler" },
  { id: "q_allrounder",   text: "Is your player an all-rounder?",                         attribute: "role",                  expectedTrue: "All-rounder" },
  { id: "q_captain",      text: "Has this player ever captained an IPL team?",            attribute: "captain",               expectedTrue: "true" },
  { id: "q_wk",           text: "Is this player a wicketkeeper?",                         attribute: "role",                  expectedTrue: "WK-Batsman" },
  { id: "q_left",         text: "Is this player left-handed?",                            attribute: "leftHanded",            expectedTrue: "true" },
  { id: "q_mi",           text: "Has this player played for Mumbai Indians?",             attribute: "teams",                 expectedTrue: "Mumbai Indians" },
  { id: "q_csk",          text: "Is this player associated with Chennai Super Kings?",    attribute: "teams",                 expectedTrue: "Chennai Super Kings" },
  { id: "q_rcb",          text: "Has this player played for Royal Challengers Bengaluru?", attribute: "teams",                expectedTrue: "Royal Challengers Bengaluru" },
  { id: "q_kkr",          text: "Has this player played for Kolkata Knight Riders?",      attribute: "teams",                 expectedTrue: "Kolkata Knight Riders" },
  { id: "q_pace",         text: "Is this player a pace bowler?",                          attribute: "paceBowler",            expectedTrue: "true" },
  { id: "q_spin",         text: "Is this player a spin bowler?",                          attribute: "spinBowler",            expectedTrue: "true" },
  { id: "q_orange",       text: "Has this player won the Orange Cap?",                    attribute: "hasOrangeCap",          expectedTrue: "true" },
  { id: "q_purple",       text: "Has this player won the Purple Cap?",                    attribute: "hasPurpleCap",          expectedTrue: "true" },
  { id: "q_finisher",     text: "Is this player famous for finishing matches?",           attribute: "finisher",              expectedTrue: "true" },
  { id: "q_death",        text: "Is this player a death-overs specialist?",               attribute: "deathOversSpecialist",  expectedTrue: "true" },
  { id: "q_debut",        text: "Did this player debut in IPL before 2018?",              attribute: "debutBefore2018",       expectedTrue: "true" },
  { id: "q_century",      text: "Has this player scored a century in IPL?",               attribute: "century",               expectedTrue: "true" },
  { id: "q_5w",           text: "Has this player taken a five-wicket haul in IPL?",       attribute: "fiveWickets",           expectedTrue: "true" },
  { id: "q_worldcup",     text: "Has this player played in a Cricket World Cup?",         attribute: "worldCupPlayed",        expectedTrue: "true" },
  { id: "q_powerplay",    text: "Is this player a powerplay specialist?",                 attribute: "powerplaySpecialist",   expectedTrue: "true" },
  { id: "q_foreign",      text: "Is this player an overseas (non-Indian) player?",        attribute: "country",               expectedTrue: "!India" },
];
