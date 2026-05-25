import { TrendingPlayer } from '../../types';
import { TrendingUp, TrendingDown, Minus, Sparkles, Star, AlertTriangle } from 'lucide-react';

interface TrendingPlayerCardProps {
  player: TrendingPlayer;
}

export default function TrendingPlayerCard({ player }: TrendingPlayerCardProps) {
  const { player: p, trend, changePercentage, reason } = player;

  const trendConfig = {
    rising: {
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-accent-emerald',
      bgColor: 'bg-accent-emerald/10',
      borderColor: 'border-accent-emerald/20',
      label: 'Rising'
    },
    falling: {
      icon: <TrendingDown className="w-4 h-4" />,
      color: 'text-accent-rose',
      bgColor: 'bg-accent-rose/10',
      borderColor: 'border-accent-rose/20',
      label: 'Falling'
    },
    stable: {
      icon: <Minus className="w-4 h-4" />,
      color: 'text-dark-400',
      bgColor: 'bg-dark-800',
      borderColor: 'border-dark-600',
      label: 'Stable'
    }
  };

  const config = trendConfig[trend];

  return (
    <div className={`bg-dark-850 border border-dark-700 rounded-xl p-4 hover:border-dark-600 transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium text-sm">{p.playerName}</h4>
            {p.isDifferentialPick && (
              <Sparkles className="w-3 h-3 text-accent-blue" />
            )}
            {p.isHiddenGem && (
              <Star className="w-3 h-3 text-amber-400" />
            )}
          </div>
          <p className="text-xs text-dark-400 mt-0.5">
            {p.team} • {p.role.replace('-', ' ')}
          </p>
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color} ${config.borderColor} border`}>
          {config.icon}
          <span>{changePercentage > 0 ? '+' : ''}{changePercentage}%</span>
        </div>
      </div>

      {/* AI Score */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-dark-700">
        <span className="text-xs text-dark-500">AI Score</span>
        <span className="text-lg font-bold text-primary-400 font-mono">
          {p.aiScore?.toFixed(1)}
        </span>
      </div>

      {/* Reason */}
      <p className="text-xs text-dark-300 leading-relaxed">{reason}</p>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dark-700">
        <div className="flex-1">
          <span className="text-xs text-dark-500 block">Form</span>
          <span className={`text-sm font-mono font-semibold ${p.recentForm >= 70 ? 'text-accent-emerald' : 'text-dark-300'}`}>
            {p.recentForm}
          </span>
        </div>
        <div className="flex-1">
          <span className="text-xs text-dark-500 block">Confidence</span>
          <span className="text-sm font-mono font-semibold text-primary-400">
            {p.aiConfidence}%
          </span>
        </div>
        <div className="flex-1">
          <span className="text-xs text-dark-500 block">Risk</span>
          <span className={`text-sm font-semibold capitalize ${
            p.riskLevel === 'low' ? 'text-accent-emerald' :
            p.riskLevel === 'high' ? 'text-accent-rose' : 'text-accent-amber'
          }`}>
            {p.riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
