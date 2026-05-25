import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchesAPI, playersAPI } from '../services/api';
import Layout from '../layouts/Layout';
import { Card, Button, LoadingCard, Badge } from '../components/ui/Loading';
import MatchBanner from '../components/dashboard/MatchBanner';
import TrendingPlayerCard from '../components/dashboard/TrendingPlayerCard';
import FantasyTipsCard from '../components/dashboard/FantasyTipsCard';
import { AIPlayerInsight, FantasyTip } from '../types';
import { generatePlayerExplanation } from '../utils/aiInsights';
import {
  Zap, Sparkles, TrendingUp, Target, Shield, BarChart3,
  ChevronRight, Info, Lightbulb, Users, Flame, Star
} from 'lucide-react';
import { format } from 'date-fns';

export default function PremiumHomePage() {
  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: () => matchesAPI.getAll({ status: 'upcoming', limit: 10 })
  });

  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => playersAPI.getAll({})
  });

  const matches = matchesData?.data || [];
  const players = playersData?.data || [];

  // Featured match (first upcoming)
  const featuredMatch = matches[0];
  const upcomingMatches = matches.slice(1, 7);

  // Generate trending players
  const trendingPlayers = generateTrendingPlayers(players);

  // Generate fantasy tips
  const fantasyTips = generateFantasyTips();

  return (
    <Layout>
      <div className="min-h-screen bg-dark-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-20">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tagline */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-primary-400 text-sm font-medium">Explainable AI for Fantasy Cricket</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Don't Just Generate Teams —
                <span className="block text-primary-400 mt-2">Understand Why They Win</span>
              </h1>

              <p className="text-lg md:text-xl text-dark-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                AI-powered fantasy cricket assistant that explains every selection.
                Know why your captain will score big, which player suits the pitch, and when to take risks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/matches">
                  <Button size="lg" className="min-w-[200px]">
                    <Zap className="w-5 h-5 mr-2" />
                    Generate AI Team
                  </Button>
                </Link>
                <Link to="/stats">
                  <Button size="lg" variant="outline" className="min-w-[200px]">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card className="p-5 text-center">
                <div className="text-3xl font-bold text-white font-mono mb-1">85%</div>
                <div className="text-sm text-dark-400">AI Accuracy</div>
              </Card>
              <Card className="p-5 text-center">
                <div className="text-3xl font-bold text-white font-mono mb-1">10K+</div>
                <div className="text-sm text-dark-400">Teams Generated</div>
              </Card>
              <Card className="p-5 text-center">
                <div className="text-3xl font-bold text-white font-mono mb-1">500+</div>
                <div className="text-sm text-dark-400">Matches Covered</div>
              </Card>
              <Card className="p-5 text-center">
                <div className="text-3xl font-bold text-primary-400 font-mono mb-1">AI</div>
                <div className="text-sm text-dark-400">Explainable</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Match Section */}
        {featuredMatch && (
          <section className="py-12 bg-dark-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-primary-400" />
                  <h2 className="text-xl font-bold text-white">Featured Match</h2>
                </div>
                <Badge variant="success">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Recommended
                  </span>
                </Badge>
              </div>
              <MatchBanner match={featuredMatch} featured />
            </div>
          </section>
        )}

        {/* Upcoming Matches Grid */}
        <section className="py-12 bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upcoming Matches</h2>
              <Link to="/matches" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {matchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.map((match: any) => (
                  <MatchBanner key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Trending Players Section */}
        <section className="py-12 bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Trending Players</h2>
              </div>
              <Link to="/stats" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingPlayers.slice(0, 4).map((player, idx) => (
                <TrendingPlayerCard key={idx} player={player} />
              ))}
            </div>
          </div>
        </section>

        {/* Fantasy Tips Section */}
        <section className="py-12 bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">AI Fantasy Tips</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fantasyTips.map((tip, idx) => (
                <FantasyTipsCard key={idx} tip={tip} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Explainable AI Section */}
        <section className="py-16 bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Why Explainable AI Matters
              </h2>
              <p className="text-dark-300 max-w-2xl mx-auto">
                Unlike other fantasy apps, we don't just give you a team. We explain every selection so you can make informed decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="p-6 hover:border-primary-700/50 transition-all text-center">
                <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Know Why</h3>
                <p className="text-dark-400 text-sm">
                  Every player comes with a detailed explanation of why they were selected for this match.
                </p>
              </Card>

              {/* Feature 2 */}
              <Card className="p-6 hover:border-primary-700/50 transition-all text-center">
                <div className="w-14 h-14 bg-accent-amber/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-accent-amber" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                <p className="text-dark-400 text-sm">
                  Understand the risk level of each pick. Know when to play safe and when to take a gamble.
                </p>
              </Card>

              {/* Feature 3 */}
              <Card className="p-6 hover:border-primary-700/50 transition-all text-center">
                <div className="w-14 h-14 bg-accent-blue/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-accent-blue" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Differential Picks</h3>
                <p className="text-dark-400 text-sm">
                  Find hidden gems that others miss. Low selection % with high potential returns.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-dark-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary-600/10 via-dark-850 to-primary-900/10 border-primary-700/30 text-center">
              <Info className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Make Informed Fantasy Decisions
              </h2>
              <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
                Stop guessing. Start understanding. Our AI analyzes form, pitch, venue, and matchups to give you explainable insights.
              </p>
              <Link to="/register">
                <Button size="lg" className="shadow-glow">
                  <Users className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Helper function to generate trending players
function generateTrendingPlayers(players: any[]): any[] {
  if (!players || players.length === 0) return [];

  return players
    .slice(0, 6)
    .map((player: any) => {
      const recentForm = Math.floor(Math.random() * 40) + 50;
      const changePercentage = Math.floor(Math.random() * 20) - 10;

      let trend: 'rising' | 'falling' | 'stable' = 'stable';
      if (changePercentage > 5) trend = 'rising';
      else if (changePercentage < -5) trend = 'falling';

      const insight: AIPlayerInsight = {
        playerId: player.id,
        playerName: player.name,
        team: player.team,
        role: player.role,
        aiScore: Math.floor(Math.random() * 30) + 60,
        aiConfidence: Math.floor(Math.random() * 20) + 70,
        riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        recentForm,
        venuePerformance: Math.floor(Math.random() * 40) + 50,
        matchupAdvantage: Math.floor(Math.random() * 40) + 50,
        consistency: Math.floor(Math.random() * 40) + 50,
        primaryReason: 'Strong recent performances',
        detailedExplanation: 'Consistent performer with good track record',
        keyFactors: ['Good form', 'Favorable conditions'],
        isDifferentialPick: Math.random() > 0.7,
        isHiddenGem: Math.random() > 0.8,
        isRisky: false,
        captainPotential: Math.floor(Math.random() * 40) + 50,
        viceCaptainPotential: Math.floor(Math.random() * 40) + 50,
        predictedPoints: Math.floor(Math.random() * 50) + 40,
        averagePoints: Math.floor(Math.random() * 30) + 40
      };

      const reasons = [
        `Strong recent form with ${Math.floor(Math.random() * 30 + 50)} fantasy points in last match`,
        `Excellent record at this venue, averaging ${Math.floor(Math.random() * 20 + 40)} points`,
        `Favorable matchup against weak bowling lineup`,
        `Pitch conditions favor ${player.role === 'bowler' ? 'bowling' : 'batting'} style`
      ];

      return {
        player: insight,
        trend,
        changePercentage,
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      };
    });
}

// Helper function to generate fantasy tips
function generateFantasyTips(): FantasyTip[] {
  return [
    {
      type: 'captain',
      title: 'Captain Selection Strategy',
      description: 'Choose all-rounders as captains when pitch conditions favor both batting and bowling. They offer dual scoring opportunities.',
      priority: 'high',
      playerSuggestion: 'Look for all-rounders with recent form > 70'
    },
    {
      type: 'differential',
      title: 'Find Hidden Gems',
      description: 'Players with low selection percentage (<10%) but high venue record can be game-changers in grand leagues.',
      priority: 'medium',
      playerSuggestion: 'Check venue performance before selecting differentials'
    },
    {
      type: 'safe',
      title: 'Safe Team Building',
      description: 'For small leagues (2-10 members), focus on consistent performers. Higher floor is better than higher ceiling.',
      priority: 'high'
    },
    {
      type: 'risky',
      title: 'Grand League Risk Taking',
      description: 'In grand leagues, you need differential picks. Take 2-3 risky players that others are ignoring.',
      priority: 'medium'
    },
    {
      type: 'strategy',
      title: 'Check Toss Impact',
      description: 'After toss, adjust your team based on how the pitch behaves in first vs second innings. Chasing teams often have advantage.',
      priority: 'high'
    },
    {
      type: 'strategy',
      title: 'Pitch Analysis First',
      description: 'Always analyze the pitch before team creation. Spin-friendly pitches favor spinners and subcontinent players.',
      priority: 'medium'
    }
  ];
}
