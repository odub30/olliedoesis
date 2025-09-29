export default function TestStyling() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Styling Test</h1>
        <p className="text-gray-600">If you see colors and styling here, Tailwind is working properly.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}