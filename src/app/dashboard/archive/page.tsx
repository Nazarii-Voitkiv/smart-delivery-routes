import Link from "next/link";

export default function Archive() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Archiwum</h1>
          <p className="text-gray-500 mt-1">Przeglądaj historię zakończonych dostaw</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Brak zarchiwizowanych dostaw</h2>
          <p className="text-gray-500 max-w-md mx-auto">Wszystkie zakończone dostawy pojawią się w tym miejscu po ich zarchiwizowaniu.</p>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do panelu
          </Link>
        </div>
      </div>
    </div>
  );
}
