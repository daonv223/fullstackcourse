import axios from 'axios'
import { useEffect, useState } from 'react'

const Weather = ({ weather }) => {
  if (weather === undefined) return null
  else return (
    <>
      <p>temperature {Math.round((weather.main.temp - 273.15) * 100)/100} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </>
  )
}

const Country = ({ country }) => {
  if (country === null) return null
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <p><strong>languages:</strong></p>
      <ul>
        {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital[0]}</h2>
      <Weather weather={country.weather} />
    </div>
  )
}

const Countries = ({ countries, onShowCountry }) => {
  if (countries.length > 10) return <p>Too many matches, specify another filter</p>
  if (countries.length === 1) {
    return null
  }
  return (
    <>
      {countries.map(country => <p key={country.cca2}>{country.name.common} <button type="button" onClick={() => onShowCountry(country)}>show</button></p>)}
    </>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setAllCountries(response.data))
  }, [])

  useEffect(() => {
    const result = query === '' ? [] : allCountries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()))
    setCountries(result)
    if (result.length === 1) setCountry(result[0])
    else setCountry(null)
  }, [query, allCountries])

  useEffect(() => {
    if (country !== null) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${import.meta.env.VITE_WEATHER_KEY}`)
        .then(response => {
          setCountry({ ...country, weather: response.data })
        })
        .catch(error => {
          console.log(error.message)
        })
    }
  }, [country])

  const handleShowCountry = (country) => {
    setCountry({...country})
  }

  return (
    <div>
      find countries <input value={query} onChange={event => setQuery(event.target.value)}/>
      <Countries countries={countries} onShowCountry={handleShowCountry} />
      <Country country={country} />
    </div>
  )
}

export default App
