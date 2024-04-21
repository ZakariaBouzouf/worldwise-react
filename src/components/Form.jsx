import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useUrlPosition } from '../hooks/useUrlPosition'
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from './BackButton';
import Spinner from './Spinner'
import Message from './Message'
import { useCities } from "../contexts/CitiesContext";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {
  const [lat, lng] = useUrlPosition()
  const { createCity, isLoading } = useCities()
  const navigate = useNavigate()

  const [cityName, setCityName] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState()
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState('')
  const [geocondingError, setGeoCodingError] = useState()

  useEffect(function() {
    if (!lat || !lng) return
    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true)
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()

        if (!data.countryCode) throw new Error("That doesn't seem to be a city.")
        setCityName(data.city || data.locality || '')
        setCountry(data.country)
        setEmoji(convertToEmoji(data.countryCode))
      } catch (err) {
        console.log(err)
        setGeoCodingError(err.message)
      } finally {
        setIsLoadingGeocoding(false)
      }
    }
    fetchCityData()
  }, [lat, lng])

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      }
    }
    createCity(newCity)
    navigate("/app")
  }

  if (isLoadingGeocoding) return <Spinner />

  if (!lat && !lng) return <Message messages="Start by clicking somewhere on the map." />

  if (geocondingError) return <Message messages={geocondingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker onChange={date => setDate(date)} selected={date} dateFormat='dd/MM/yyyy' />
        {/* <input */}
        {/*   id="date" */}
        {/*   onChange={(e) => setDate(e.target.value)} */}
        {/*   value={date} */}
        {/* /> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
