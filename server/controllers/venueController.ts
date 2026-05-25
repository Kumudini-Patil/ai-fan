import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { AppErrorClass } from '../middleware/errorHandler';

export const getVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .order('name', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      throw new AppErrorClass('Error fetching venues', 500);
    }

    res.json({
      success: true,
      count: venues?.length || 0,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

export const getVenueById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: venue, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!venue) {
      throw new AppErrorClass('Venue not found', 404);
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};
