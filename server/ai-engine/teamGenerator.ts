export interface Player {
  id: string;
  name: string;
  team: string;
  role: 'wicketkeeper' | 'batsman' | 'all-rounder' | 'bowler';
  batting_style?: string;
  bowling_style?: string;
  venue_stats?: any;
  overall_stats?: any;
  recent_fantasy_scores?: number[];
  recent_form?: number;
  fantasy_average?: number;
  ai_score?: number;
  selection_reason?: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  match_date: string;
  venue_id: string;
  venue?: any;
}

export interface TeamConfig {
  match: Match;
  players: Player[];
  teamType: 'safe' | 'grand-league' | 'balanced';
  venuePitchType: string;
  spinFactor: number;
  paceFactor: number;
}

export interface GeneratedTeam {
  players: Player[];
  captain: Player;
  vice_captain: Player;
  team_composition: {
    wicketkeepers: number;
    batsmen: number;
    all_rounders: number;
    bowlers: number;
  };
  team_split: {
    [teamName: string]: number;
  };
  total_ai_score: number;
  team_type: string;
  generation_timestamp: string;
}

export class TeamGenerator {
  private readonly TEAM_SIZE = 11;
  private readonly MIN_WICKETKEEPERS = 1;
  private readonly MIN_BATSMEN = 3;
  private readonly MIN_ALLROUNDERS = 2;
  private readonly MIN_BOWLERS = 3;
  private readonly MAX_PLAYERS_PER_TEAM = 7;

