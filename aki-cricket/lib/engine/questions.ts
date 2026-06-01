export interface Question {
  id: string;
  text: string;
  attribute: string;
  expectedValue?: string; // For string comparisons (country, team, etc.)
  category: 'role' | 'country' | 'batting' | 'bowling' | 'career' | 'team' | 'profile';
  /** Questions invalidated when this gets a certain answer */
  invalidates?: { answer: 'yes' | 'no'; questionIds: string[] };
}

export const QUESTION_BANK: Question[] = [
  // --- ROLE (eliminates ~50% each) ---
  { id: "q_batsman", attribute: "isBatsman", text: "Is this player primarily known as a batsman?", category: "role",
    invalidates: { answer: 'yes', questionIds: ["q_bowler", "q_allrounder", "q_wk", "q_fast", "q_spin", "q_leftarm", "q_fifer", "q_purple", "q_eco8", "q_medium"] } },
  { id: "q_bowler", attribute: "isBowler", text: "Is this player primarily a bowler?", category: "role",
    invalidates: { answer: 'yes', questionIds: ["q_batsman", "q_allrounder", "q_wk", "q_orange", "q_100s", "q_finisher", "q_opener", "q_anchor", "q_sr140"] } },
  { id: "q_allrounder", attribute: "isAllrounder", text: "Does this player both bat and bowl significantly?", category: "role",
    invalidates: { answer: 'yes', questionIds: ["q_batsman", "q_bowler", "q_wk"] } },
  { id: "q_wk", attribute: "isWicketkeeper", text: "Is this player a wicketkeeper?", category: "role",
    invalidates: { answer: 'yes', questionIds: ["q_batsman", "q_bowler", "q_allrounder", "q_fast", "q_spin", "q_leftarm", "q_fifer", "q_purple"] } },

  // --- NATIONALITY ---
  { id: "q_indian", attribute: "isIndian", text: "Is this player from India?", category: "country" },
  { id: "q_aus", attribute: "country", expectedValue: "Australia", text: "Is this player from Australia?", category: "country" },
  { id: "q_sa", attribute: "country", expectedValue: "South Africa", text: "Is this player from South Africa?", category: "country" },
  { id: "q_wi", attribute: "country", expectedValue: "West Indies", text: "Is this player from the West Indies?", category: "country" },
  { id: "q_eng", attribute: "country", expectedValue: "England", text: "Is this player from England?", category: "country" },
  { id: "q_afg", attribute: "country", expectedValue: "Afghanistan", text: "Is this player from Afghanistan?", category: "country" },
  { id: "q_nz", attribute: "country", expectedValue: "New Zealand", text: "Is this player from New Zealand?", category: "country" },
  { id: "q_sl", attribute: "country", expectedValue: "Sri Lanka", text: "Is this player from Sri Lanka?", category: "country" },

  // --- BATTING STYLE ---
  { id: "q_left", attribute: "leftHanded", text: "Does this player bat left-handed?", category: "batting" },
  { id: "q_opener", attribute: "isOpener", text: "Does this player open the batting?", category: "batting" },
  { id: "q_finisher", attribute: "isFinisher", text: "Is this player known as a death-over finisher?", category: "batting" },
  { id: "q_anchor", attribute: "isAnchor", text: "Is this player a middle-order anchor?", category: "batting" },
  { id: "q_sr140", attribute: "strikeRateAbove140", text: "Does this player have an IPL strike rate above 140?", category: "batting" },
  { id: "q_100s", attribute: "has100s", text: "Has this player scored a century in IPL?", category: "batting" },
  { id: "q_50s", attribute: "has50s", text: "Has this player scored fifties in IPL?", category: "batting" },

  // --- BOWLING STYLE ---
  { id: "q_fast", attribute: "isFastBowler", text: "Is this player a fast bowler?", category: "bowling" },
  { id: "q_spin", attribute: "isSpinner", text: "Is this player a spinner?", category: "bowling" },
  { id: "q_medium", attribute: "isMediumPacer", text: "Is this player a medium pacer?", category: "bowling" },
  { id: "q_leftarm", attribute: "isLeftArmBowler", text: "Does this player bowl with the left arm?", category: "bowling" },
  { id: "q_fifer", attribute: "hasFifer", text: "Has this player taken 5 wickets in an IPL match?", category: "bowling" },
  { id: "q_eco8", attribute: "economyBelow8", text: "Does this player have an IPL economy rate below 8?", category: "bowling" },

  // --- IPL CAREER ---
  { id: "q_captain", attribute: "isCaptain", text: "Is this player currently an IPL captain?", category: "career" },
  { id: "q_evercaptain", attribute: "captainedTeam", text: "Has this player ever captained an IPL team?", category: "career" },
  { id: "q_wonIPL", attribute: "hasWonIPL", text: "Has this player won the IPL title?", category: "career" },
  { id: "q_orange", attribute: "hasOrangeCap", text: "Has this player won an Orange Cap?", category: "career" },
  { id: "q_purple", attribute: "hasPurpleCap", text: "Has this player won a Purple Cap?", category: "career" },
  { id: "q_icon", attribute: "isIcon", text: "Is this player considered a franchise icon?", category: "career" },
  { id: "q_mvp", attribute: "isMVP", text: "Has this player won an IPL MVP award?", category: "career" },

  // --- TEAM (current season) ---
  { id: "q_mi", attribute: "currentTeam", expectedValue: "Mumbai Indians", text: "Does this player play for Mumbai Indians?", category: "team" },
  { id: "q_csk", attribute: "currentTeam", expectedValue: "Chennai Super Kings", text: "Does this player play for Chennai Super Kings?", category: "team" },
  { id: "q_rcb", attribute: "currentTeam", expectedValue: "Royal Challengers Bengaluru", text: "Does this player play for RCB?", category: "team" },
  { id: "q_kkr", attribute: "currentTeam", expectedValue: "Kolkata Knight Riders", text: "Does this player play for KKR?", category: "team" },
  { id: "q_dc", attribute: "currentTeam", expectedValue: "Delhi Capitals", text: "Does this player play for Delhi Capitals?", category: "team" },
  { id: "q_rr", attribute: "currentTeam", expectedValue: "Rajasthan Royals", text: "Does this player play for Rajasthan Royals?", category: "team" },
  { id: "q_srh", attribute: "currentTeam", expectedValue: "Sunrisers Hyderabad", text: "Does this player play for Sunrisers Hyderabad?", category: "team" },
  { id: "q_pbks", attribute: "currentTeam", expectedValue: "Punjab Kings", text: "Does this player play for Punjab Kings?", category: "team" },
  { id: "q_gt", attribute: "currentTeam", expectedValue: "Gujarat Titans", text: "Does this player play for Gujarat Titans?", category: "team" },
  { id: "q_lsg", attribute: "currentTeam", expectedValue: "Lucknow Super Giants", text: "Does this player play for Lucknow Super Giants?", category: "team" },

  // --- PROFILE ---
  { id: "q_u25", attribute: "ageGroup", expectedValue: "u25", text: "Is this player under 25 years old?", category: "profile" },
  { id: "q_35plus", attribute: "ageGroup", expectedValue: "35+", text: "Is this player 35 years or older?", category: "profile" },
  { id: "q_worldcup", attribute: "hasPlayedWorldCup", text: "Has this player played in an ICC World Cup?", category: "profile" },
  { id: "q_legend", attribute: "tier", expectedValue: "legend", text: "Is this player considered a legendary IPL figure?", category: "profile" },
  { id: "q_active", attribute: "active", text: "Is this player currently active in IPL?", category: "profile" },
  { id: "q_retired", attribute: "isRetired", text: "Has this player retired from cricket?", category: "profile" },
];
