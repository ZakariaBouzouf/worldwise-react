import styles from "./Message.module.css";

function Message({ messages }) {
  return (
    <p className={styles.message}>
      <span role="img">👋</span> {messages}
    </p>
  );
}

export default Message;
