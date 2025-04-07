import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const zipInfoURL = "https://ctp-zip-code-api.onrender.com/zip/";
const riseSetInfoURL = "https://api.sunrise-sunset.org/json?";




function App() {
  const [count, setCount] = useState(0)
  const [longLat, setLongLat] = useState({long: "0", lat: "0"});
  const [zip, setZip] = useState("00000");
  const [date,setDate] = useState("2023-01-01");
  const [riseSetData, setRiseSetData] = useState(null);

  function getLongLatData(zip){
    const response = fetch(zipInfoURL + zip);
    const data = response.json()[0];
    setLongLat({long: data.Long, lat: data.Lat});
  }

  function getRiseSetData(long, lat, date){
    if (date == null){
      date = "today";}
    const respone = fetch(riseSetInfoURL + "lat="+lat+"&lng="+long+"&date="+date);
    const data = response.json();
    setRiseSetData([data.sunrise, data.sunset]);
  }

  function displayRiseSetData(){
    return(
      <>
        <h3>Sunrise: </h3>
        <h3>Sunset: </h3>
      </>
    );
  }

  return (
    <>
      <div className = "title-box">
        <h1>sunset and sunrise times based off zip (or location vals)</h1>
      </div>
      <div className = "Input Options">
        <div className = "longLatOptions">
          <input
            type='radio'
            name='longandlat'
          /><p>Longitude and Latitude</p>
          <input
          type = 'text'
          name = 'long'
          />
          <input
          type = 'text'
          name = 'lat'
          />
        </div>
        <div className = "zipOptions">
          <input
          type = 'radio'
          name = 'ziponly'
          /><p>Zip Code Alone</p>
          <input
          type = 'text'
          name = 'zip'
          />
        </div>
      </div>
    </>
  )
}
export default App
