import styles from './Button.module.css'

export default function Button({childen,onClick,type}) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
{childen}
    </button>
  )
}
