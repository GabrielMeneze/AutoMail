import React from "react"
import addNotification from "react-push-notification"
import axios from 'axios';

const AUTH_TOKEN = 'MY_TOKEN';
const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
const GRAPHQL_API_URL = `${CORS_PROXY_URL}https://dropmail.me/api/graphql/${AUTH_TOKEN}`;



function App() {
  const clickk = () => {
    addNotification({
      title: 'NEW MAIL',
      message: 'você recebeu uma nova mensagem de email!',
      duration: 5000,
      native: true
    })
  }

  return (
    <>
      <button onClick={clickk}>click here</button>
      {/* <button onClick={createSession}>creates</button> */}
    </>
  )
}

export default App



