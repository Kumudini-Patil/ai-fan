import { useState } from 'react';
import { AIPlayerInsight } from '../../types';
import { Badge } from '../ui/Loading';
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  AlertTriangle,
  Shield,
  Target,
  Zap,
  Star,
  Info
} from 'lucide-react';

interface AIInsightCardProps {
  insight: AIPlayerInsight;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  compact?: boolean;
}

export default function AIInsightCard({
  insight,
  isCaptain = false,
  isViceCaptain = false,
  compact = false
}: AIInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const riskColors = {
    low: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    medium: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    high: 'text-accent-rose bg-accent-rose/10 border-accent-rose/20'
  };

  const formIndicator = getFormIndicator(insight.recentForm);

  return (
    <div
      className={`relative bg-dark-850 rounded-xl border transition-all duration-300 overflow-hidden ${
        isCaptain
          ? 'border-primary-500/50 ring-2 ring-primary-500/20 shadow-glow'
          : isViceCaptain
          ? 'border-amber-500/50 ring-2 ring-amber-500/20'
          : insight.isDifferentialPick
          ? 'border-accent-blue/30'
          : 'border-dark-700 hover:border-dark-600'
      }`}
    >
      {/* Captain/Vice-Captain Badge */}
      {(isCaptain || isViceCaptain) && (
        <div
          className={`absolute -top-0 -right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${
            isCaptain
              ? 'bg-primary-600 text-white'
              : 'bg-amber-600 text-white'
          }`}
        >
          {isCaptain ? '2x Captain' : '1.5x VC'}
        </div>
      )}

      {/* Header Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Player Name & Team */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold">{insight.playerName}</h3>
              {(insight.isDifferentialPick || insight.isHiddenGem) && (
                <div className="flex items-center gap-1">
                  {insight.isDifferentialPick && (
                    <span className="flex items-center gap-0.5 text-xs text-accent-blue" title="Low selection, high potential">
                      <Sparkles className="w-3 h-3" />
                      Differential
                    </span>
                  )}
                  {insight.isHiddenGem && (
                    <span className="flex items-center gap-0.5 text-xs text-accent-emerald">
                      <Star className="w-3 h-3" />
                      Hidden Gem
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-dark-400">
              <span>{insight.team}</span>
              <span>•</span>
              <span className="capitalize">{insight.role.replace('-', ' ')}</span>
            </div>
          </div>

          {/* AI Score */}
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400 font-mono">
              {insight.aiScore?.toFixed(1)}
            </div>
            <div className="text-xs text-dark-500">AI Score</div>
          </div>
        </div>

        {/* Primary Reason */}
        <div className="bg-dark-800/50 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-dark-200 leading-relaxed">{insight.primaryReason}</p>
          </div>
        </div>

        {/* Quick Stats */}
        {!compact && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {/* Recent Form */}
            <div className="text-center p-2 bg-dark-800 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                {formIndicator.icon}
              </div>
              <div className="text-xs text-dark-400">Form</div>
              <div className="text-sm font-semibold text-white font-mono">
                {insight.recentForm}
              </div>
            </div>

            {/* Venue */}
            <div className="text-center p-2 bg-dark-800 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Target className={`w-4 h-4 ${insight.venuePerformance >= 70 ? 'text-accent-emerald' : 'text-dark-500'}`} />
              </div>
              <div className="text-xs text-dark-400">Venue</div>
              <div className="text-sm font-semibold text-white font-mono">
                {insight.venuePerformance}
              </div>
            </div>

            {/* Consistency */}
            <div className="text-center p-2 bg-dark-800 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Shield className={`w-4 h-4 ${insight.consistency >= 70 ? 'text-accent-emerald' : 'text-dark-500'}`} />
              </div>
              <div className="text-xs text-dark-400">Consist.</div>
              <div className="text-sm font-semibold text-white font-mono">
                {insight.consistency}
              </div>
            </div>

            {/* AI Confidence */}
            <div className="text-center p-2 bg-dark-800 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Sparkles className="w-4 h-4 text-primary-400" />
              </div>
              <div className="text-xs text-dark-400">Confidence</div>
              <div className="text-sm font-semibold text-primary-400 font-mono">
                {insight.aiConfidence}%
              </div>
            </div>
          </div>
        )}

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full border ${riskColors[insight.riskLevel]}`}>
            {insight.riskLevel === 'low' ? (
              <><Shield className="w-3 h-3 inline mr-1" />Low Risk</>
            ) : insight.riskLevel === 'high' ? (
              <><AlertTriangle className="w-3 h-3 inline mr-1" />High Risk</>
            ) : (
              <>Medium Risk</>
            )}
          </span>

          {insight.predictedPoints && (
            <span className="text-xs px-2 py-1 rounded-full border border-dark-600 text-dark-300">
              Predicted: {insight.predictedPoints} pts
            </span>
          )}

          {insight.differentialPercentage && (
            <span className="text-xs px-2 py-1 rounded-full border border-accent-blue/20 text-accent-blue bg-accent-blue/10">
              Selected by {insight.differentialPercentage}%
            </span>
          )}
        </div>

        {/* Key Factors */}
        <div className="space-y-1.5 mb-3">
          {insight.keyFactors.slice(0, compact ? 2 : 3).map((factor, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-dark-300">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              {factor}
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {!compact && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full py-2 text-xs text-dark-400 hover:text-white transition-colors gap-1"
          >
            {isExpanded ? (
              <>
                Hide Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show Details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && !compact && (
        <div className="px-4 pb-4 space-y-4 border-t border-dark-700 pt-4">
          {/* Detailed Explanation */}
          <div>
            <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
              Why Selected?
            </h4>
            <p className="text-sm text-dark-200 leading-relaxed">
              {insight.detailedExplanation}
            </p>
          </div>

          {/* Match Impact */}
          <div className="grid grid-cols-2 gap-4">
            {insight.weatherImpact && insight.weatherImpact !== 'neutral' && (
              <div>
                <h5 className="text-xs text-dark-500 mb-1">Weather Impact</h5>
                <span className={`text-sm ${insight.weatherImpact === 'positive' ? 'text-accent-emerald' : 'text-accent-rose'}`}>
                  {insight.weatherImpact === 'positive' ? 'Favorable' : 'May affect performance'}
                </span>
              </div>
            )}

            {insight.tossImpact && insight.tossImpact !== 'neutral' && (
              <div>
                <h5 className="text-xs text-dark-500 mb-1">Toss Impact</h5>
                <span className="text-sm text-accent-emerald">
                  {insight.tossImpact === 'positive' ? 'Benefits from toss' : 'Neutral'}
                </span>
              </div>
            )}
          </div>

          {/* Historical Record */}
          {insight.historicalRecord && (
            <div className="bg-dark-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-dark-200">{insight.historicalRecord}</span>
              </div>
            </div>
          )}

          {/* Opponent Weakness */}
          {insight.opponentWeakness && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-primary-300">{insight.opponentWeakness}</span>
              </div>
            </div>
          )}

          {/* Captain/Vice Captain Potential */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dark-400">Captain Potential</span>
                <span className="text-sm font-mono font-semibold text-primary-400">
                  {insight.captainPotential}%
                </span>
              </div>
              <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${insight.captainPotential}%` }}
                />
              </div>
            </div>

            <div className="bg-dark-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dark-400">VC Potential</span>
                <span className="text-sm font-mono font-semibold text-amber-400">
                  {insight.viceCaptainPotential}%
                </span>
              </div>
              <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${insight.viceCaptainPotential}%` }}
                />
              </div>
            </div>
          </div>

          {/* Last Match Performance */}
          {insight.lastMatchPoints !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Last Match</span>
              <span className="font-mono font-semibold text-white">
                {insight.lastMatchPoints} pts
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getFormIndicator(form: number) {
  if (form >= 75) {
    return {
      icon: <TrendingUp className="w-4 h-4 text-accent-emerald" />,
      label: 'Excellent'
    };
  } else if (form >= 50) {
    return {
      icon: <Minus className="w-4 h-4 text-accent-amber" />,
      label: 'Good'
    };
  } else {
    return {
      icon: <TrendingDown className="w-4 h-4 text-accent-rose" />,
      label: 'Below Average'
    };
  }
}
