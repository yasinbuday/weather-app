import "./Weather.css";
import { useState, useEffect } from "react";
import clearIcon from "../assets/clear.png";
import cloudIcon from "../assets/cloud.png";
import drizzleIcon from "../assets/drizzle.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";
import searchIcon from "../assets/search.png";

const Weather = () => {
  const Icons = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": cloudIcon,
    "03n": cloudIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  const search = async (city) => {
    if (!city) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${
        import.meta.env.VITE_APP_ID
      }&units=metric`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();

      const currentData = data.list[0];
      const dailyForecasts = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setCurrent({
        temp: Math.round(currentData.main.temp),
        icon: Icons[currentData.weather[0].icon] || Icons["01d"],
        city: data.city.name,
      });

      setForecast(dailyForecasts);
      setError(null);
    } catch (error) {
      console.error("Forecast fetch failed:", error);
      setError(error.message);
      setCurrent(null);
      setForecast([]);
    }
  };

  useEffect(() => {
    search("Istanbul");
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search(city);
    }
  };

  return (
    <div className="weather-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <img
          src={searchIcon}
          alt="search-btn"
          onClick={() => search(city)}
          style={{ cursor: "pointer" }}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {current && (
        <div className="current-weather">
          <img src={current.icon} alt="weather icon" className="weather-icon" />
          <p className="temperature">{current.temp}°C</p>
          <p className="city">{current.city}</p>
        </div>
      )}

      <div className="forecast-container">
        <h3>5-Day Forecast</h3>
        {forecast.length > 0 ? (
          <div className="forecast-grid">
            {forecast.map((item, index) => {
              const date = new Date(item.dt_txt);
              const day = date.toLocaleDateString("en-US", {
                weekday: "short",
              });
              return (
                <div key={index} className="forecast-day">
                  <p>{day}</p>
                  <img
                    src={Icons[item.weather[0].icon] || Icons["01d"]}
                    alt="forecast"
                  />
                  <p>{Math.round(item.main.temp)}°C</p>
                </div>
              );
            })}
          </div>
        ) : (
          !error && <p>Loading forecast...</p>
        )}
      </div>
    </div>
  );
};

export default Weather;
