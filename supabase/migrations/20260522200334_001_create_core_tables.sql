/*
  # Create Core Tables for Fantasy Cricket Application

  1. New Tables
    - `users`: Store user accounts and authentication data
    - `players`: Store cricket player information
    - `venues`: Store cricket venue/stadium information
    - `matches`: Store upcoming and past cricket matches
    - `player_stats`: Store player performance statistics
    - `fantasy_scores`: Store historical fantasy scores for players
    - `saved_teams`: Store user-generated fantasy teams
    - `pitch_reports`: Store pitch analysis data for venues

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users and public access

  3. Important Notes
    - All tables use UUID primary keys
    - Timestamps are automatically managed
    - Foreign key relationships are properly defined
    - Sample data will be inserted in subsequent migrations
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text NOT NULL,
  role text NOT NULL CHECK (role IN ('wicketkeeper', 'batsman', 'all-rounder', 'bowler')),
  batting_style text DEFAULT '',
  bowling_style text DEFAULT '',
  nationality text DEFAULT '',
  image_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  country text DEFAULT '',
  capacity integer DEFAULT 0,
  pitch_type text DEFAULT 'balanced' CHECK (pitch_type IN ('spin-friendly', 'pace-friendly', 'batting-friendly', 'balanced')),
  average_first_innings_score integer DEFAULT 150,
  spin_factor decimal DEFAULT 0.5,
  pace_factor decimal DEFAULT 0.5,
  boundary_size text DEFAULT 'medium',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team1 text NOT NULL,
  team2 text NOT NULL,
  match_date timestamptz NOT NULL,
  venue_id uuid REFERENCES venues(id) ON DELETE SET NULL,
  match_type text DEFAULT 'T20' CHECK (match_type IN ('T20', 'ODI', 'Test')),
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  toss_winner text DEFAULT '',
  toss_decision text DEFAULT '',
  result text DEFAULT '',
  team1_score text DEFAULT '',
  team2_score text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Player stats table
CREATE TABLE IF NOT EXISTS player_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES venues(id) ON DELETE SET NULL,
  matches_played integer DEFAULT 0,
  innings_batted integer DEFAULT 0,
  runs_scored integer DEFAULT 0,
  batting_average decimal DEFAULT 0,
  strike_rate decimal DEFAULT 0,
  centuries integer DEFAULT 0,
  half_centuries integer DEFAULT 0,
  innings_bowled integer DEFAULT 0,
  wickets_taken integer DEFAULT 0,
  bowling_average decimal DEFAULT 0,
  economy_rate decimal DEFAULT 0,
  five_wicket_hauls integer DEFAULT 0,
  catches integer DEFAULT 0,
  stumpings integer DEFAULT 0,
  recent_form decimal DEFAULT 0,
  fantasy_average decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fantasy scores table (historical data)
CREATE TABLE IF NOT EXISTS fantasy_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  fantasy_points decimal DEFAULT 0,
  runs integer DEFAULT 0,
  wickets integer DEFAULT 0,
  catches integer DEFAULT 0,
  is_captain boolean DEFAULT false,
  is_vice_captain boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Saved teams table
CREATE TABLE IF NOT EXISTS saved_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  team_name text DEFAULT 'My Team',
  players jsonb NOT NULL,
  captain_id uuid REFERENCES players(id) ON DELETE SET NULL,
  vice_captain_id uuid REFERENCES players(id) ON DELETE SET NULL,
  total_score decimal DEFAULT 0,
  team_type text DEFAULT 'safe' CHECK (team_type IN ('safe', 'grand-league', 'balanced')),
  notes text DEFAULT '',
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pitch reports table
CREATE TABLE IF NOT EXISTS pitch_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE SET NULL,
  pitch_type text DEFAULT 'balanced',
  spin_friendly decimal DEFAULT 0.5,
  pace_friendly decimal DEFAULT 0.5,
  batting_difficulty text DEFAULT 'medium',
  average_score text DEFAULT '160-180',
  dew_factor decimal DEFAULT 0,
  weather_condition text DEFAULT '',
  analysis_text text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE fantasy_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can only read/write their own data)
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.uid() = id OR auth.jwt() ->> 'email' = email);

-- Public read access for cricket data
CREATE POLICY "Anyone can view players"
  ON players FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view venues"
  ON venues FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view player stats"
  ON player_stats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view fantasy scores"
  ON fantasy_scores FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view pitch reports"
  ON pitch_reports FOR SELECT
  TO public
  USING (true);

-- Users can manage their own saved teams
CREATE POLICY "Users can view own saved teams"
  ON saved_teams FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR auth.jwt() ->> 'sub'::text = user_id::text);

CREATE POLICY "Users can create own saved teams"
  ON saved_teams FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR auth.jwt() ->> 'sub'::text = user_id::text);

CREATE POLICY "Users can update own saved teams"
  ON saved_teams FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR auth.jwt() ->> 'sub'::text = user_id::text)
  WITH CHECK (user_id = auth.uid() OR auth.jwt() ->> 'sub'::text = user_id::text);

CREATE POLICY "Users can delete own saved teams"
  ON saved_teams FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR auth.jwt() ->> 'sub'::text = user_id::text);

-- Admin policies (for users with is_admin = true)
CREATE POLICY "Admins can manage players"
  ON players FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage venues"
  ON venues FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage matches"
  ON matches FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage player stats"
  ON player_stats FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage fantasy scores"
  ON fantasy_scores FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage pitch reports"
  ON pitch_reports FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_role ON players(role);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_venue ON player_stats(venue_id);
CREATE INDEX IF NOT EXISTS idx_fantasy_scores_player ON fantasy_scores(player_id);
CREATE INDEX IF NOT EXISTS idx_fantasy_scores_match ON fantasy_scores(match_id);
CREATE INDEX IF NOT EXISTS idx_saved_teams_user ON saved_teams(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_teams_match ON saved_teams(match_id);
