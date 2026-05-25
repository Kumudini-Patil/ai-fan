import { Badge } from '../ui/Loading';
import { Calendar, MapPin, Clock, Sparkles, ChevronRight, Flame, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface MatchBannerProps {
  match: any;
  featured?: boolean;
}

export default function MatchBanner({ match, featured = false }: MatchBannerProps) {
  const matchDate = new Date(match.match_date);
  const isUpcoming = match.status === 'upcoming';

  return (
    <Link to={`/matches/${match.id}`}>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group ${
          featured
            ? 'bg-gradient-to-br from-primary-900/30 via-dark-900 to-dark-850 border-primary-500/30 hover:border-primary-500/60'
            : 'bg-dark-850 border-dark-700 hover:border-dark-600'
        }`}
      >
        {/* Background Effects for Featured */}
        {featured && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-4 right-4">
              <Badge variant="success">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Recommended
              </Badge>
            </div>
          </>
        )}

        <div className="relative p-6">
          {/* Match Type & Date */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant={featured ? 'success' : 'default'}>
              {match.match_type}
            </Badge>
            <div className="flex items-center gap-3 text-sm text-dark-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(matchDate, 'MMM dd')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{format(matchDate, 'HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-6">
            {/* Team 1 */}
            <div className="text-center flex-1">
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 ${
                featured ? 'bg-primary-600/20' : 'bg-dark-800'
              }`}>
                <span className="text-2xl font-bold text-white font-mono">
                  {match.team1.substring(0, 3).toUpperCase()}
                </span>
                {featured && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-emerald rounded-full flex items-center justify-center">
                    <Flame className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-white font-semibold text-sm">{match.team1}</p>
              {match.venue?.team_form?.[match.team1] && (
                <p className="text-xs text-dark-500 mt-1">Form: {match.venue.team_form[match.team1]}</p>
              )}
            </div>

            {/* VS Section */}
            <div className="flex-shrink-0 px-6">
              <div className="flex flex-col items-center">
                <span className={`text-2xl font-bold font-mono ${
                  featured ? 'text-primary-400' : 'text-dark-500'
                }`}>
                  VS
                </span>
                {featured && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-primary-300">
                    <Target className="w-3 h-3" />
                    Hot Match
                  </div>
                )}
              </div>
            </div>

            {/* Team 2 */}
            <div className="text-center flex-1">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 ${
                featured ? 'bg-primary-600/20' : 'bg-dark-800'
              }`}>
                <span className="text-2xl font-bold text-white font-mono">
                  {match.team2.substring(0, 3).toUpperCase()}
                </span>
              </div>
              <p className="text-white font-semibold text-sm">{match.team2}</p>
              {match.venue?.team_form?.[match.team2] && (
                <p className="text-xs text-dark-500 mt-1">Form: {match.venue.team_form[match.team2]}</p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center justify-center gap-2 text-dark-400 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{match.venue?.name || match.venue?.city || 'Venue TBD'}</span>
          </div>

          {/* AI Insights Preview (Featured only) */}
          {featured && (
            <div className="mt-4 pt-4 border-t border-dark-700/50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-dark-500 mb-1">Pitch Type</div>
                  <div className="text-sm font-medium text-white capitalize">
                    {match.venue?.pitch_type?.replace('-', ' ') || 'Balanced'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-500 mb-1">Avg Score</div>
                  <div className="text-sm font-medium text-white font-mono">
                    {match.venue?.average_first_innings_score || 165}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-500 mb-1">Spin Factor</div>
                  <div className="text-sm font-medium text-white font-mono">
                    {Math.round((match.venue?.spin_factor || 0.5) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-dark-700/50">
            <div className={`flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              featured ? 'text-primary-400 group-hover:text-primary-300' : 'text-dark-300 group-hover:text-white'
            }`}>
              <Zap className="w-4 h-4" />
              <span>Generate AI Team</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
