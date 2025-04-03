import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const zipInfoURL = "https://ctp-zip-code-api.onrender.com/zip/";
const riseSetInfoURL = "https://api.sunrise-sunset.org/json?";

function App() {
  const [count, setCount] = useState(0)

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
