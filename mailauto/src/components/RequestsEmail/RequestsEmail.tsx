import { useState, useEffect } from "react";
import CopyButton from "../CopyButton/CopyButton";
import Notificacao from "../Notificacao/Notificacao";
import axios from "axios";

const RequestsEmail = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [sessao, setSessao] = useState<string | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const [mails, setMails] = useState<any[]>([]);
  const AUTH_TOKEN = '12345678:';
  const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  const GRAPHQL_API_URL = `${CORS_PROXY_URL}https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

  async function NovoEmail() {
    const query = `
      mutation {
        introduceSession {
          id,
          expiresAt,
          addresses {
            address
          }
        }
      }
    `;

    try {
      const response = await axios.post(GRAPHQL_API_URL, { query });
      const session = response.data.data.introduceSession;
      setEmail(session.addresses[0].address);
      setSessao(session.id);
      setShowInput(true);
      return session;
    } catch (error) {
      console.error(error);
    }
  }

  async function checkIncomingMail() {
    if (!sessao || sessao === "") {
      console.error("Sessão inválida.");
      return;
    }
  
    const query = `
      query {
        session(id: "${sessao}" ) {
          mails{
            rawSize,
            fromAddr,
            toAddr,
            downloadUrl,
            text,
            headerSubject
          }
        }
      }
    `;
  
    try {
      const response = await axios.post(GRAPHQL_API_URL, { query });
      const { data } = response;
      if (!data) {
        console.error("Session not found.");
        return;
      }
      const newMails = data.data.session.mails;
      setMails(newMails);
      if (newMails.length > mails.length) {
        Notificacao();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      await checkIncomingMail();
      timerRef.current = setTimeout(() => { }, 15000);
    }, 15000);

    const timerRef = { current: timer };

    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <>
      <div className="col-10 mx-auto d-flex justify-content-center">
        <div>
          <button className="btn btn-success mt-5" style={{ backgroundColor: "#1ca819", width: "35vh" }} onClick={NovoEmail}>
            GERAR NOVO EMAIL
          </button>
          <button onClick={Notificacao} className="btn btn-success mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
            </svg>
          </button>
          {showInput && (
            <div className="d-flex align-items-center mt-4">
              <div className="input-group mb-3" style={{ width: "40vh" }}>
                <input type="text" className="form-control" value={email} readOnly />
                <div className="input-group-append">
                  <button className="btn btn-success" style={{ width: "100px" }} onClick={() => CopyButton(email)}>Copiar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button onClick={checkIncomingMail}>click</button>
      <div className="col-10 mx-auto d-flex justify-content-center ">
        <div>
          {mails !== undefined &&
            mails.map((item) => {
              return (
                <div className="d-flex flex-column">
                  <td>{item.fromAddr}</td>
                  <td>{item.headerSubject}</td>
                  <td>{item.text}</td>
                </div>
              );
            })}
        </div>
      </div>
    </>
  )

}

export default RequestsEmail;