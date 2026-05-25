import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchesAPI, teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts/Layout';
import { Card, Button, LoadingCard, Badge, LoadingSpinner } from '../components/ui/Loading';
import PlayerCard from '../components/PlayerCard';
import TeamCompositionChart from '../components/charts/TeamCompositionChart';
import { format } from 'date-fns';
import {
  Zap, Save, Download, Info, ChevronLeft, RefreshCw,
  Users, Target, AlertCircle, CheckCircle
} from 'lucide-react';

export default function GenerateTeamPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [teamType, setTeamType] = useState<'safe' | 'balanced' | 'grand-league'>('balanced');
  const [generatedTeam, setGeneratedTeam] = useState<any>(null);
  const [teamName, setTeamName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => matchesAPI.getById(matchId!)
  });

  const generateMutation = useMutation({
    mutationFn: () => teamsAPI.generate({ match_id: matchId!, team_type: teamType }),
    onSuccess: (data: any) => {
      setGeneratedTeam(data.data);
      setTeamName(`${data.data.match_details?.team1} vs ${data.data.match_details?.team2} - ${new Date().toLocaleDateString()}`);
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => teamsAPI.save({
      match_id: matchId!,
      team_name: teamName,
      players: generatedTeam.players,
      captain_id: generatedTeam.captain.id,
      vice_captain_id: generatedTeam.vice_captain.id,
      team_type: teamType
    }),
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['saved-teams'] });
      setTimeout(() => {
        navigate('/my-teams');
      }, 2000);
    }
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  const handleSave = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    saveMutation.mutate();
  };

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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link to={`/matches/${matchId}`} className="text-emerald-400 hover:text-emerald-300 mb-6 inline-flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Match
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI Team Generator
          </h1>
          <p className="text-gray-400">
            {match.team1} vs {match.team2} - {format(new Date(match.match_date), 'MMM dd, yyyy')}
          </p>
        </div>

        {/* Team Type Selection */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Select Team Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTeamType('safe')}
              className={`p-4 rounded-lg border transition-all ${
                teamType === 'safe'
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <h3 className="text-white font-medium mb-1">Safe Team</h3>
                <p className="text-gray-400 text-sm">Conservative picks for small leagues</p>
              </div>
            </button>
            <button
              onClick={() => setTeamType('balanced')}
              className={`p-4 rounded-lg border transition-all ${
                teamType === 'balanced'
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <h3 className="text-white font-medium mb-1">Balanced Team</h3>
                <p className="text-gray-400 text-sm">Mix of safe and risky picks</p>
              </div>
            </button>
            <button
              onClick={() => setTeamType('grand-league')}
              className={`p-4 rounded-lg border transition-all ${
                teamType === 'grand-league'
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <h3 className="text-white font-medium mb-1">Grand League</h3>
                <p className="text-gray-400 text-sm">High-risk picks for big winnings</p>
              </div>
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerate}
              loading={generateMutation.isPending}
              disabled={generateMutation.isPending}
            >
              <Zap className="w-5 h-5 mr-2" />
              Generate AI Team
            </Button>
          </div>
        </Card>

        {/* Generated Team */}
        {generateMutation.isPending && (
          <Card className="p-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-400 mt-4">Analyzing player data and generating optimal team...</p>
            </div>
          </Card>
        )}

        {generatedTeam && !generateMutation.isPending && (
          <div className="space-y-6">
            {/* Team Summary */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Your Fantasy XI</h2>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Total AI Score: {generatedTeam.total_ai_score?.toFixed(1)}</span>
                    </div>
                    <Badge variant="success">{teamType}</Badge>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </Button>
                  {user && !saveSuccess && (
                    <Button
                      onClick={handleSave}
                      loading={saveMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Team
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {saveSuccess && (
              <div className="p-4 bg-emerald-900/20 border border-emerald-700 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Team saved successfully! Redirecting...</span>
              </div>
            )}

            {/* Captain & Vice Captain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-emerald-500/50 bg-emerald-900/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Captain</h3>
                    <p className="text-gray-400 text-sm">Gets 2x points</p>
                  </div>
                </div>
                <PlayerCard
                  player={generatedTeam.captain}
                  showScore
                  isCaptain
                />
              </Card>

              <Card className="p-6 border-amber-500/50 bg-amber-900/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">VC</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Vice-Captain</h3>
                    <p className="text-gray-400 text-sm">Gets 1.5x points</p>
                  </div>
                </div>
                <PlayerCard
                  player={generatedTeam.vice_captain}
                  showScore
                  isViceCaptain
                />
              </Card>
            </div>

            {/* Team Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Team Composition
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wicketkeepers</span>
                    <span className="text-white font-medium">{generatedTeam.team_composition?.wicketkeepers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Batsmen</span>
                    <span className="text-white font-medium">{generatedTeam.team_composition?.batsmen || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">All-Rounders</span>
                    <span className="text-white font-medium">{generatedTeam.team_composition?.all_rounders || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bowlers</span>
                    <span className="text-white font-medium">{generatedTeam.team_composition?.bowlers || 0}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-400" />
                  Team Split
                </h3>
                <div className="space-y-3">
                  {Object.entries(generatedTeam.team_split || {}).map(([team, count]: [string, any]) => (
                    <div key={team} className="flex justify-between items-center">
                      <span className="text-gray-400">{team}</span>
                      <span className="text-white font-medium">{count} players</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* All Players */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Playing XI</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedTeam.players?.map((player: any) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    showScore
                    isCaptain={player.id === generatedTeam.captain.id}
                    isViceCaptain={player.id === generatedTeam.vice_captain.id}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Info Cards */}
        {!generatedTeam && !generateMutation.isPending && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-medium mb-2">AI Analysis</h3>
                <p className="text-gray-400 text-sm">
                  Our AI analyzes player form, pitch conditions, and venue statistics
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-medium mb-2">Smart Selection</h3>
                <p className="text-gray-400 text-sm">
                  Weighted scoring ensures balanced team composition
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-medium mb-2">Captain Pick</h3>
                <p className="text-gray-400 text-sm">
                  Automatic captain selection based on predicted performance
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
