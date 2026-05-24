import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchesAPI } from '../services/api';
import Layout from '../layouts/Layout';
import { Card, Button, LoadingCard, Badge } from '../components/ui/Loading';
import { Calendar, MapPin, Clock, Filter, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function MatchesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('upcoming');

  const { data: matchesData, isLoading } = useQuery({
    queryKey: ['matches', statusFilter],
    queryFn: () => matchesAPI.getAll({ status: statusFilter, limit: 20 })
  });

  const matches = matchesData?.data || [];

  const filters = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Cricket Matches</h1>
          <p className="text-gray-400">Select a match to generate your fantasy team</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === filter.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No matches found</p>
            <p className="text-gray-500 text-sm mt-2">
              {statusFilter === 'upcoming'
                ? 'No upcoming matches scheduled'
                : `No ${statusFilter} matches`}
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}

function MatchCard({ match }: { match: any }) {
  const matchDate = new Date(match.match_date);
  const isUpcoming = match.status === 'upcoming';

  return (
    <Card className="overflow-hidden hover:border-emerald-700/50 transition-all group">
      {/* Header */}
      <div className="bg-gray-800/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isUpcoming ? 'success' : 'info'}>
            {match.match_type}
          </Badge>
          {match.status === 'live' && (
            <Badge variant="error">LIVE</Badge>
          )}
        </div>
        <span className="text-gray-500 text-sm">
          {format(matchDate, 'MMM dd, yyyy')}
        </span>
      </div>

      {/* Teams */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-gray-700 transition-colors">
              <span className="text-white font-bold text-xl">
                {match.team1.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-medium">{match.team1}</p>
          </div>

          {/* VS */}
          <div className="flex-shrink-0 px-4">
            <div className="text-emerald-400 font-bold text-lg">VS</div>
            <div className="text-xs text-gray-500 mt-1">
              {format(matchDate, 'HH:mm')}
            </div>
          </div>

          {/* Team 2 */}
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-gray-700 transition-colors">
              <span className="text-white font-bold text-xl">
                {match.team2.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-medium">{match.team2}</p>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-center justify-center text-gray-400 text-sm mt-4 pt-4 border-t border-gray-800">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{match.venue?.name || match.venue?.city || 'Venue TBD'}</span>
        </div>

        {/* Result or Score (for completed/live matches) */}
        {match.status !== 'upcoming' && (
          <div className="mt-4 text-center">
            {match.team1_score && match.team2_score ? (
              <div className="text-gray-300 text-sm">
                {match.team1_score} / {match.team2_score}
              </div>
            ) : match.result && (
              <div className="text-emerald-400 text-sm font-medium">{match.result}</div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Link to={`/matches/${match.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {isUpcoming && (
            <Link to={`/generate-team/${match.id}`} className="flex-1">
              <Button className="w-full">
                Generate Team
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
