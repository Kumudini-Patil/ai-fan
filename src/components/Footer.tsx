export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg font-mono">F</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Fantasy</span>
                <span className="text-primary-400 font-bold text-lg">AI</span>
              </div>
            </div>
            <p className="text-dark-400 text-sm max-w-md leading-relaxed">
              Generate winning fantasy cricket teams with AI-powered analysis.
              Advanced algorithms analyze player form, pitch conditions, and venue statistics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/matches" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  Upcoming Matches
                </a>
              </li>
              <li>
                <a href="/my-teams" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  My Teams
                </a>
              </li>
              <li>
                <a href="/stats" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  Statistics
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8">
          <p className="text-center text-dark-500 text-sm">
            © {new Date().getFullYear()} FantasyAI Cricket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
