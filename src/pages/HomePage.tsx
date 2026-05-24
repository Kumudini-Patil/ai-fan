import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchesAPI } from '../services/api';
import { Card, Button, LoadingCard, Badge } from '../components/ui/Loading';
import { Calendar, MapPin, Users, Zap, TrendingUp, Shield, ChevronRight, BarChart3, Target } from 'lucide-react';
import { format } from 'date-fns';

export default function HomePage() {
  const { data: matchesData, isLoading } = useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: () => matchesAPI.getAll({ status: 'upcoming', limit: 6 })
  });

  const matches = matchesData?.data || [];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Selection',
      description: 'Advanced algorithms analyze player form, pitch conditions, and venue statistics to generate optimal teams.',
      color: 'text-primary-400',
      bg: 'bg-primary-500/10'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Real-time player performance tracking with detailed statistics and form analysis.',
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10'
    },
    {
      icon: Target,
      title: 'Multiple Team Types',
      description: 'Generate safe teams for small leagues or high-risk teams for grand league competitions.',
      color: 'text-accent-emerald',
      bg: 'bg-accent-emerald/10'
    }
  ];

  const stats = [
    { label: 'Teams Generated', value: '10,000+', icon: Users },
    { label: 'Matches Covered', value: '500+', icon: Calendar },
    { label: 'Success Rate', value: '85%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-dark-950"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">AI-Powered Fantasy Cricket</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build Winning Fantasy Teams
              <span className="block text-primary-400 mt-2">with AI Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-dark-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Our advanced AI analyzes player form, pitch conditions, venue statistics, and match dynamics
              to generate the most optimal fantasy cricket teams for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/matches">
                <Button size="lg" className="min-w-[200px]">
                  Generate Team Now
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/stats">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  <BarChart3 className="mr-2 w-5 h-5" />
                  View Statistics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-900 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600/10 rounded-xl mb-4 group-hover:bg-primary-600/20 transition-all">
                  <stat.icon className="w-7 h-7 text-primary-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">{stat.value}</div>
                <div className="text-dark-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose FantasyAI?
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Leverage the power of artificial intelligence to make data-driven decisions
              for your fantasy cricket teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:border-primary-700/50 transition-all duration-200 group">
                <div className={`flex items-center justify-center w-12 h-12 ${feature.bg} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Upcoming Matches</h2>
              <p className="text-dark-400">Select a match to generate your fantasy team</p>
            </div>
            <Link to="/matches">
              <Button variant="outline">
                View All
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400">No upcoming matches available</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary-600/5 to-primary-900/5 border-primary-700/30 text-center">
            <Shield className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Win?
            </h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of fantasy cricket players who use our AI to build winning teams.
              It's free to get started!
            </p>
            <Link to="/register">
              <Button size="lg" className="shadow-glow">
                Get Started Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

function MatchCard({ match }: { match: any }) {
  const matchDate = new Date(match.match_date);

  return (
    <Link to={`/matches/${match.id}`}>
      <Card className="p-6 hover:border-primary-700/50 hover:bg-dark-800/50 transition-all cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="success">
            {match.match_type}
          </Badge>
          <span className="text-sm text-dark-500 font-mono">
            {format(matchDate, 'MMM dd')}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          {/* Team 1 */}
          <div className="text-center flex-1">
            <div className="w-14 h-14 bg-dark-800 group-hover:bg-dark-700 rounded-full flex items-center justify-center mb-2 mx-auto transition-colors">
              <span className="text-white font-bold text-lg font-mono">
                {match.team1.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-medium text-sm">{match.team1}</p>
          </div>

          {/* VS */}
          <div className="text-center px-4">
            <div className="text-primary-400 font-bold font-mono">VS</div>
            <div className="text-xs text-dark-500 mt-1 font-mono">
              {format(matchDate, 'HH:mm')}
            </div>
          </div>

          {/* Team 2 */}
          <div className="text-center flex-1">
            <div className="w-14 h-14 bg-dark-800 group-hover:bg-dark-700 rounded-full flex items-center justify-center mb-2 mx-auto transition-colors">
              <span className="text-white font-bold text-lg font-mono">
                {match.team2.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-medium text-sm">{match.team2}</p>
          </div>
        </div>

        <div className="flex items-center justify-center text-dark-400 text-sm pt-4 border-t border-dark-700">
          <MapPin className="w-4 h-4 mr-2 text-dark-500" />
          <span>{match.venue?.city || 'TBD'}</span>
        </div>
      </Card>
    </Link>
  );
}