  /**
   * Generate optimal fantasy team based on configuration
   */
  generateTeam(config: TeamConfig): GeneratedTeam {
    const scoredPlayers = this.calculateAllPlayerScores(config);
    const selectedPlayers = this.selectBestTeam(scoredPlayers, config);
    const { captain, vice_captain } = this.selectCaptains(selectedPlayers);

    return {
      players: selectedPlayers,
      captain,
      vice_captain,
      team_composition: this.getTeamComposition(selectedPlayers),
      team_split: this.getTeamSplit(selectedPlayers, config.match),
      total_ai_score: selectedPlayers.reduce((sum, p) => sum + (p.ai_score || 0), 0),
      team_type: config.teamType,
      generation_timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate AI scores for all players
   * Formula: (RecentForm * 0.4) + (PitchFit * 0.2) + (VenueRecord * 0.2) + (FantasyAverage * 0.2)
   */
  private calculateAllPlayerScores(config: TeamConfig): Player[] {
    return config.players.map(player => {
      const scores = this.calculatePlayerScore(player, config);
      return {
        ...player,
        ai_score: scores.total,
        selection_reason: scores.reason
      };
    }).sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
  }

  /**
   * Calculate individual player score
   */
  private calculatePlayerScore(player: Player, config: TeamConfig) {
    // Recent Form (40%)
    const recentFormScore = this.normalizeScore(player.recent_form || 50, 0, 100);

    // Pitch Fit (20%)
    const pitchFitScore = this.calculatePitchFit(player, config);

    // Venue Record (20%)
    const venueRecordScore = this.calculateVenueRecord(player);

    // Fantasy Average (20%)
    const fantasyAverageScore = this.normalizeScore(
      player.fantasy_average || 50,
      0,
      100
    );

    // Calculate weighted total
    const total = (recentFormScore * 0.4) +
                  (pitchFitScore * 0.2) +
                  (venueRecordScore * 0.2) +
                  (fantasyAverageScore * 0.2);

    // Determine selection reason
    let reason = '';
    if (recentFormScore > 70) reason += 'Strong recent form';
    if (pitchFitScore > 70) {
      reason += reason ? ', ' : '';
      reason += 'pitch conditions favor this player';
    }
    if (venueRecordScore > 70) {
      reason += reason ? ', ' : '';
      reason += 'excellent venue record';
    }
    if (fantasyAverageScore > 70) {
      reason += reason ? ', ' : '';
      reason += 'consistent fantasy performer';
    }
    if (!reason) reason = 'Balanced selection based on overall metrics';

    return {
      recentFormScore,
      pitchFitScore,
      venueRecordScore,
      fantasyAverageScore,
      total,
      reason
    };
  }

  /**
   * Calculate pitch fit score based on player role and pitch conditions
   */
  private calculatePitchFit(player: Player, config: TeamConfig): number {
    const { venuePitchType, spinFactor, paceFactor } = config;
    let baseScore = 50;

    switch (player.role) {
      case 'bowler':
        if (player.bowling_style?.toLowerCase().includes('spin')) {
          baseScore = spinFactor * 100;
        } else if (player.bowling_style?.toLowerCase().includes('fast') ||
                   player.bowling_style?.toLowerCase().includes('pace')) {
          baseScore = paceFactor * 100;
        } else {
          // Default for medium pacers
          baseScore = 60 + (paceFactor * 20);
        }
        break;

      case 'all-rounder':
        // All-rounders benefit from both, slightly higher base
        baseScore = 60 + (Math.max(spinFactor, paceFactor) * 30);
        break;

      case 'batsman':
      case 'wicketkeeper':
        // Batsmen prefer batting-friendly or balanced pitches
        if (venuePitchType === 'batting-friendly') {
          baseScore = 80;
        } else if (venuePitchType === 'balanced') {
          baseScore = 70;
        } else {
          baseScore = 50;
        }
        break;
    }

    return Math.min(100, Math.max(0, baseScore));
  }

  /**
   * Calculate venue record score
   */
  private calculateVenueRecord(player: Player): number {
    const venueStats = player.venue_stats;

    if (!venueStats) {
      // Default score if no venue stats
      return 50;
    }

    const battingAvg = venueStats.batting_average || 0;
    const bowlingAvg = venueStats.bowling_average || 0;
    const economyRate = venueStats.economy_rate || 0;

    let score = 50;

    // Batting score
    if (player.role === 'batsman' || player.role === 'wicketkeeper' || player.role === 'all-rounder') {
      if (battingAvg > 50) score += 30;
      else if (battingAvg > 40) score += 20;
      else if (battingAvg > 30) score += 10;
    }

    // Bowling score
    if (player.role === 'bowler' || player.role === 'all-rounder') {
      if (bowlingAvg > 0 && bowlingAvg < 20) score += 30;
      else if (bowlingAvg < 30) score += 20;
      else if (bowlingAvg < 40) score += 10;

      if (economyRate < 5) score += 20;
      else if (economyRate < 6) score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Select best team following all constraints
   */
  private selectBestTeam(scoredPlayers: Player[], config: TeamConfig): Player[] {
    const selected: Player[] = [];
    const teamCount: { [teamName: string]: number } = {};
    teamCount[config.match.team1] = 0;
    teamCount[config.match.team2] = 0;

    // Sort by AI score
    const sortedPlayers = [...scoredPlayers].sort((a, b) =>
      (b.ai_score || 0) - (a.ai_score || 0)
    );

    // First pass: Select players while respecting team limits
    for (const player of sortedPlayers) {
      if (selected.length >= this.TEAM_SIZE) break;

      // Check team limit
      if (teamCount[player.team] >= this.MAX_PLAYERS_PER_TEAM) {
        continue;
      }

      selected.push(player);
      teamCount[player.team]++;
    }

    // Second pass: Ensure minimum role requirements
    this.ensureRoleRequirements(selected, sortedPlayers, teamCount, config);

    // Adjust for team type (safe vs grand league)
    if (config.teamType === 'grand-league') {
      this.addDifferentialPicks(selected, sortedPlayers, teamCount, config);
    }

    return selected;
  }

  /**
   * Ensure minimum player requirements for each role
   */
  private ensureRoleRequirements(
    selected: Player[],
    allPlayers: Player[],
    teamCount: { [teamName: string]: number },
    config: TeamConfig
  ): void {
    const composition = this.getTeamComposition(selected);

    // Add wicketkeepers if needed
    while (composition.wicketkeepers < this.MIN_WICKETKEEPERS) {
      const wk = allPlayers.find(p =>
        p.role === 'wicketkeeper' &&
        !selected.includes(p) &&
        teamCount[p.team] < this.MAX_PLAYERS_PER_TEAM
      );

      if (wk) {
        const replace = selected.find(p =>
          this.canReplace(p, 'wicketkeeper', composition)
        );
        if (replace) {
          const index = selected.indexOf(replace);
          selected[index] = wk;
          teamCount[replace.team]--;
          teamCount[wk.team]++;
          composition.wicketkeepers++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Add batsmen if needed
    while (composition.batsmen < this.MIN_BATSMEN) {
      const bat = allPlayers.find(p =>
        p.role === 'batsman' &&
        !selected.includes(p) &&
        teamCount[p.team] < this.MAX_PLAYERS_PER_TEAM
      );

      if (bat) {
        const replace = selected.find(p => this.canReplace(p, 'batsman', composition));
        if (replace) {
          const index = selected.indexOf(replace);
          selected[index] = bat;
          teamCount[replace.team]--;
          teamCount[bat.team]++;
          composition.batsmen++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Add all-rounders if needed
    while (composition.all_rounders < this.MIN_ALLROUNDERS) {
      const ar = allPlayers.find(p =>
        p.role === 'all-rounder' &&
        !selected.includes(p) &&
        teamCount[p.team] < this.MAX_PLAYERS_PER_TEAM
      );

      if (ar) {
        const replace = selected.find(p => this.canReplace(p, 'all-rounder', composition));
        if (replace) {
          const index = selected.indexOf(replace);
          selected[index] = ar;
          teamCount[replace.team]--;
          teamCount[ar.team]++;
          composition.all_rounders++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Add bowlers if needed
    while (composition.bowlers < this.MIN_BOWLERS) {
      const bowl = allPlayers.find(p =>
        p.role === 'bowler' &&
        !selected.includes(p) &&
        teamCount[p.team] < this.MAX_PLAYERS_PER_TEAM
      );

      if (bowl) {
        const replace = selected.find(p => this.canReplace(p, 'bowler', composition));
        if (replace) {
          const index = selected.indexOf(replace);
          selected[index] = bowl;
          teamCount[replace.team]--;
          teamCount[bowl.team]++;
          composition.bowlers++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  /**
   * Check if a player can be replaced
   */
  private canReplace(
    player: Player,
    neededRole: string,
    composition: any
  ): boolean {
    const role = player.role;
    const roleCount = composition[this.getRoleKey(role)];

    switch (neededRole) {
      case 'wicketkeeper':
        return role !== 'wicketkeeper';
      case 'batsman':
        return role === 'batsman' && roleCount > this.MIN_BATSMEN;
      case 'all-rounder':
        return role === 'all-rounder' && roleCount > this.MIN_ALLROUNDERS;
      case 'bowler':
        return role === 'bowler' && roleCount > this.MIN_BOWLERS;
      default:
        return false;
    }
  }

  /**
   * Add differential picks for grand league teams
   */
  private addDifferentialPicks(
    selected: Player[],
    allPlayers: Player[],
    teamCount: { [teamName: string]: number },
    config: TeamConfig
  ): void {
    // Swap 1-2 players with lower selection rate for differential picks
    const numSwaps = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numSwaps; i++) {
      // Find a mid-tier player in team
      const midIndex = Math.floor(selected.length / 2);
      const toSwap = selected[midIndex];

      // Find replacement with lower AI score (differential)
      const differentials = allPlayers.filter(p =>
        !selected.includes(p) &&
        p.role === toSwap.role &&
        teamCount[p.team] < this.MAX_PLAYERS_PER_TEAM &&
        (p.ai_score || 0) < (toSwap.ai_score || 0) - 5
      );

      if (differentials.length > 0) {
        const replacement = differentials[Math.floor(Math.random() * differentials.length)];
        teamCount[toSwap.team]--;
        teamCount[replacement.team]++;
        selected[midIndex] = {
          ...replacement,
          selection_reason: 'Differential pick for grand league'
        };
      }
    }
  }

  /**
   * Select captain and vice-captain
   */
  private selectCaptains(players: Player[]): { captain: Player; vice_captain: Player } {
    // Sort by AI score
    const sorted = [...players].sort((a, b) =>
      (b.ai_score || 0) - (a.ai_score || 0)
    );

    // Captain: Highest score, preferably all-rounder or consistent performer
    let captain = sorted[0];

    // Prefer all-rounders as captain (2x points)
    const allRounders = sorted.filter(p => p.role === 'all-rounder');
    if (allRounders.length > 0 && (allRounders[0].ai_score || 0) >= (captain.ai_score || 0) * 0.9) {
      captain = allRounders[0];
    }

    // Vice-captain: Second best, different team if possible
    let viceCaptain = sorted[1];
    if (captain.team === sorted[1].team) {
      const differentTeam = sorted.find(p => p.team !== captain.team && p.id !== captain.id);
      if (differentTeam && (differentTeam.ai_score || 0) >= (viceCaptain.ai_score || 0) * 0.9) {
        viceCaptain = differentTeam;
      }
    }

    // Update selection reasons
    captain.selection_reason = `Captain: ${captain.selection_reason}`;
    viceCaptain.selection_reason = `Vice-captain: ${viceCaptain.selection_reason}`;

    return { captain, vice_captain: viceCaptain };
  }

  /**
   * Get team composition
   */
  private getTeamComposition(players: Player[]): any {
    return players.reduce((acc, player) => {
      const role = this.getRoleKey(player.role);
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {
      wicketkeepers: 0,
      batsmen: 0,
      all_rounders: 0,
      bowlers: 0
    });
  }

  /**
   * Get team split
   */
  private getTeamSplit(players: Player[], match: Match): { [teamName: string]: number } {
    return players.reduce((acc, player) => {
      acc[player.team] = (acc[player.team] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Normalize score to 0-100
   */
  private normalizeScore(value: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }

  /**
   * Get role key for composition
   */
  private getRoleKey(role: string): string {
    switch (role) {
      case 'wicketkeeper': return 'wicketkeepers';
      case 'batsman': return 'batsmen';
      case 'all-rounder': return 'all_rounders';
      case 'bowler': return 'bowlers';
      default: return 'unknown';
    }
  }
}
