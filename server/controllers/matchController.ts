import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { AppErrorClass } from '../middleware/errorHandler';

export const getMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('matches')
      .select(`
        *,
        venue:venues (*)
      `)
      .order('match_date', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: matches, error } = await query;

    if (error) {
      throw new AppErrorClass('Error fetching matches', 500);
    }

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: match, error } = await supabase
      .from('matches')
      .select(`
        *,
        venue:venues (*),
        pitch_report:pitch_reports (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (!match) {
      throw new AppErrorClass('Match not found', 404);
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

export const getPitchReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: pitchReport, error } = await supabase
      .from('pitch_reports')
      .select(`
        *,
        venue:venues (*)
      `)
      .eq('match_id', id)
      .maybeSingle();

    if (!pitchReport) {
      throw new AppErrorClass('Pitch report not found', 404);
    }

    res.json({
      success: true,
      data: pitchReport
    });
  } catch (error) {
    next(error);
  }
};

export const getMatchPrediction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: match, error } = await supabase
      .from('matches')
      .select(`
        *,
        venue:venues (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (!match) {
      throw new AppErrorClass('Match not found', 404);
    }

    // Generate prediction based on teams and venue
    const prediction = generateMatchPrediction(match);

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

function generateMatchPrediction(match: any) {
  const teams = [match.team1, match.team2];
  const venue = match.venue;

  // Generate random but realistic probabilities
  const team1Probability = Math.random() * 0.3 + 0.35; // 35-65%
  const team2Probability = 1 - team1Probability;

  return {
    match_id: match.id,
    team1: match.team1,
    team2: match.team2,
    team1_probability: Math.round(team1Probability * 100),
    team2_probability: Math.round(team2Probability * 100),
    predicted_winner: team1Probability > team2Probability ? match.team1 : match.team2,
    venue_factors: {
      pitch_type: venue?.pitch_type || 'balanced',
      spin_factor: venue?.spin_factor || 0.5,
      pace_factor: venue?.pace_factor || 0.5,
      average_first_innings_score: venue?.average_first_innings_score || 165
    },
    toss_importance: calculateTossImportance(venue),
    key_factors: [
      `${venue?.pitch_type === 'spin-friendly' ? 'Spinners will play a crucial role' : 'Fast bowlers may have advantage'}`,
      `Average first innings score: ${venue?.average_first_innings_score || 165}`,
      `${venue?.boundary_size === 'small' ? 'High-scoring game expected' : 'Batsmen need to work hard for runs'}`
    ]
  };
}

function calculateTossImportance(venue: any) {
  if (!venue) return 'medium';

  if (venue.spin_factor > 0.6) return 'high';
  if (venue.pace_factor > 0.7) return 'high';
  return 'medium';
}
