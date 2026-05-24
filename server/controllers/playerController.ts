import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { AppErrorClass } from '../middleware/errorHandler';

export const getPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { team, role, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('players')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (team) {
      query = query.eq('team', team);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data: players, error } = await query;

    if (error) {
      throw new AppErrorClass('Error fetching players', 500);
    }

    res.json({
      success: true,
      count: players?.length || 0,
      data: players
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!player) {
      throw new AppErrorClass('Player not found', 404);
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayerStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { venue_id } = req.query;

    let query = supabase
      .from('player_stats')
      .select(`
        *,
        player:players (*),
        venue:venues (*)
      `)
      .eq('player_id', id);

    if (venue_id) {
      query = query.eq('venue_id', venue_id);
    }

    const { data: stats, error } = await query.maybeSingle();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayerForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const { data: fantasyScores, error } = await supabase
      .from('fantasy_scores')
      .select(`
        *,
        match:matches (*)
      `)
      .eq('player_id', id)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (error) {
      throw new AppErrorClass('Error fetching player form', 500);
    }

    // Calculate form metrics
    const formMetrics = calculateFormMetrics(fantasyScores || []);

    res.json({
      success: true,
      data: {
        fantasy_scores: fantasyScores,
        metrics: formMetrics
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayersByMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (!match) {
      throw new AppErrorClass('Match not found', 404);
    }

    // Get players from both teams
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select(`
        *,
        stats:player_stats (
          *
        )
      `)
      .in('team', [match.team1, match.team2])
      .eq('is_active', true);

    if (playersError) {
      throw new AppErrorClass('Error fetching players', 500);
    }

    // Get venue-specific stats
    const { data: venueStats } = await supabase
      .from('player_stats')
      .select('*')
      .eq('venue_id', match.venue_id);

    // Merge venue stats into player data
    const playersWithVenueStats = players?.map(player => {
      const venueStat = venueStats?.find(vs => vs.player_id === player.id);
      return {
        ...player,
        venue_stats: venueStat || null
      };
    });

    res.json({
      success: true,
      data: {
        match,
        players: playersWithVenueStats
      }
    });
  } catch (error) {
    next(error);
  }
};

function calculateFormMetrics(fantasyScores: any[]) {
  if (!fantasyScores || fantasyScores.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      trend: 'stable'
    };
  }

  const scores = fantasyScores.map(fs => Number(fs.fantasy_points));
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  // Determine trend
  let trend = 'stable';
  if (scores.length >= 3) {
    const recentAvg = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = scores.slice(3).reduce((a, b) => a + b, 0) / (scores.length - 3);
    if (recentAvg > olderAvg * 1.1) trend = 'improving';
    else if (recentAvg < olderAvg * 0.9) trend = 'declining';
  }

  return {
    average: Math.round(average * 100) / 100,
    highest,
    lowest,
    trend
  };
}
