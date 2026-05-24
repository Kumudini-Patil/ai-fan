import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { playersAPI, matchesAPI, venuesAPI } from '../services/api';
import Layout from '../layouts/Layout';
import { Card, LoadingCard, Badge, Button } from '../components/ui/Loading';
import PlayerFormChart from '../components/charts/PlayerFormChart';
import FantasyScoreChart from '../components/charts/FantasyScoreChart';
import { TrendingUp, Users, MapPin, Target, Award, Filter } from 'lucide-react';

export default function StatsPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ['players', selectedRole, selectedTeam],
    queryFn: () => playersAPI.getAll({ role: selectedRole || undefined, team: selectedTeam || undefined })
  });

  const { data: matchesData } = useQuery({
    queryKey: ['matches'],
    queryFn: () => matchesAPI.getAll({ limit: 10 })
  });

  const { data: venuesData } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venuesAPI.getAll()
  });

  const players = playersData?.data || [];
  const matches = matchesData?.data || [];
  const venues = venuesData?.data || [];

  // Get unique teams
  const teams = [...new Set(players.map((p: any) => p.team))];

  // Get top performers
  const topPerformers = [...players]
    .filter((p: any) => p.player_stats?.[0]?.fantasy_average)
    .sort((a: any, b: any) => (b.player_stats?.[0]?.fantasy_average || 0) - (a.player_stats?.[0]?.fantasy_average || 0))
    .slice(0, 10);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Statistics & Analytics</h1>
          <p className="text-gray-400">Comprehensive player and team analysis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">{players.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Matches</p>
                <p className="text-2xl font-bold text-white">{matches.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Venues</p>
                <p className="text-2xl font-bold text-white">{venues.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Teams</p>
                <p className="text-2xl font-bold text-white">{teams.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Filters</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">All Roles</option>
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="all-rounder">All-Rounder</option>
                <option value="wicketkeeper">Wicketkeeper</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Team</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">All Teams</option>
                {teams.map((team: string) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRole('');
                  setSelectedTeam('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performers Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Top Performers by Fantasy Average
            </h2>
            {topPerformers.length > 0 ? (
              <div className="h-80">
                <FantasyScoreChart
                  data={topPerformers.map((p: any) => ({
                    name: p.name,
                    score: p.player_stats?.[0]?.fantasy_average || 0
                  }))}
                />
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No data available</p>
            )}
          </Card>

          {/* Team Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Players by Team
            </h2>
            <div className="space-y-4">
              {teams.slice(0, 6).map((team: string) => {
                const count = players.filter((p: any) => p.team === team).length;
                const percentage = (count / players.length) * 100;
                return (
                  <div key={team} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{team}</span>
                        <span className="text-gray-400">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Players List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">All Players</h2>
          {playersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Player</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Team</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Fantasy Avg</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Recent Form</th>
                  </tr>
                </thead>
                <tbody>
                  {players.slice(0, 20).map((player: any) => (
                    <tr key={player.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 text-white">{player.name}</td>
                      <td className="py-3 px-4 text-gray-400">{player.team}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          player.role === 'batsman' ? 'info' :
                          player.role === 'bowler' ? 'error' :
                          player.role === 'all-rounder' ? 'warning' : 'default'
                        }>
                          {player.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-emerald-400">
                        {player.player_stats?.[0]?.fantasy_average?.toFixed(1) || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${(player.player_stats?.[0]?.recent_form || 50)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {(player.player_stats?.[0]?.recent_form || 50).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Venues List */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            Venue Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.slice(0, 6).map((venue: any) => (
              <div key={venue.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{venue.name}</h3>
                    <p className="text-gray-400 text-sm">{venue.city}</p>
                  </div>
                  <Badge variant={venue.pitch_type === 'spin-friendly' ? 'warning' : venue.pitch_type === 'pace-friendly' ? 'info' : 'default'}>
                    {venue.pitch_type}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-gray-400 mt-3">
                  <span>Avg Score: {venue.average_first_innings_score}</span>
                  <span>Spin: {(venue.spin_factor * 100).toFixed(0)}%</span>
                  <span>Pace: {(venue.pace_factor * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
