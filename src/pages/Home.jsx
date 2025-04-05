import React, { useState, useEffect } from "react";
import { FaTint, FaCloudRain, FaSeedling, FaTemperatureHigh, FaWind } from "react-icons/fa";
import "../css/Home.css"; 

const Home = () => {
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState(""); 
  const [state, setState] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [shouldFetchWeather, setShouldFetchWeather] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language"));
  const [weather, setWeather] = useState({
    temperature: "N/A",
    humidity: "N/A",
    rainChance: "N/A",
    windSpeed: "N/A",
    forecast: "N/A",
  });

  useEffect(() => {
    if (shouldFetchWeather && city.trim() && state.trim()) {
      fetchWeather();
      setShouldFetchWeather(false);
    }
  }, [shouldFetchWeather, city]);

  const fetchWeather = async () => {
    try {
      const response = await fetch("https://farmhelpbackend.onrender.com/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchWeather: `${city} ${state}` }),
      });

      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();
      setWeather({
        temperature: data.temperature,
        humidity: data.humidity,
        rainChance: data.rainChance,
        windSpeed: data.windSpeed,
        forecast: data.forecast,
      });
      fetchInsights(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data. Please try again.");
    }
  };
  const handleSubmit = () => {
    if (city.trim() && state.trim()) {
      localStorage.setItem("language", language);
      setShowPopup(false);
      setShouldFetchWeather(true);
    } else {
      alert("Please enter a valid city and state.");
    }
  };
  const fetchInsights = async (weatherData) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://farmhelpbackend.onrender.com/farming-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          weather_summary: `Temperature: ${weatherData.temperature}°C, Humidity: ${weatherData.humidity}%, Rain Chance: ${weatherData.rainChance}%, Wind Speed: ${weatherData.windSpeed}km/h, Forecast: ${weatherData.forecast}`,
          language,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch insights");
      const data = await response.json();
      setInsights(data.farming_insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setInsights("Error fetching insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="popup-box-title">Enter Your District, State and Language</h2>
            <input
              type="text"
              placeholder="Enter district name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="city-input"
            />
            <input
              type="text"
              placeholder="Enter state name"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="city-input"
            />
            <input
              type="text"
              placeholder="Enter Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="city-input"
            />
            <button
              className="popup-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="weather-section">
        <h1 className="weather-title">Current Weather in {`${city}, ${state}` || "Your City"}</h1>
        <p>Current Forecast: {weather.forecast || "N/A"}</p>
        <div className="weather-info">
          <WeatherItem icon={<FaTemperatureHigh />} label="Temperature" value={weather.temperature} />
          <WeatherItem icon={<FaTint  />} label="Humidity" value={weather.humidity} />
          <WeatherItem icon={<FaCloudRain />} label="Rain Chance" value={weather.rainChance} />
          <WeatherItem icon={<FaWind />} label="Wind Speed" value={weather.windSpeed} />
        </div>
      </div>

      <div className="insights-container">
        {isLoading ? (
          <p>Loading insights...</p>
        ) : insights ? (
          <InsightCard icon={<FaSeedling />} city={city} description={insights} />
        ) : (
          <p>No insights available.</p>
        )}
      </div>
    </div>
  );
};

const WeatherItem = ({ icon, label, value }) => (
  <div className="weather-item">
    <span className="weather-icon">{icon}</span>
    <span>{value} {label}</span>
  </div>
);

const InsightCard = ({ icon, city, description }) => {
  const formatText = (text) => {
    const lines = text.split("\n");
    const formattedLines = [];
    let listItems = [];

    lines.forEach((line, index) => {
        line = line.replace(/^\*\s+/, "- ");
        line = line.replace(/:\*\s?/g, ":");

        if (/^\*\*\d+\.\s(.*?)\*\*/.test(line)) {
            if (listItems.length) {
                formattedLines.push(<ul key={`list-${index}`}>{listItems}</ul>);
                listItems = [];
            }
            formattedLines.push(<h2 key={index} className="green">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</h2>);
        } else if (/\* *(.*?)\*/.test(line)) {
            const formattedLine = line.replace(/\*\*(.*?)\*:?/g, (_, match) => `<b class='green'>${match}</b>`);

            formattedLines.push(
                <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
            );
        } else if (/^[*]\s+/.test(line)) {
            listItems.push(<li key={index}>{line.replace(/^[*]\s */, ' ')}</li>);
        } else {
            if (listItems.length) {
                formattedLines.push(<ul key={`list-${index}`}>{listItems}</ul>);
                listItems = [];
            }
            formattedLines.push(<p key={index}>{line}</p>);
        }
    });

    if (listItems.length) {
        formattedLines.push(<ul key="last-list">{listItems}</ul>);
    }

    return formattedLines;
};
  
  return(
  <div className="insight-card">
    
    <h2 className="insight-title green">{icon} Farming Insights for {city}</h2>
    <div>{formatText(description)}</div>
  </div>
  )
};

export default Home;
