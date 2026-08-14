import React, { useEffect, useState } from 'react';
import { MapPin, TrendingUp, Users, Home, ArrowRight, AlertCircle } from 'lucide-react';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // SEO Update
    document.title = "404 - Page Not Found | How Many of Me Are There?";
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600">
          <Users className="w-6 h-6" />
          <span>howmanyofme<span className="text-slate-400">.co</span></span>
        </a>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className={`max-w-3xl w-full text-center transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Error Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-8 border border-red-100 shadow-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Error 404: Page Not Found</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Oops! This page is <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">lost in the crowd.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            We couldn't find the page you were looking for, but we can help you find out how many people share your name!
          </p>

          {/* Primary CTA Box - Redirects to Homepage */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-blue-100 border border-slate-100 max-w-md mx-auto mb-16 transition-all hover:shadow-blue-200/50">
            <h3 className="text-xl font-bold mb-2 text-slate-800">
              Check How Common Your Name Is
            </h3>
            <p className="text-slate-500 mb-8 text-sm">
              Calculate popularity, rarity, and view state-wise breakdowns on our homepage.
            </p>
            <a 
              href="/" 
              className="inline-flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-300 transform hover:-translate-y-1 active:scale-95"
            >
              CHECK NOW
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Value Proposition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-50 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-blue-600 w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">State-wise Data</h4>
              <p className="text-xs text-slate-500">See name density across different regions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-50 shadow-sm">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-purple-600 w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Yearly Trends</h4>
              <p className="text-xs text-slate-500">Track popularity over the last 100 years.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-50 shadow-sm">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-green-600 w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Age & Gender</h4>
              <p className="text-xs text-slate-500">Demographic breakdowns for every name.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Secondary Action */}
      <footer className="p-8 text-center border-t border-slate-100">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-medium text-sm"
        >
          <Home className="w-4 h-4" />
          Go to Homepage
        </a>
        <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-[0.2em] font-bold">
          How Many of Me Are There? Name Popularity Checker
        </p>
      </footer>
    </div>
  );
};

export default App;
