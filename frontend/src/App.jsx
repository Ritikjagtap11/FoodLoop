import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-green-700">
          FoodLoop
        </h1>

        <p className="mt-3 text-gray-600">
          Surplus Food Donation Platform
        </p>

        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App