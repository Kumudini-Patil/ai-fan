# FantasyAI Cricket Team Builder

An AI-powered Fantasy Cricket Team Builder web application that helps users generate optimal fantasy XI teams using advanced machine learning algorithms.

## Features

- **AI Team Generator**: Advanced algorithms analyze player form, pitch conditions, venue statistics, and match dynamics to generate optimal teams
- **Multiple Team Types**: Safe teams for small leagues, balanced teams, and high-risk grand league teams
- **Pitch Analysis**: Detailed pitch reports with spin/pace factors and predicted scores
- **Match Predictions**: AI-powered match outcome predictions
- **Player Statistics**: Comprehensive player performance tracking and analytics
- **Interactive Chatbot**: AI assistant to answer fantasy cricket queries
- **Admin Dashboard**: Manage players, matches, venues, and statistics
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Theme UI**: Modern glassmorphism design with smooth animations

## Tech Stack

### Frontend
- React.js 18 with TypeScript
- Vite (Build tool)
- Tailwind CSS
- React Router v7
- TanStack Query (React Query)
- Chart.js & React Chart.js 2
- Axios
- Lucide React Icons
- Date-fns

### Backend
- Node.js
- Express.js
- TypeScript
- Supabase (PostgreSQL database)
- JWT Authentication
- Bcryptjs

## AI Engine

The AI Team Generator uses a sophisticated scoring algorithm:

```
PlayerScore = (RecentForm × 0.4) + (PitchFit × 0.2) + (VenueRecord × 0.2) + (FantasyAverage × 0.2)
```

### Team Selection Rules
- Maximum 11 players
- Minimum 1 wicketkeeper
- Minimum 3 batsmen
- Minimum 2 all-rounders
- Minimum 3 bowlers
- Maximum 7 players from one team

### Captain Selection
- Prefers all-rounders for captain (2x points)
- Vice-captain from opposing team (1.5x points)
- Based on highest AI score and consistency

## Project Structure

```
project/
├── server/                  # Backend
│   ├── ai-engine/          # AI Team Generator
│   │   └── teamGenerator.ts
│   ├── config/             # Configuration
│   │   ├── config.ts
│   │   └── database.ts
│   ├── controllers/        # Route Controllers
│   │   ├── authController.ts
│   │   ├── matchController.ts
│   │   ├── playerController.ts
│   │   ├── teamController.ts
│   │   ├── venueController.ts
│   │   ├── adminController.ts
│   │   └── chatbotController.ts
│   ├── middleware/          # Express Middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/              # API Routes
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── matchRoutes.ts
│   │   ├── playerRoutes.ts
│   │   ├── teamRoutes.ts
│   │   ├── venueRoutes.ts
│   │   ├── adminRoutes.ts
│   │   └── chatbotRoutes.ts
│   └── app.ts              # Express App Entry
│
├── src/                    # Frontend
│   ├── components/         # React Components
│   │   ├── charts/        # Chart Components
│   │   │   ├── TeamCompositionChart.tsx
│   │   │   ├── PlayerFormChart.tsx
│   │   │   └── FantasyScoreChart.tsx
│   │   ├── ui/            # UI Components
│   │   │   └── Loading.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PlayerCard.tsx
│   │   └── Chatbot.tsx
│   ├── context/           # React Context
│   │   └── AuthContext.tsx
│   ├── layouts/           # Page Layouts
│   │   └── Layout.tsx
│   ├── lib/               # Libraries
│   │   └── supabase.ts
│   ├── pages/             # Page Components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── MatchesPage.tsx
│   │   ├── MatchDetailPage.tsx
│   │   ├── GenerateTeamPage.tsx
│   │   ├── MyTeamsPage.tsx
│   │   ├── StatsPage.tsx
│   │   └── AdminDashboard.tsx
│   ├── services/          # API Services
│   │   └── api.ts
│   ├── App.tsx           # Main App
│   ├── main.tsx          # Entry Point
│   └── index.css         # Global Styles
│
├── .env.example          # Environment Variables Template
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind Configuration
├── tsconfig.json         # TypeScript Configuration
└── vite.config.ts       # Vite Configuration
```

## Database Schema

### Tables

1. **users**: User accounts and authentication
2. **players**: Cricket player information
3. **venues**: Stadium/venue details
4. **matches**: Match schedules and results
5. **player_stats**: Player performance statistics
6. **fantasy_scores**: Historical fantasy points
7. **saved_teams**: User-generated teams
8. **pitch_reports**: Pitch analysis data

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/fantasy-ai-cricket.git
cd fantasy-ai-cricket
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a new Supabase project at [supabase.com](https://supabase.com)
- Copy your project URL and anon key from Settings > API

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

5. **Run database migrations**
The migrations will be automatically applied when you deploy to Supabase.

### Running the Application

**Development mode (Frontend only)**
```bash
npm run dev
```

**Development mode (Backend only)**
```bash
npm run dev:server
```

**Development mode (Both frontend and backend)**
```bash
npm run dev:all
```

**Production build**
```bash
npm run build
```

**Preview production build**
```bash
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `GET /api/matches/:id/pitch-report` - Get pitch report
- `GET /api/matches/:id/prediction` - Get match prediction

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `GET /api/players/:id/stats` - Get player stats
- `GET /api/players/:id/form` - Get player form
- `GET /api/players/match/:matchId` - Get players by match

### Teams
- `POST /api/teams/generate` - Generate AI team
- `POST /api/teams/save` - Save team (protected)
- `GET /api/teams/saved` - Get saved teams (protected)
- `GET /api/teams/saved/:id` - Get saved team (protected)
- `DELETE /api/teams/saved/:id` - Delete team (protected)

### Admin (requires admin role)
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/players` - Add player
- `PUT /api/admin/players/:id` - Update player
- `DELETE /api/admin/players/:id` - Delete player
- Similar routes for venues, matches, and stats

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI assistant

## Features in Detail

### AI Team Generation
1. Select a match from upcoming fixtures
2. Choose team type:
   - **Safe**: Conservative picks for small leagues
   - **Balanced**: Mix of safe and risky picks
   - **Grand League**: High-risk differentials for big winnings
3. AI generates optimal XI with:
   - Best captain and vice-captain
   - Balanced team composition
   - Maximum 7 players per team
   - Automatic role distribution

### Pitch Analysis
- Pitch type (spin-friendly, pace-friendly, batting-friendly)
- Spin and pace factors (0-1 scale)
- Average first innings score
- Weather conditions
- Detailed analysis text

### Match Predictions
- Win probability for each team
- Key factors affecting the match
- Toss importance rating
- Venue-specific insights

### Interactive Chatbot
- Captain selection tips
- Team building strategies
- Pitch analysis explanations
- Fantasy cricket guidance

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy server folder
3. Update frontend API URL

### Database
- Use Supabase managed PostgreSQL
- Automatic backups and scaling
- Built-in authentication support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Cricket data inspired by ESPN Cricinfo, Cricbuzz, and Dream11
- Icons provided by Lucide React
- Charts powered by Chart.js
- Database hosted on Supabase

## Support

For support, please open an issue on GitHub or contact the development team.
