import styles from './CountryList.module.css'
import Spinner from './Spinner'
import Message from './Message'
import CountryItem from './CountryItem'
import { useCities } from '../contexts/CitiesContext'

export default function CountryList() {
  const { cities, isLoading } = useCities()
  if (isLoading) return <Spinner />

  if (!cities.length) return <Message messages="Add your city by clicking on the map." />

  const countries = cities.reduce((arr, city) => {
    if (!arr.map(el => el.city).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }]
    } else return arr;
  }, []);
  console.log(countries)

  return (
    <ul className={styles.countryList}>{countries.map(country => <CountryItem country={country} key={country.country} />)}</ul>
  )
}
