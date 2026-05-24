import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppErrorClass } from '../middleware/errorHandler';
import { TeamGenerator, TeamConfig } from '../ai-engine/teamGenerator';

export const generateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { match_id, team_type = 'balanced' } = req.body;

    if (!match_id) {
      throw new AppErrorClass('Match ID is required', 400);
    }

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        venue:venues (*),
        pitch_report:pitch_reports (*)
      `)
      .eq('id', match_id)
      .maybeSingle();

    if (!match) {
      throw new AppErrorClass('Match not found', 404);
    }

    // Get all players from both teams
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select(`
        *,
        player_stats (*)
      `)
      .in('team', [match.team1, match.team2])
      .eq('is_active', true);

    if (playersError || !players) {
      throw new AppErrorClass('Error fetching players', 500);
    }

    // Get venue stats for players
    const { data: venueStats } = await supabase
      .from('player_stats')
      .select('*')
      .eq('venue_id', match.venue_id);

    // Get recent fantasy scores
    const playerIds = players.map(p => p.id);
    const { data: fantasyScores } = await supabase
      .from('fantasy_scores')
      .select('*')
      .in('player_id', playerIds)
      .order('created_at', { ascending: false })
      .limit(100);

    // Prepare player data with all required stats
    const playersWithData = players.map(player => {
      const venueStat = venueStats?.find(vs => vs.player_id === player.id);
      const playerFantasyScores = fantasyScores?.filter(fs => fs.player_id === player.id) || [];

      // Get overall stats
      const overallStats = player.player_stats?.[0] || null;

      return {
        ...player,
        venue_stats: venueStat,
        overall_stats: overallStats,
        recent_fantasy_scores: playerFantasyScores.map(fs => Number(fs.fantasy_points)),
        recent_form: calculateRecentForm(playerFantasyScores),
        fantasy_average: calculateFantasyAverage(playerFantasyScores)
      };
    });

    // Initialize team generator
    const teamGenerator = new TeamGenerator();

    // Configure team generation
    const config: TeamConfig = {
      match,
      players: playersWithData,
      teamType: team_type,
      venuePitchType: match.venue?.pitch_type || 'balanced',
      spinFactor: match.venue?.spin_factor || 0.5,
      paceFactor: match.venue?.pace_factor || 0.5
    };

    // Generate team
    const generatedTeam = teamGenerator.generateTeam(config);

    res.json({
      success: true,
      data: {
        ...generatedTeam,
        match_details: {
          id: match.id,
          team1: match.team1,
          team2: match.team2,
          date: match.match_date,
          venue: match.venue
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const saveTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { match_id, team_name, players, captain_id, vice_captain_id, team_type, notes } = req.body;

    if (!match_id || !players || players.length !== 11) {
      throw new AppErrorClass('Match ID and exactly 11 players are required', 400);
    }

    // Calculate total score
    const total_score = players.reduce((sum: number, p: any) => sum + (p.ai_score || 0), 0);

    const { data: savedTeam, error } = await supabase
      .from('saved_teams')
      .insert({
        user_id: req.user!.id,
        match_id,
        team_name: team_name || 'My Team',
        players: players,
        captain_id,
        vice_captain_id,
        total_score,
        team_type: team_type || 'safe',
        notes: notes || ''
      })
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error saving team', 500);
    }

    res.status(201).json({
      success: true,
      data: savedTeam
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedTeams = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { match_id } = req.query;

    let query = supabase
      .from('saved_teams')
      .select(`
        *,
        match:matches (*)
      `)
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (match_id) {
      query = query.eq('match_id', match_id);
    }

    const { data: teams, error } = await query;

    if (error) {
      throw new AppErrorClass('Error fetching saved teams', 500);
    }

    res.json({
      success: true,
      count: teams?.length || 0,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: team, error } = await supabase
      .from('saved_teams')
      .select(`
        *,
        match:matches (
          *,
          venue:venues (*)
        )
      `)
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (!team) {
      throw new AppErrorClass('Team not found', 404);
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('saved_teams')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user!.id);

    if (error) {
      throw new AppErrorClass('Error deleting team', 500);
    }

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const downloadTeamImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: team, error } = await supabase
      .from('saved_teams')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (!team) {
      throw new AppErrorClass('Team not found', 404);
    }

    // Return team data for frontend to generate image
    res.json({
      success: true,
      data: {
        team,
        download_url: null,
        message: 'Use frontend library to generate team image'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function calculateRecentForm(fantasyScores: any[]): number {
  if (!fantasyScores || fantasyScores.length === 0) return 50;

  const recent = fantasyScores.slice(0, 5);
  const avg = recent.reduce((sum, fs) => sum + Number(fs.fantasy_points), 0) / recent.length;

  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, avg));
}

function calculateFantasyAverage(fantasyScores: any[]): number {
  if (!fantasyScores || fantasyScores.length === 0) return 0;

  return fantasyScores.reduce((sum, fs) => sum + Number(fs.fantasy_points), 0) / fantasyScores.length;
}
