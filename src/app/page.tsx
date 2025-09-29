// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ollie Does Is
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Portfolio under construction 🚀
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
          Building something awesome...
        </div>
      </div>
    </div>
  );
}