import React, { useState } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function PredictPrice() {
  const [dayOfYear, setDayOfYear] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [grade, setGrade] = useState("")
  const [market, setMarket] = useState("")
  const [commodity, setCommodity] = useState("")
  const [variety, setVariety] = useState("")
  const [state, setState] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const [modalPrice, setModalPrice] = useState("")
  const [predictedPrice, setPredictedPrice] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [isPrediciting, setIsPredicting] = useState(false)
  const generateChartData = (basePrice) => {
    const days = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`)
    const prices = days.map((_, i) =>
      (basePrice * (1 + (Math.random() * 0.05 - 0.02))).toFixed(2)
    )

    return {
      labels: days,
      datasets: [
        {
          label: "Predicted Price (₹)",
          data: prices,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4
        }
      ]
    }
  }

  const handlePredict = async () => {
    setIsPredicting(true)
    try {
      const response = await axios.post("https://farmhelpbackend.onrender.com/predict", {
        dayOfYear: parseInt(dayOfYear),
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        grade,
        market,
        commodity,
        variety,
        state,
        arrivalDate,
      })
      
      setIsPredicting(false)
      const price = response.data.predictedPrice
      setPredictedPrice(price)
      
      const chartData = generateChartData(price)
      setChartData(chartData)
    } catch (error) {
      console.error("Error predicting price:", error)
    }
  }

  return (
    <div className="h-auto bg-white text-white flex items-center justify-center">
      <div className=" bg-[#3b82f6] p-8 rounded-xl shadow-lg space-y-6 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-6">Predict Price</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
          <input
            
            type="number"
            placeholder="Day of Year"
            value={dayOfYear}
            onChange={(e) => setDayOfYear(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
            
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="text"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="text"
            placeholder="Market"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="text"
            placeholder="Commodity"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="text"
            placeholder="Variety"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
          <input
            type="date"
            placeholder="Arrival Date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            className="w-full p-3 rounded bg-white text-[#3b82f6]"
          />
        </div>
        <button
          onClick={handlePredict}
          className="w-full bg-white p-3 rounded text-[#3b82f6] font-bold hover:bg-blue-600 hover:text-white transition"
          disabled={isPrediciting}
        >
          {isPrediciting? "Predicting...." : "Predict Price"}
        </button>
        {predictedPrice !== null && (
          <div className="text-green-400 text-center mt-4 text-xl">
            Predicted Price: ₹{parseFloat(predictedPrice).toFixed(2)}
          </div>
        )}

        {chartData && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6 mb-14">
            <h2 className="text-2xl font-bold text-center mb-4">Price Trend Based on Prediction</h2>
            <div className="w-full h-72">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictPrice