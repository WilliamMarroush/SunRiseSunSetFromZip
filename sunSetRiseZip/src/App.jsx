import { useState } from 'react'
import './App.css'

const zipInfoURL = "https://ctp-zip-code-api.onrender.com/zip/";
const riseSetInfoURL = "https://api.sunrise-sunset.org/json?";

function App() {
  const [inputMode, setInputMode] = useState("zip");
  const [zip, setZip] = useState("");
  const [longLat, setLongLat] = useState({ long: "", lat: "" });
  const [date, setDate] = useState("today");
  const [riseSetData, setRiseSetData] = useState(null);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");

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
        setLocation(data[0].City);
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

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    handleSubmit();     // Trigger main logic
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Sunrise & Sunset Times</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="card p-4 mb-3">
          {/* ZIP OPTION */}
          <div className="row align-items-center mb-3">
            <div className="col-auto">
              <input
                className="form-check-input"
                type="radio"
                name="inputMode"
                id="zipRadio"
                checked={inputMode === "zip"}
                onChange={() => handleInputModeChange("zip")}
              />
              <label className="form-check-label ms-2" htmlFor="zipRadio">
                Use Zip Code
              </label>
            </div>
            {inputMode === "zip" && (
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Zip Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* COORDS OPTION */}
          <div className="row align-items-center mb-3">
            <div className="col-auto">
              <input
                className="form-check-input"
                type="radio"
                name="inputMode"
                id="coordsRadio"
                checked={inputMode === "coords"}
                onChange={() => handleInputModeChange("coords")}
              />
              <label className="form-check-label ms-2" htmlFor="coordsRadio">
                Use Latitude & Longitude
              </label>
            </div>
            {inputMode === "coords" && (
              <div className="col">
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Latitude"
                      value={longLat.lat}
                      onChange={(e) => setLongLat({ ...longLat, lat: e.target.value })}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Longitude"
                      value={longLat.long}
                      onChange={(e) => setLongLat({ ...longLat, long: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DATE */}
          <div className="mb-3">
            <label htmlFor="dateInput" className="form-label">Date:</label>
            <input
              type="date"
              id="dateInput"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="btn btn-primary">
            Get Sunrise & Sunset
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {riseSetData && (
        <div className="card p-4 text-center">
          <h2 className="mb-3">Location: {location}</h2>
          <h3>Sunrise: {riseSetData.sunrise}</h3>
          <h3>Sunset: {riseSetData.sunset}</h3>
        </div>
      )}

      <p className="position-fixed bottom-0 end-0 m-3 text-muted small">
        Caution: Return is formatted in UTC (Coordinated Universal Time). Not your current timezone.
      </p>
    </div>
  );
}

export default App;
