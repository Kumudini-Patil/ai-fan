// AI Insight Types for Premium Fantasy Cricket Assistant

export interface AIPlayerInsight {
  playerId: string;
  playerName: string;
  team: string;
  role: PlayerRole;

  // AI Analysis Scores
  aiScore: number;
  aiConfidence: number; // 0-100%
  riskLevel: 'low' | 'medium' | 'high';

  // Performance Metrics
  recentForm: number; // 0-100
  venuePerformance: number; // 0-100
  matchupAdvantage: number; // 0-100
  consistency: number; // 0-100

  // Selection Reasons
  primaryReason: string;
  detailedExplanation: string;
  keyFactors: string[];

  // Special Tags
  isDifferentialPick: boolean;
  differentialPercentage?: number;
  isHiddenGem: boolean;
  isRisky: boolean;

  // Matchup Data
  opponentWeakness?: string;
  historicalRecord?: string;
  weatherImpact?: 'positive' | 'neutral' | 'negative';
  tossImpact?: 'positive' | 'neutral' | 'negative';

  // Captain/Vice-Captain
  captainPotential: number; // 0-100
  viceCaptainPotential: number; // 0-100

  // Fantasy Points
  predictedPoints: number;
  averagePoints: number;
  lastMatchPoints?: number;
}

export type PlayerRole = 'wicketkeeper' | 'batsman' | 'all-rounder' | 'bowler';

export interface AITeamGenerated {
  teamId: string;
  teamType: 'safe' | 'balanced' | 'grand-league';

  players: AIPlayerInsight[];
  captain: AIPlayerInsight;
  viceCaptain: AIPlayerInsight;

  // Team Analysis
  totalAIConfidence: number;
  riskScore: number; // 0-100
  predictedScore: number;

  // Team Composition
  composition: {
    wicketkeepers: number;
    batsmen: number;
    allRounders: number;
    bowlers: number;
  };

  // Team Split
  teamSplit: {
    [teamName: string]: number;
  };

  // Key Insights
  strengths: string[];
  weaknesses: string[];
  differentialPicks: AIPlayerInsight[];
  safePicks: AIPlayerInsight[];
  riskyPicks: AIPlayerInsight[];

  // Match Context
  matchConditions: MatchConditions;
  generationTimestamp: string;
}

export interface MatchConditions {
  venue: string;
  pitchType: string;
  weather: string;
  tossWinner?: string;
  tossDecision?: string;
  dewFactor: number;
  dayNight: boolean;
}

export interface MatchAIAnalysis {
  matchId: string;
  team1: string;
  team2: string;

  // Predictions
  winProbability: {
    team1: number;
    team2: number;
  };
  predictedScore: {
    firstInnings: { min: number; max: number; likely: number };
    secondInnings: { min: number; max: number; likely: number };
  };

  // Pitch Report
  pitchAnalysis: PitchAnalysis;

  // Weather Impact
  weatherImpact: WeatherImpact;

  // Toss Analysis
  tossAnalysis: TossAnalysis;

  // Key Insights
  keyFactors: string[];
  captainFavorites: AIPlayerInsight[];
  differentialPicks: AIPlayerInsight[];
  riskyPicks: AIPlayerInsight[];
  hiddenGems: AIPlayerInsight[];

  // Fantasy Tips
  fantasyTips: string[];
  avoidPlayers: string[];
  mustHavePlayers: string[];
}

export interface PitchAnalysis {
  pitchType: 'spin-friendly' | 'pace-friendly' | 'batting-friendly' | 'balanced';
  spinFactor: number; // 0-1
  paceFactor: number; // 0-1
  boundarySize: 'small' | 'medium' | 'large';
  averageFirstInnings: number;
  chasingRecord: string;
  detailedAnalysis: string;
}

export interface WeatherImpact {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  dewExpected: boolean;
  impactOnSpin: 'positive' | 'neutral' | 'negative';
  impactOnPace: 'positive' | 'neutral' | 'negative';
  overallImpact: string;
}

export interface TossAnalysis {
  importance: 'high' | 'medium' | 'low';
  preferredDecision: 'bat' | 'bowl';
  reason: string;
  historicalTossRecord: string;
  chasingRecordAtVenue: string;
}

export interface AIChatResponse {
  response: string;
  confidence: number;
  relatedInsights?: string[];
  suggestedActions?: string[];
  playerMentions?: string[];
}

export interface TrendingPlayer {
  player: AIPlayerInsight;
  trend: 'rising' | 'falling' | 'stable';
  changePercentage: number;
  reason: string;
}

export interface FantasyTip {
  type: 'strategy' | 'captain' | 'differential' | 'safe' | 'risky';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  playerSuggestion?: string;
}

export interface MatchBanner {
  matchId: string;
  team1: TeamInfo;
  team2: TeamInfo;
  matchDate: string;
  venue: string;
  matchType: string;
  status: 'upcoming' | 'live' | 'completed';
  aiRecommendation: string;
  fantasyDeadline: string;
}

export interface TeamInfo {
  name: string;
  shortName: string;
  logo?: string;
  form: string; // W-L-W-L-W
  keyPlayers: string[];
  strengths: string[];
  weaknesses: string[];
}
