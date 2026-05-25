import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts/Layout';
import { Card, Button, LoadingCard, Badge } from '../components/ui/Loading';
import { format } from 'date-fns';
import { Calendar, Users, Trash2, Eye, Download, Heart, Star } from 'lucide-react';

export default function MyTeamsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['saved-teams'],
    queryFn: () => teamsAPI.getSaved()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teamsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-teams'] });
    }
  });

  const teams = teamsData?.data || [];

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">Please login to view your saved teams</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Teams</h1>
          <p className="text-gray-400">View and manage your saved fantasy teams</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Teams</p>
                <p className="text-3xl font-bold text-white">{teams.length}</p>
              </div>
              <Users className="w-10 h-10 text-emerald-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Safe Teams</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {teams.filter((t: any) => t.team_type === 'safe').length}
                </p>
              </div>
              <Star className="w-10 h-10 text-emerald-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Grand League Teams</p>
                <p className="text-2xl font-bold text-amber-400">
                  {teams.filter((t: any) => t.team_type === 'grand-league').length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-amber-400" />
            </div>
          </Card>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team: any) => (
              <TeamCard
                key={team.id}
                team={team}
                onDelete={() => deleteMutation.mutate(team.id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No saved teams yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Generate and save your first fantasy team
            </p>
            <Link to="/matches">
              <Button>View Matches</Button>
            </Link>
          </Card>
        )}
      </div>
    </Layout>
  );
}

function TeamCard({ team, onDelete, isDeleting }: { team: any; onDelete: () => void; isDeleting: boolean }) {
  const teamTypeVariant = team.team_type === 'safe' ? 'success' : team.team_type === 'grand-league' ? 'warning' : 'info';

  return (
    <Card className="overflow-hidden hover:border-gray-700 transition-all group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-medium mb-1">{team.team_name}</h3>
            {team.match && (
              <p className="text-gray-400 text-sm">
                {team.match.team1} vs {team.match.team2}
              </p>
            )}
          </div>
          <Badge variant={teamTypeVariant}>{team.team_type}</Badge>
        </div>

        {/* Match Info */}
        {team.match && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(team.match.match_date), 'MMM dd, yyyy')}</span>
          </div>
        )}

        {/* Team Score */}
        <div className="flex items-center justify-between mb-4 py-3 px-4 bg-gray-800/50 rounded-lg">
          <span className="text-gray-400 text-sm">Total AI Score</span>
          <span className="text-emerald-400 font-bold text-lg">
            {team.total_score?.toFixed(1) || 'N/A'}
          </span>
        </div>

        {/* Players Preview */}
        {team.players && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {team.players.slice(0, 11).map((player: any, idx: number) => (
                <div
                  key={idx}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-xs"
                  title={player.name}
                >
                  {player.name?.substring(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
          <Link to={`/teams/${team.id}`} className="flex-1">
            <Button variant="ghost" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
