import React, { useState } from "react"
import addNotification from "react-push-notification"
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [email, setEmail] = useState()
  const AUTH_TOKEN = 'MY_TOKEN';
  const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  const GRAPHQL_API_URL = `${CORS_PROXY_URL}https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

  async function createSession() {
    const query = `mutation { introduceSession { id, expiresAt, addresses { address } } } 
`;

    try {
      const response = await axios.post(GRAPHQL_API_URL, { query });
      const { data } = response.data;
      setEmail(data.introduceSession.addresses[0].address);
      return data.introduceSession;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchIncomingMail(sessionId: string) {
    const query = `query { session(id: "${sessionId}") { mails{ rawSize, fromAddr, toAddr... } } } `;

    try {
      const response = await axios.post(GRAPHQL_API_URL, { query });
      const { data } = response.data;
      console.log(data.session.mails);
      return data.session.mails;
    } catch (error) {
      console.error(error);
    }
  }

  const Notificacao = () => {
    addNotification({
      title: 'NEW MAIL',
      message: 'você recebeu uma nova mensagem!',
      duration: 5000,
      native: true
    })
  }


  return (
    <>
      <button onClick={createSession}>GERAR NOVO EMAIL</button>
      <p>{email}</p>
    </>
  )
}

export default App



