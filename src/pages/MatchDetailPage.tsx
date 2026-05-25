import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchesAPI, playersAPI } from '../services/api';
import Layout from '../layouts/Layout';
import { Card, Button, LoadingCard, Badge, LoadingSpinner } from '../components/ui/Loading';
import PlayerCard from '../components/PlayerCard';
import { Calendar, MapPin, Clock, TrendingUp, Target, Zap, Cloud } from 'lucide-react';
import { format } from 'date-fns';

export default function MatchDetailPage() {
  const { id } = useParams();

  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchesAPI.getById(id!)
  });

  const { data: pitchData, isLoading: pitchLoading } = useQuery({
    queryKey: ['pitch-report', id],
    queryFn: () => matchesAPI.getPitchReport(id!)
  });

  const { data: predictionData, isLoading: predictionLoading } = useQuery({
    queryKey: ['match-prediction', id],
    queryFn: () => matchesAPI.getPrediction(id!)
  });

  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ['match-players', id],
    queryFn: () => playersAPI.getByMatch(id!)
  });

  if (matchLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingCard />
        </div>
      </Layout>
    );
  }

  const match = matchData?.data;
  const pitch = pitchData?.data;
  const prediction = predictionData?.data;
  const players = playersData?.data?.players || [];

  if (!match) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-400">Match not found</p>
          </Card>
        </div>
      </Layout>
    );
  }

  const matchDate = new Date(match.match_date);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Match Header */}
        <div className="mb-8">
          <Link to="/matches" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
            ← Back to Matches
          </Link>

          <Card className="p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Team 1 */}
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-white font-bold text-2xl md:text-3xl">
                    {match.team1.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-semibold text-lg">{match.team1}</p>
              </div>

              {/* Match Info */}
              <div className="text-center flex-1">
                <Badge variant="success" className="mb-2">{match.match_type}</Badge>
                <div className="text-emerald-400 font-bold text-2xl mb-3">VS</div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(matchDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{format(matchDate, 'HH:mm')}</span>
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-white font-bold text-2xl md:text-3xl">
                    {match.team2.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-semibold text-lg">{match.team2}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center justify-center text-gray-400 mt-6 pt-6 border-t border-gray-700">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{match.venue?.name || 'Venue TBD'}, {match.venue?.city || ''}</span>
            </div>
          </Card>
        </div>

        {/* Action Button */}
        {match.status === 'upcoming' && (
          <Link to={`/generate-team/${match.id}`} className="block mb-8">
            <Button size="lg" className="w-full md:w-auto">
              <Zap className="w-5 h-5 mr-2" />
              Generate AI Team
            </Button>
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pitch Report */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-emerald-400" />
              Pitch Analysis
            </h2>
            {pitchLoading ? (
              <LoadingSpinner />
            ) : pitch ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Pitch Type</span>
                  <Badge variant="info">{pitch.pitch_type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Spin Friendly</span>
                  <div className="flex-1 ml-4">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${(pitch.spin_friendly || 0.5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Pace Friendly</span>
                  <div className="flex-1 ml-4">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(pitch.pace_friendly || 0.5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg First Innings</span>
                  <span className="text-white font-medium">{pitch.average_score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Weather</span>
                  <span className="text-white">{pitch.weather_condition}</span>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">{pitch.analysis_text}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Pitch report not available</p>
            )}
          </Card>

          {/* Match Prediction */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              Match Prediction
            </h2>
            {predictionLoading ? (
              <LoadingSpinner />
            ) : prediction ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-400 mb-2">Predicted Winner</p>
                  <p className="text-2xl font-bold text-emerald-400">{prediction.predicted_winner}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-center mb-2">
                      <span className="text-white font-medium">{match.team1}</span>
                      <div className="text-emerald-400 text-lg">{prediction.team1_probability}%</div>
                    </div>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${prediction.team1_probability}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-center mb-2">
                      <span className="text-white font-medium">{match.team2}</span>
                      <div className="text-blue-400 text-lg">{prediction.team2_probability}%</div>
                    </div>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${prediction.team2_probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm mb-2">Key Factors:</p>
                  <ul className="space-y-1">
                    {prediction.key_factors?.map((factor: string, idx: number) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Prediction not available</p>
            )}
          </Card>
        </div>

        {/* Players Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Available Players</h2>
          {playersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.slice(0, 12).map((player: any) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No players found</p>
          )}
        </Card>
      </div>
    </Layout>
  );
}
