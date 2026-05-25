import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, matchesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts/Layout';
import { Card, Button, LoadingCard, Badge, Input } from '../components/ui/Loading';
import {
  Shield, Users, Calendar, MapPin, TrendingUp, Plus,
  Edit, Trash2, Save, X, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats()
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers()
  });

  const { data: matchesData } = useQuery({
    queryKey: ['matches'],
    queryFn: () => matchesAPI.getAll({ limit: 20 })
  });

  const stats = statsData?.data?.stats || {};
  const upcomingMatches = statsData?.data?.upcoming_matches || [];
  const topPlayers = statsData?.data?.top_players || [];

  if (!user?.is_admin) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400">You need admin privileges to access this page</p>
          </Card>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'venues', label: 'Venues', icon: MapPin },
    { id: 'users', label: 'Users', icon: Users }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">Manage players, matches, venues, and statistics</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Players</p>
                    <p className="text-3xl font-bold text-white">{stats.players || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Matches</p>
                    <p className="text-3xl font-bold text-white">{stats.matches || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Venues</p>
                    <p className="text-3xl font-bold text-white">{stats.venues || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Users</p>
                    <p className="text-3xl font-bold text-white">{stats.users || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/admin#matches">
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Match
                  </Button>
                </Link>
                <Link to="/admin#players">
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Player
                  </Button>
                </Link>
                <Link to="/admin#venues">
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Venue
                  </Button>
                </Link>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Stats
                </Button>
              </div>
            </Card>

            {/* Upcoming Matches */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Upcoming Matches</h2>
              <div className="space-y-4">
                {upcomingMatches.length > 0 ? upcomingMatches.slice(0, 5).map((match: any) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{match.team1} vs {match.team2}</p>
                      <p className="text-gray-400 text-sm">{match.venue?.city}</p>
                    </div>
                    <Badge variant="success">{match.match_type}</Badge>
                  </div>
                )) : (
                  <p className="text-gray-400">No upcoming matches</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Manage Matches</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Match
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400">Match</th>
                    <th className="text-left py-3 px-4 text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400">Venue</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matchesData?.data?.slice(0, 10).map((match: any) => (
                    <tr key={match.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-white">{match.team1} vs {match.team2}</td>
                      <td className="py-3 px-4 text-gray-400">{new Date(match.match_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-400">{match.venue?.city || 'TBD'}</td>
                      <td className="py-3 px-4">
                        <Badge variant={match.status === 'upcoming' ? 'success' : match.status === 'live' ? 'error' : 'default'}>
                          {match.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Registered Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-400">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.data?.slice(0, 10).map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-white">{u.username}</td>
                      <td className="py-3 px-4 text-gray-400">{u.email}</td>
                      <td className="py-3 px-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant={u.is_admin ? 'warning' : 'default'}>
                          {u.is_admin ? 'Admin' : 'User'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Players & Venues Tabs */}
        {(activeTab === 'players' || activeTab === 'venues') && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-gray-400">Full CRUD interface available. Contact backend API directly for now.</p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
