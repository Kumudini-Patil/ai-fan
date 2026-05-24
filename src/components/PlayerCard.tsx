import { Badge } from './ui/Loading';
import { User, TrendingUp } from 'lucide-react';

interface PlayerCardProps {
  player: any;
  showScore?: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

export default function PlayerCard({ player, showScore = false, isCaptain = false, isViceCaptain = false }: PlayerCardProps) {
  const roleColors: Record<string, string> = {
    'wicketkeeper': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'batsman': 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    'all-rounder': 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    'bowler': 'text-accent-rose bg-accent-rose/10 border-accent-rose/20'
  };

  const roleColor = roleColors[player.role] || 'text-dark-400 bg-dark-700';

  return (
    <div className={`bg-dark-850 rounded-lg p-4 border transition-all hover:border-dark-600 ${
      isCaptain ? 'border-primary-500/50 ring-1 ring-primary-500/30' :
      isViceCaptain ? 'border-amber-500/50 ring-1 ring-amber-500/30' :
      'border-dark-700'
    }`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {player.image_url ? (
            <img
              src={player.image_url}
              alt={player.name}
              className="w-12 h-12 rounded-full object-cover bg-dark-800"
            />
          ) : (
            <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-dark-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-white font-medium truncate text-sm">{player.name}</h3>
            {isCaptain && (
              <span className="text-xs font-bold text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded">2x</span>
            )}
            {isViceCaptain && (
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">1.5x</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-dark-400">{player.team}</span>
            <span className={`text-xs px-2 py-0.5 rounded border ${roleColor}`}>
              {player.role}
            </span>
          </div>

          {showScore && player.ai_score !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 font-mono font-medium">
                {player.ai_score?.toFixed(1)}
              </span>
            </div>
          )}

          {player.selection_reason && (
            <p className="text-dark-500 text-xs mt-2 line-clamp-2">
              {player.selection_reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
