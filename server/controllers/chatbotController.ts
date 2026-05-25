import { Request, Response, NextFunction } from 'express';
import { AppErrorClass } from '../middleware/errorHandler';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatWithBot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      throw new AppErrorClass('Message is required', 400);
    }

    // Generate response based on cricket knowledge
    const response = generateCricketResponse(message, context);

    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

function generateCricketResponse(message: string, context?: any): string {
  const lowerMessage = message.toLowerCase();

  // Match-related queries
  if (lowerMessage.includes('match') || lowerMessage.includes('game')) {
    if (lowerMessage.includes('today') || lowerMessage.includes('upcoming')) {
      return "Today's and upcoming matches are available on the Matches page. Select any match to generate your fantasy team!\n\nTip: Check the pitch report before finalizing your team - it can significantly impact player performance.";
    }
    if (lowerMessage.includes('predict') || lowerMessage.includes('chance')) {
      return "Our AI analyzes multiple factors including team form, venue history, and player statistics to predict match outcomes. However, cricket is unpredictable! Use predictions as guidance, not guarantees.\n\nKey factors we consider:\n- Team composition\n- Venue conditions\n- Player form\n- Head-to-head records";
    }
  }

  // Player-related queries
  if (lowerMessage.includes('player') || lowerMessage.includes('captain')) {
    if (lowerMessage.includes('captain')) {
      return "Choosing the right captain is crucial! Here are my tips:\n\n1. Choose a player in good recent form\n2. Consider their record at the venue\n3. All-rounders often make great captains (2x points!)\n4. Check if the pitch favors their style\n\nOur AI automatically selects the best captain based on these factors.";
    }
    if (lowerMessage.includes('batting') || lowerMessage.includes('batsman')) {
      return "For batting-friendly pitches, focus on top-order batsmen. They face more deliveries and have more chance to score big.\n\nRecommended minimum: 3-4 batsmen in your fantasy team.";
    }
    if (lowerMessage.includes('bowling') || lowerMessage.includes('bowler')) {
      return "Bowling picks depend on pitch conditions:\n\n- Spin-friendly tracks: Load up on spinners\n- Pace-friendly conditions: Pick pacers\n- Death over specialists: Great for fantasy points\n\nOur AI factors in pitch type when recommending bowlers.";
    }
  }

  // Team-related queries
  if (lowerMessage.includes('team') || lowerMessage.includes('fantasy')) {
    if (lowerMessage.includes('safe')) {
      return "Safe Team Strategy:\n- Focus on in-form players\n- Balance between both teams\n- Include consistent performers\n- Ideal for small leagues (1-10 members)\n\nSafe teams prioritize reliability over high-risk, high-reward picks.";
    }
    if (lowerMessage.includes('grand') || lowerMessage.includes('league')) {
      return "Grand League Team Strategy:\n- Take calculated risks\n- Include differential players\n- Consider pitch advantages\n- Perfect for large competitions\n\nGrand league teams need unique picks to rank high among thousands!";
    }
    if (lowerMessage.includes('balance') || lowerMessage.includes('composition')) {
      return "Ideal Team Composition:\n\n- Wicketkeeper: 1 (minimum)\n- Batsmen: 3-4\n- All-rounders: 2-3\n- Bowlers: 3-4\n\nMaximum 7 players from one team.\nOur AI ensures balanced composition for maximum fantasy points.";
    }
  }

  // Strategy queries
  if (lowerMessage.includes('strategy') || lowerMessage.includes('tip') || lowerMessage.includes('how')) {
    return "Fantasy Cricket Tips:\n\n1. Research the venue - pitch matters!\n2. Check player form and fitness\n3. Balance your team composition\n4. Pick in-form openers\n5. Include death over bowlers\n6. Choose captain wisely\n7. Monitor toss updates\n8. Create multiple teams for grand leagues\n\nUse our AI Team Generator for optimized picks!";
  }

  // Default response
  return "I'm your Fantasy Cricket AI Assistant! I can help you with:\n\n- Team selection strategies\n- Player recommendations\n- Pitch analysis\n- Match predictions\n- Fantasy tips and tricks\n\nAsk me anything about fantasy cricket, and I'll provide expert guidance!";
}
