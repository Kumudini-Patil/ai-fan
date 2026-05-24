import { FantasyTip } from '../../types';
import { Shield, Zap, Sparkles, Star, AlertTriangle } from 'lucide-react';

interface FantasyTipsCardProps {
  tip: FantasyTip;
}

export default function FantasyTipsCard({ tip }: FantasyTipsCardProps) {
  const typeConfig = {
    strategy: {
      icon: <Shield className="w-5 h-5" />,
      color: 'text-primary-400',
      bgColor: 'bg-primary-400/10',
      borderColor: 'border-primary-400/20'
    },
    captain: {
      icon: <Star className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20'
    },
    differential: {
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10',
      borderColor: 'border-accent-blue/20'
    },
    safe: {
      icon: <Shield className="w-5 h-5" />,
      color: 'text-accent-emerald',
      bgColor: 'bg-accent-emerald/10',
      borderColor: 'border-accent-emerald/20'
    },
    risky: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-accent-rose',
      bgColor: 'bg-accent-rose/10',
      borderColor: 'border-accent-rose/20'
    }
  };

  const config = typeConfig[tip.type];

  return (
    <div className={`bg-dark-850 border border-dark-700 rounded-xl p-4 hover:border-dark-600 transition-all`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
          <div className={config.color}>{config.icon}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium text-sm">{tip.title}</h4>
            {tip.priority === 'high' && (
              <span className="px-2 py-0.5 text-xs rounded bg-accent-rose/10 text-accent-rose border border-accent-rose/20">
                High Priority
              </span>
            )}
          </div>
          <p className="text-xs text-dark-400 leading-relaxed">{tip.description}</p>

          {tip.playerSuggestion && (
            <div className="mt-2 pt-2 border-t border-dark-700">
              <span className="text-xs text-dark-500">Suggested: </span>
              <span className="text-xs text-primary-400 font-medium">{tip.playerSuggestion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
