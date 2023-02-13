import React, { useState } from "react"
import addNotification from "react-push-notification"
import Cabecalho from "./components/Cabecalho/Cabecalho";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import axios from 'axios';

function App() {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const AUTH_TOKEN = 'MY_TOKEN';
  const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  const GRAPHQL_API_URL = `${CORS_PROXY_URL}https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

  async function createSession() {
    const query = `mutation {
      introduceSession {
         id, expiresAt, addresses { address }
         } 
        }`;

    try {
      const response = await axios.post(GRAPHQL_API_URL, { query });
      const { data } = response.data;
      setEmail(data.introduceSession.addresses[0].address);
      setShowInput(true)
      return data.introduceSession;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchIncomingMail(sessionId: string) {
    const query = `query { 
      session(id: "${sessionId}") { 
        mails{
          rawSize, fromAddr, toAddr... 
        } 
       } 
      } `;

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
    if (!("Notification" in window)) {
      alert("Este navegador não suporta notificações de desktop.");
    } else if (Notification.permission === "granted") {
      addNotification({
        title: 'OpenMail',
        message: 'Você recebeu uma nova mensagem!',
        duration: 6000,
        native: true
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          addNotification({
            title: 'NEW MAIL',
            message: 'Você recebeu uma nova mensagem!',
            duration: 6000,
            native: true
          });
        }
      });
    } else {
      alert("Você bloqueou as notificações deste site. Por favor, ative-as nas configurações do navegador.");
    }
  };

  function copyToClipboard(email: string | undefined) {
    if (!email) {
      return;
    }
    const el = document.createElement('textarea');
    el.value = email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }


  return (
    <>
      <Cabecalho />
      <main>
        <section className="container-fluid my-5">
          <div className="col-10 mx-auto d-flex justify-content-center">
            <div>
              <button className="btn btn-success" style={{ backgroundColor: "#1ca819", width: "35vh" }} onClick={createSession}>
                GERAR NOVO EMAIL
              </button>
              <button onClick={Notificacao} className="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                </svg>
              </button>
              {showInput && (
                <div className="d-flex align-items-center mt-4">
                  <div className="input-group mb-3" style={{ width: "40vh" }}>
                    <input type="text" className="form-control" value={email} readOnly />
                    <div className="input-group-append">
                      <button className="btn btn-success" style={{ width: "100px" }} onClick={() => copyToClipboard(email)}>Copiar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App



