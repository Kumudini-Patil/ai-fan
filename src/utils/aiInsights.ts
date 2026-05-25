import { AIPlayerInsight, PlayerRole, MatchConditions, PitchAnalysis } from '../types/index';

// Generate detailed AI explanation for a player
export function generatePlayerExplanation(
  player: any,
  venueStats: any,
  pitchAnalysis: PitchAnalysis | null,
  matchConditions: MatchConditions | null
): AIPlayerInsight {
  const recentForm = calculateRecentForm(player.recent_fantasy_scores);
  const venuePerformance = calculateVenuePerformance(venueStats);
  const matchupAdvantage = calculateMatchupAdvantage(player, pitchAnalysis);
  const consistency = calculateConsistency(player.recent_fantasy_scores);

  // Calculate primary selection reason
  const primaryReason = determinePrimaryReason(recentForm, venuePerformance, matchupAdvantage, consistency);

  // Generate detailed explanation
  const detailedExplanation = generateDetailedExplanation(
    player,
    recentForm,
    venuePerformance,
    matchupAdvantage,
    consistency,
    pitchAnalysis,
    matchConditions
  );

  // Determine risk level
  const riskLevel = determineRiskLevel(recentForm, consistency, venuePerformance);

  // Check if differential pick
  const isDifferentialPick = checkDifferentialPick(player, matchConditions);
  const isHiddenGem = checkHiddenGem(player, recentForm, venuePerformance);

  return {
    playerId: player.id,
    playerName: player.name,
    team: player.team,
    role: player.role as PlayerRole,

    aiScore: (player.ai_score || 0),
    aiConfidence: calculateAIConfidence(recentForm, venuePerformance, consistency),
    riskLevel,

    recentForm,
    venuePerformance,
    matchupAdvantage,
    consistency,

    primaryReason,
    detailedExplanation,
    keyFactors: generateKeyFactors(player, recentForm, venuePerformance, pitchAnalysis),

    isDifferentialPick,
    differentialPercentage: isDifferentialPick ? Math.floor(Math.random() * 15) + 5 : undefined,
    isHiddenGem,
    isRisky: riskLevel === 'high',

    opponentWeakness: identifyOpponentWeakness(player, pitchAnalysis),
    historicalRecord: generateHistoricalRecord(player, venueStats),
    weatherImpact: assessWeatherImpact(player, matchConditions),
    tossImpact: assessTossImpact(player, matchConditions),

    captainPotential: calculateCaptainPotential(player, recentForm, consistency),
    viceCaptainPotential: calculateViceCaptainPotential(player, recentForm, venuePerformance),

    predictedPoints: predictFantasyPoints(player, recentForm, venuePerformance, pitchAnalysis),
    averagePoints: player.fantasy_average || 0,
    lastMatchPoints: player.recent_fantasy_scores?.[0] || undefined
  };
}

// Calculate recent form score (0-100)
function calculateRecentForm(scores: number[] | undefined): number {
  if (!scores || scores.length === 0) return 50;

  const recent = scores.slice(0, 5);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

  // Normalize based on typical fantasy scores (0-150 range)
  return Math.min(100, Math.max(0, (avg / 70) * 100));
}

