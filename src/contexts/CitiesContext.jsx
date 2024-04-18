import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = 'http://localhost:8000'

const CitiesContext = createContext()

function CitiesProvider({ children }) {

  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json()
        setCities(data)
        console.log(data)
      } catch (e) {
        alert("Problem")
      } finally { setIsLoading(false) }
    }
    fetchCities()
  }, [])

  return <CitiesContext.Provider value={{
    cities,
    isLoading
  }}
  >
    {children}
  </CitiesContext.Provider>
}

function useCities(){
  const context = useContext(CitiesContext)
  if(context ===undefined) throw new Error('CitiesContext was used outside the CitiesProviders')
  return context
}

export {CitiesProvider,useCities}
