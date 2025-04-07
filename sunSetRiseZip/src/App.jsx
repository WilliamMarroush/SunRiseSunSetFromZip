import { useState } from 'react'
import './App.css'

const zipInfoURL = "https://ctp-zip-code-api.onrender.com/zip/";
const riseSetInfoURL = "https://api.sunrise-sunset.org/json?";

function App() {
  const [inputMode, setInputMode] = useState("zip"); // "zip" or "coords"
  const [zip, setZip] = useState("");
  const [longLat, setLongLat] = useState({ long: "", lat: "" });
  const [date, setDate] = useState("today");
  const [riseSetData, setRiseSetData] = useState(null);
  const [error, setError] = useState("");

  const handleInputModeChange = (mode) => {
    setInputMode(mode);
    setRiseSetData(null);
    setError("");
  };

  const fetchLongLatFromZip = async () => {
    try {
      const response = await fetch(zipInfoURL + zip);
      const data = await response.json();
      if (data.length > 0) {
        const { Lat, Long } = data[0];
        setLongLat({ lat: Lat, long: Long });
        return { lat: Lat, long: Long };
      } else {
        throw new Error("Invalid zip code");
      }
    } catch (err) {
      setError("Failed to fetch long/lat from zip");
      return null;
    }
  };

  const fetchRiseSetData = async (lat, long) => {
    try {
      const response = await fetch(`${riseSetInfoURL}lat=${lat}&lng=${long}&date=${date}`);
      const data = await response.json();
      if (data.status === "OK") {
        setRiseSetData({
          sunrise: data.results.sunrise,
          sunset: data.results.sunset
        });
      } else {
        setError("Failed to get sunrise/sunset data.");
      }
    } catch (err) {
      setError("Error fetching sunrise/sunset info");
    }
  };

  const handleSubmit = async () => {
    setError("");
    let coords = { lat: longLat.lat, long: longLat.long };

    if (inputMode === "zip") {
      const fromZip = await fetchLongLatFromZip();
      if (!fromZip) return;
      coords = fromZip;
    }

    if (coords.lat && coords.long) {
      await fetchRiseSetData(coords.lat, coords.long);
    } else {
      setError("Latitude and Longitude are required");
    }
  };

  return (
    <div className="app">
      <h1>Sunrise & Sunset Times</h1>

      <div className="input-section">
        <label>
          <input
            type="radio"
            name="inputMode"
            checked={inputMode === "coords"}
            onChange={() => handleInputModeChange("coords")}
          />
          Use Latitude and Longitude
        </label>
        {inputMode === "coords" && (
          <div className="coords-inputs">
            <input
              type="text"
              placeholder="Latitude"
              value={longLat.lat}
              onChange={(e) => setLongLat({ ...longLat, lat: e.target.value })}
            />
            <input
              type="text"
              placeholder="Longitude"
              value={longLat.long}
              onChange={(e) => setLongLat({ ...longLat, long: e.target.value })}
            />
          </div>
        )}

        <label>
          <input
            type="radio"
            name="inputMode"
            checked={inputMode === "zip"}
            onChange={() => handleInputModeChange("zip")}
          />
          Use Zip Code
        </label>
        {inputMode === "zip" && (
          <div className="zip-input">
            <input
              type="text"
              placeholder="Zip Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        )}

        <div className="date-input">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Get Sunrise & Sunset</button>
      </div>

      {error && <p className="error">{error}</p>}

      {riseSetData && (
        <div className="results">
          <h3>Sunrise: {riseSetData.sunrise}</h3>
          <h3>Sunset: {riseSetData.sunset}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