// Calculate venue performance (0-100)
function calculateVenuePerformance(venueStats: any): number {
  if (!venueStats) return 50;

  let score = 50;

  if (venueStats.fantasy_average) {
    score = (venueStats.fantasy_average / 70) * 100;
  }

  if (venueStats.batting_average && venueStats.batting_average > 40) {
    score += 10;
  }

  if (venueStats.bowling_average && venueStats.bowling_average > 0 && venueStats.bowling_average < 25) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

// Calculate matchup advantage (0-100)
function calculateMatchupAdvantage(player: any, pitchAnalysis: PitchAnalysis | null): number {
  let advantage = 50;

  if (!pitchAnalysis) return advantage;

  // Check player type vs pitch
  if (player.role === 'bowler') {
    if (player.bowling_style?.toLowerCase().includes('spin')) {
      advantage = pitchAnalysis.spinFactor * 100;
    } else {
      advantage = pitchAnalysis.paceFactor * 100;
    }
  } else if (player.role === 'batsman' || player.role === 'wicketkeeper') {
    advantage = pitchAnalysis.pitchType === 'batting-friendly' ? 80 :
                pitchAnalysis.pitchType === 'balanced' ? 60 : 45;
  } else if (player.role === 'all-rounder') {
    advantage = 60 + (Math.max(pitchAnalysis.spinFactor, pitchAnalysis.paceFactor) * 20);
  }

  return Math.min(100, Math.max(0, advantage));
}

// Calculate consistency score (0-100)
function calculateConsistency(scores: number[] | undefined): number {
  if (!scores || scores.length < 3) return 50;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Lower standard deviation = higher consistency
  const consistencyScore = Math.max(0, 100 - stdDev);

  return Math.min(100, consistencyScore);
}

// Determine primary reason for selection
function determinePrimaryReason(
  recentForm: number,
  venuePerformance: number,
  matchupAdvantage: number,
  consistency: number
): string {
  const reasons = [];

  if (recentForm >= 75) reasons.push({ reason: 'outstanding form', weight: recentForm });
  if (venuePerformance >= 75) reasons.push({ reason: 'excellent venue record', weight: venuePerformance });
  if (matchupAdvantage >= 75) reasons.push({ reason: 'favorable matchup', weight: matchupAdvantage });
  if (consistency >= 70) reasons.push({ reason: 'highly consistent', weight: consistency });

  if (reasons.length === 0) {
    if (recentForm >= 60) return 'Solid recent performances';
    if (venuePerformance >= 60) return 'Good track record at this venue';
    if (matchupAdvantage >= 60) return 'Favorable conditions';
    return 'Balanced selection based on overall metrics';
  }

  // Return the top reason
  reasons.sort((a, b) => b.weight - a.weight);
  return reasons[0].reason.charAt(0).toUpperCase() + reasons[0].reason.slice(1);
}

// Generate detailed explanation
function generateDetailedExplanation(
  player: any,
  recentForm: number,
  venuePerformance: number,
  matchupAdvantage: number,
  consistency: number,
  pitchAnalysis: PitchAnalysis | null,
  matchConditions: MatchConditions | null
): string {
  const parts: string[] = [];

  // Player intro
  parts.push(`${player.name} has been selected for this fantasy XI.`);

  // Recent form
  if (recentForm >= 75) {
    parts.push(`The player is in excellent form, averaging strong fantasy performances in recent matches.`);
  } else if (recentForm >= 60) {
    parts.push(`Recent form has been good with consistent contributions.`);
  }

  // Venue record
  if (venuePerformance >= 70) {
    parts.push(`Historically, this player performs exceptionally well at ${matchConditions?.venue || 'this venue'}, making it a smart venue-specific pick.`);
  }

  // Match conditions
  if (pitchAnalysis && matchupAdvantage >= 65) {
    if (player.role === 'bowler') {
      if (pitchAnalysis.spinFactor > 0.6) {
        parts.push(`The spin-friendly pitch conditions favor this bowler's style.`);
      } else if (pitchAnalysis.paceFactor > 0.6) {
        parts.push(`The pace-friendly surface suits this bowler perfectly.`);
      }
    } else if (player.role === 'batsman') {
      if (pitchAnalysis.pitchType === 'batting-friendly') {
        parts.push(`The batting-friendly conditions make this an ideal stage for the batsman.`);
      }
    }
  }

  // Weather considerations
  if (matchConditions?.dewFactor && matchConditions.dewFactor > 0.5) {
    if (player.role === 'bowler' && player.bowling_style?.includes('spin')) {
      parts.push(`Note: Dew might affect grip for spinners in the second innings.`);
    }
  }

  // Toss impact
  if (matchConditions?.tossDecision && player.role === 'batsman') {
    if (matchConditions.tossDecision === 'bat') {
      parts.push(`With the toss winner choosing to bat first, batsmen will have the best conditions.`);
    }
  }

  return parts.join(' ');
}

// Generate key factors list
function generateKeyFactors(
  player: any,
  recentForm: number,
  venuePerformance: number,
  pitchAnalysis: PitchAnalysis | null
): string[] {
  const factors: string[] = [];

  if (recentForm >= 65) factors.push('Strong recent form');
  if (venuePerformance >= 65) factors.push('Excellent venue record');
  if (player.role === 'all-rounder') factors.push('Dual contribution potential');
  if (player.role === 'wicketkeeper' && player.team === player.team) {
    factors.push('Top-order batting position');
  }

  if (pitchAnalysis) {
    if (player.bowling_style?.includes('spin') && pitchAnalysis.spinFactor > 0.6) {
      factors.push('Pitch favors spin bowling');
    }
    if (player.bowling_style?.includes('pace') && pitchAnalysis.paceFactor > 0.6) {
      factors.push('Pace-friendly conditions');
    }
  }

  return factors.length > 0 ? factors : ['Solid overall metrics'];
}

// Determine risk level
function determineRiskLevel(recentForm: number, consistency: number, venuePerformance: number): 'low' | 'medium' | 'high' {
  const avgScore = (recentForm + consistency + venuePerformance) / 3;

  if (avgScore >= 70 && consistency >= 60) return 'low';
  if (avgScore >= 50) return 'medium';
  return 'high';
}

// Check if player is a differential pick
function checkDifferentialPick(player: any, matchConditions: MatchConditions | null): boolean {
  // A player is a differential if:
  // - They are in good form but not the most popular choice
  // - They have favorable conditions but are undervalued
  const recentScores = player.recent_fantasy_scores || [];
  if (recentScores.length < 3) return false;

  const avgScore = recentScores.slice(0, 3).reduce((a: number, b: number) => a + b, 0) / 3;

  // Good but not top performer = differential potential
  return avgScore > 40 && avgScore < 80;
}

// Check for hidden gem
function checkHiddenGem(player: any, recentForm: number, venuePerformance: number): boolean {
  // Hidden gem: Good venue record but average recent form
  return venuePerformance > 70 && recentForm < 70;
}

// Calculate AI confidence
function calculateAIConfidence(recentForm: number, venuePerformance: number, consistency: number): number {
  return Math.round((recentForm * 0.35 + venuePerformance * 0.35 + consistency * 0.3));
}

// Identify opponent weakness
function identifyOpponentWeakness(player: any, pitchAnalysis: PitchAnalysis | null): string | undefined {
  if (!pitchAnalysis) return undefined;

  if (player.role === 'bowler') {
    if (pitchAnalysis.spinFactor > 0.6) {
      return 'Opponents struggle against quality spin on turning tracks';
    }
    if (pitchAnalysis.paceFactor > 0.6) {
      return 'Batting lineup vulnerable to pace and bounce';
    }
  }

  if (player.role === 'batsman') {
    if (pitchAnalysis.pitchType === 'batting-friendly') {
      return 'Attack has been expensive in death overs';
    }
  }

  return undefined;
}

// Generate historical record
function generateHistoricalRecord(player: any, venueStats: any): string | undefined {
  if (!venueStats) return undefined;

  if (player.role === 'batsman' || player.role === 'wicketkeeper' || player.role === 'all-rounder') {
    if (venueStats.batting_average) {
      return `Averages ${venueStats.batting_average.toFixed(1)} runs at this venue`;
    }
  }

  if (player.role === 'bowler' || player.role === 'all-rounder') {
    if (venueStats.bowling_average && venueStats.bowling_average > 0) {
      return `${venueStats.wickets_taken || 'Multiple'} wickets at avg ${venueStats.bowling_average.toFixed(1)}`;
    }
  }

  return undefined;
}

// Assess weather impact
function assessWeatherImpact(player: any, matchConditions: MatchConditions | null): 'positive' | 'neutral' | 'negative' | undefined {
  if (!matchConditions) return undefined;

  if (player.role === 'bowler') {
    if (matchConditions.dewFactor > 0.6 && player.bowling_style?.includes('spin')) {
      return 'negative'; // Dew affects spinners
    }
  }

  return 'neutral';
}

// Assess toss impact
function assessTossImpact(player: any, matchConditions: MatchConditions | null): 'positive' | 'neutral' | 'negative' | undefined {
  if (!matchConditions || !matchConditions.tossDecision) return undefined;

  if (matchConditions.tossDecision === 'bat') {
    if (player.role === 'batsman' || player.role === 'wicketkeeper') {
      return 'positive';
    }
  }

  return 'neutral';
}

// Calculate captain potential
function calculateCaptainPotential(player: any, recentForm: number, consistency: number): number {
  if (player.role === 'all-rounder') {
    return Math.min(100, (recentForm + consistency) / 2 + 15); // Bonus for all-rounders
  }
  return Math.min(100, (recentForm + consistency) / 2);
}

// Calculate vice-captain potential
function calculateViceCaptainPotential(player: any, recentForm: number, venuePerformance: number): number {
  return Math.min(100, (recentForm + venuePerformance) / 2);
}

// Predict fantasy points
function predictFantasyPoints(
  player: any,
  recentForm: number,
  venuePerformance: number,
  pitchAnalysis: PitchAnalysis | null
): number {
  const basePrediction = (recentForm + venuePerformance) / 2 * 0.7;

  let multiplier = 1;
  if (pitchAnalysis && player.role === 'all-rounder') {
    multiplier = 1.2;
  }

  return Math.round(basePrediction * multiplier);
}

export default {
  generatePlayerExplanation,
  calculateRecentForm,
  calculateVenuePerformance,
  calculateMatchupAdvantage,
  calculateConsistency
};
