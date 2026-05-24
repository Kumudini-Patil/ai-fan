/*
  # Insert Sample Data for Fantasy Cricket Application

  1. New Data
    - Sample players from various cricket teams
    - Sample venues with pitch characteristics
    - Sample upcoming matches
    - Sample player statistics
    - Sample pitch reports

  2. Important Notes
    - This data is for testing and demonstration purposes
    - Players represent major cricket teams (India, Australia, England, etc.)
    - Statistics are realistic but fictional
*/

-- Insert sample players
INSERT INTO players (name, team, role, batting_style, bowling_style, nationality, image_url, is_active) VALUES
-- India players
('Virat Kohli', 'India', 'batsman', 'Right-hand', 'Right-arm medium', 'India', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
('Rohit Sharma', 'India', 'batsman', 'Right-hand', 'Right-arm off break', 'India', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', true),
('Jasprit Bumrah', 'India', 'bowler', 'Right-hand', 'Right-arm fast', 'India', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', true),
('Ravindra Jadeja', 'India', 'all-rounder', 'Left-hand', 'Left-arm orthodox', 'India', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', true),
('Rishabh Pant', 'India', 'wicketkeeper', 'Left-hand', 'Right-arm off break', 'India', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg', true),
('Hardik Pandya', 'India', 'all-rounder', 'Right-hand', 'Right-arm fast-medium', 'India', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg', true),
('KL Rahul', 'India', 'wicketkeeper', 'Right-hand', 'Right-arm medium', 'India', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg', true),
('Mohammed Shami', 'India', 'bowler', 'Right-hand', 'Right-arm fast', 'India', '', true),

-- Australia players
('Pat Cummins', 'Australia', 'bowler', 'Right-hand', 'Right-arm fast', 'Australia', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
('Steve Smith', 'Australia', 'batsman', 'Right-hand', 'Right-arm leg break', 'Australia', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', true),
('Glenn Maxwell', 'Australia', 'all-rounder', 'Right-hand', 'Right-arm off break', 'Australia', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', true),
('David Warner', 'Australia', 'batsman', 'Left-hand', 'Right-arm leg break', 'Australia', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', true),
('Josh Hazlewood', 'Australia', 'bowler', 'Right-hand', 'Right-arm fast-medium', 'Australia', '', true),
('Alex Carey', 'Australia', 'wicketkeeper', 'Left-hand', 'Right-arm off break', 'Australia', '', true),
('Mitchell Starc', 'Australia', 'bowler', 'Left-hand', 'Left-arm fast', 'Australia', '', true),

-- England players
('Joe Root', 'England', 'batsman', 'Right-hand', 'Right-arm off break', 'England', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
('Ben Stokes', 'England', 'all-rounder', 'Left-hand', 'Right-arm fast-medium', 'England', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', true),
('Jos Buttler', 'England', 'wicketkeeper', 'Right-hand', 'Right-arm medium', 'England', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', true),
('Jofra Archer', 'England', 'bowler', 'Right-hand', 'Right-arm fast', 'England', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', true),
('Mark Wood', 'England', 'bowler', 'Right-hand', 'Right-arm fast', 'England', '', true),
('Moeen Ali', 'England', 'all-rounder', 'Left-hand', 'Right-arm off break', 'England', '', true),

-- New Zealand players
('Kane Williamson', 'New Zealand', 'batsman', 'Right-hand', 'Right-arm off break', 'New Zealand', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
('Trent Boult', 'New Zealand', 'bowler', 'Right-hand', 'Left-arm fast-medium', 'New Zealand', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', true),
('Devon Conway', 'New Zealand', 'wicketkeeper', 'Left-hand', 'Right-arm medium', 'New Zealand', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', true),

-- South Africa players
('Kagiso Rabada', 'South Africa', 'bowler', 'Right-hand', 'Right-arm fast', 'South Africa', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
('Quinton de Kock', 'South Africa', 'wicketkeeper', 'Left-hand', 'Right-arm medium', 'South Africa', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', true),

-- West Indies players
('Kieron Pollard', 'West Indies', 'all-rounder', 'Right-hand', 'Right-arm medium', 'West Indies', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
('Nicholas Pooran', 'West Indies', 'wicketkeeper', 'Left-hand', 'Right-arm off break', 'West Indies', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', true)

ON CONFLICT DO NOTHING;

-- Insert sample venues
INSERT INTO venues (name, city, country, capacity, pitch_type, average_first_innings_score, spin_factor, pace_factor, boundary_size, description) VALUES
('Wankhede Stadium', 'Mumbai', 'India', 33108, 'spin-friendly', 175, 0.7, 0.3, 'small', 'Known for spin-friendly pitches with short boundaries. High-scoring venue with batsman-friendly conditions.'),
('Melbourne Cricket Ground', 'Melbourne', 'Australia', 100024, 'pace-friendly', 165, 0.3, 0.8, 'large', 'Iconic venue with pace-friendly conditions. Large boundaries favor fast bowlers.'),
('Lords Cricket Ground', 'London', 'England', 31180, 'balanced', 170, 0.5, 0.6, 'medium', 'The home of cricket. Balanced pitch with slight assistance for pace bowlers.'),
('Eden Gardens', 'Kolkata', 'India', 66000, 'spin-friendly', 165, 0.8, 0.2, 'medium', 'Spin paradise with turning tracks. Favorable for spinners in second innings.'),
('Sydney Cricket Ground', 'Sydney', 'Australia', 48000, 'spin-friendly', 160, 0.6, 0.4, 'medium', 'Spin-friendly conditions with turn on offer. Good for stroke play.'),
('M Chinnaswamy Stadium', 'Bangalore', 'India', 40000, 'batting-friendly', 185, 0.4, 0.4, 'small', 'High-scoring venue with flat pitches. Short boundaries aid batsmen.'),
('The Oval', 'London', 'England', 25500, 'batting-friendly', 180, 0.4, 0.5, 'medium', 'Good batting surface with pace and bounce. Favors stroke makers.'),
('Dubai International Cricket Stadium', 'Dubai', 'UAE', 25000, 'balanced', 160, 0.5, 0.5, 'medium', 'Balanced conditions with assistance for both spin and pace.'),
('Newlands', 'Cape Town', 'South Africa', 25000, 'pace-friendly', 155, 0.3, 0.8, 'large', 'Pace and bounce with assistance for fast bowlers. Challenging for batsmen.'),
('Eden Park', 'Auckland', 'New Zealand', 50000, 'balanced', 170, 0.4, 0.6, 'small', 'Balanced pitch with short boundaries. High-scoring encounters.')

ON CONFLICT DO NOTHING;

-- Insert sample matches
INSERT INTO matches (team1, team2, match_date, venue_id, match_type, status) VALUES
('India', 'Australia', '2026-05-25 14:00:00+00', (SELECT id FROM venues WHERE name = 'Wankhede Stadium'), 'T20', 'upcoming'),
('England', 'New Zealand', '2026-05-26 10:00:00+00', (SELECT id FROM venues WHERE name = 'Lords Cricket Ground'), 'T20', 'upcoming'),
('India', 'South Africa', '2026-05-27 14:00:00+00', (SELECT id FROM venues WHERE name = 'Eden Gardens'), 'T20', 'upcoming'),
('Australia', 'England', '2026-05-28 10:00:00+00', (SELECT id FROM venues WHERE name = 'Melbourne Cricket Ground'), 'T20', 'upcoming'),
('West Indies', 'India', '2026-05-29 18:00:00+00', (SELECT id FROM venues WHERE name = 'M Chinnaswamy Stadium'), 'T20', 'upcoming'),
('New Zealand', 'South Africa', '2026-05-30 10:00:00+00', (SELECT id FROM venues WHERE name = 'Eden Park'), 'T20', 'upcoming')

ON CONFLICT DO NOTHING;

-- Insert sample player stats
INSERT INTO player_stats (player_id, venue_id, matches_played, innings_batted, runs_scored, batting_average, strike_rate, centuries, half_centuries, innings_bowled, wickets_taken, bowling_average, economy_rate, five_wicket_hauls, catches, stumpings, recent_form, fantasy_average)
SELECT 
  p.id, 
  v.id, 
  FLOOR(RANDOM() * 20 + 10),
  FLOOR(RANDOM() * 18 + 8),
  FLOOR(RANDOM() * 500 + 300),
  ROUND((RANDOM() * 20 + 25)::numeric, 2),
  ROUND((RANDOM() * 30 + 120)::numeric, 2),
  FLOOR(RANDOM() * 3),
  FLOOR(RANDOM() * 8 + 2),
  CASE WHEN p.role IN ('bowler', 'all-rounder') THEN FLOOR(RANDOM() * 15 + 5) ELSE 0 END,
  CASE WHEN p.role IN ('bowler', 'all-rounder') THEN FLOOR(RANDOM() * 40 + 20) ELSE 0 END,
  CASE WHEN p.role IN ('bowler', 'all-rounder') THEN ROUND((RANDOM() * 15 + 20)::numeric, 2) ELSE 0 END,
  CASE WHEN p.role IN ('bowler', 'all-rounder') THEN ROUND((RANDOM() * 3 + 5)::numeric, 2) ELSE 0 END,
  CASE WHEN p.role IN ('bowler', 'all-rounder') THEN FLOOR(RANDOM() * 2) ELSE 0 END,
  FLOOR(RANDOM() * 25 + 10),
  CASE WHEN p.role = 'wicketkeeper' THEN FLOOR(RANDOM() * 10 + 5) ELSE 0 END,
  ROUND((RANDOM() * 30 + 60)::numeric, 2),
  ROUND((RANDOM() * 40 + 50)::numeric, 2)
FROM players p
CROSS JOIN venues v
WHERE NOT EXISTS (SELECT 1 FROM player_stats WHERE player_id = p.id AND venue_id = v.id)
LIMIT 100;

-- Insert sample pitch reports
INSERT INTO pitch_reports (venue_id, match_id, pitch_type, spin_friendly, pace_friendly, batting_difficulty, average_score, dew_factor, weather_condition, analysis_text)
SELECT 
  v.id,
  m.id,
  v.pitch_type,
  v.spin_factor,
  v.pace_factor,
  CASE 
    WHEN v.pitch_type = 'batting-friendly' THEN 'easy'
    WHEN v.pitch_type = 'spin-friendly' OR v.pitch_type = 'pace-friendly' THEN 'hard'
    ELSE 'medium'
  END,
  CONCAT((v.average_first_innings_score - 10)::text, '-', (v.average_first_innings_score + 10)::text),
  ROUND(RANDOM()::numeric, 2),
  CASE 
    WHEN RANDOM() > 0.5 THEN 'humid'
    ELSE 'clear'
  END,
  'The pitch at ' || v.name || ' is expected to offer ' || v.pitch_type || ' conditions. Teams winning the toss should ' || CASE WHEN v.spin_factor > 0.6 THEN 'bat first and put runs on the board.' WHEN v.pace_factor > 0.6 THEN 'bowl first and exploit early movement.' ELSE 'assess conditions before deciding.' END
FROM venues v
JOIN matches m ON m.venue_id = v.id
WHERE NOT EXISTS (SELECT 1 FROM pitch_reports WHERE venue_id = v.id AND match_id = m.id);

-- Insert sample fantasy scores for recent matches (for historical data)
INSERT INTO fantasy_scores (player_id, match_id, fantasy_points, runs, wickets, catches, is_captain, is_vice_captain)
SELECT 
  p.id,
  m.id,
  ROUND((RANDOM() * 80 + 20)::numeric, 2),
  CASE WHEN p.role != 'bowler' THEN FLOOR(RANDOM() * 60 + 10) ELSE FLOOR(RANDOM() * 15) END,
  CASE WHEN p.role IN ('bowler', 'all-rounder') THEN FLOOR(RANDOM() * 4) ELSE 0 END,
  FLOOR(RANDOM() * 2),
  (RANDOM() > 0.9),
  (RANDOM() > 0.85 AND RANDOM() <= 0.9)
FROM players p
CROSS JOIN matches m
WHERE NOT EXISTS (
  SELECT 1 FROM fantasy_scores fs 
  WHERE fs.player_id = p.id AND fs.match_id = m.id
)
LIMIT 200;
