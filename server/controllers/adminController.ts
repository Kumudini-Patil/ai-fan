import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppErrorClass } from '../middleware/errorHandler';

// Player Management
export const addPlayer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerData = req.body;

    const { data: player, error } = await supabase
      .from('players')
      .insert(playerData)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error adding player', 500);
    }

    res.status(201).json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlayer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: player, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error updating player', 500);
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlayer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppErrorClass('Error deleting player', 500);
    }

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Venue Management
export const addVenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const venueData = req.body;

    const { data: venue, error } = await supabase
      .from('venues')
      .insert(venueData)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error adding venue', 500);
    }

    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

export const updateVenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: venue, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error updating venue', 500);
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppErrorClass('Error deleting venue', 500);
    }

    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Match Management
export const addMatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const matchData = req.body;

    const { data: match, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error adding match', 500);
    }

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: match, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error updating match', 500);
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppErrorClass('Error deleting match', 500);
    }

    res.json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Stats Management
export const updatePlayerStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: stats, error } = await supabase
      .from('player_stats')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppErrorClass('Error updating player stats', 500);
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// User Management
export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, username, full_name, is_admin, created_at')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      throw new AppErrorClass('Error fetching users', 500);
    }

    res.json({
      success: true,
      count: users?.length || 0,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard Stats
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get counts
    const [playersCount, venuesCount, matchesCount, usersCount] = await Promise.all([
      supabase.from('players').select('id', { count: 'exact', head: true }),
      supabase.from('venues').select('id', { count: 'exact', head: true }),
      supabase.from('matches').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true })
    ]);

    // Get upcoming matches
    const { data: upcomingMatches } = await supabase
      .from('matches')
      .select(`
        *,
        venue:venues (*)
      `)
      .eq('status', 'upcoming')
      .order('match_date', { ascending: true })
      .limit(5);

    // Get top players by fantasy average
    const { data: topPlayers } = await supabase
      .from('player_stats')
      .select(`
        *,
        player:players (*)
      `)
      .order('fantasy_average', { ascending: false })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          players: playersCount.count || 0,
          venues: venuesCount.count || 0,
          matches: matchesCount.count || 0,
          users: usersCount.count || 0
        },
        upcoming_matches: upcomingMatches,
        top_players: topPlayers
      }
    });
  } catch (error) {
    next(error);
  }
};
