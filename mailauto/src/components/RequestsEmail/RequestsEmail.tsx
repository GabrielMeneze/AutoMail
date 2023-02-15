import React, { useState, useEffect } from "react";
import CopyButton from "../CopyButton/CopyButton";
import AttEmail from "../AttEmail/AttEmail";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ClipLoader } from "react-spinners";



const RequestsEmail = () => {
  const [email, setEmail] = React.useState<string>(localStorage.getItem("email") || "");
  const [sessao, setSessao] = React.useState<string | undefined>(undefined);
  const [prevMailsLength, setPrevMailsLength] = useState(0);
  const [mails, setMails] = React.useState<any[]>(JSON.parse(localStorage.getItem("mails") || "[]"));

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
      localStorage.setItem("email", session.addresses[0].address);
      localStorage.setItem("sessao", session.id);
      setEmail(session.addresses[0].address);
      setSessao(session.id);
      return session;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!email) {
      NovoEmail()
    }
    const interval = setInterval(() => {
      setPrevMailsLength(mails.length);
      CheckInbox();
    }, 15000);
    return () => clearInterval(interval);
  }, [mails, sessao]);

  async function CheckInbox() {

    if (!localStorage.sessao || localStorage.sessao === "") {
      console.error("Sessão inválida.");
      return;
    }

    const query = `
      query {
        session(id: "${localStorage.sessao}" ) {
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
      localStorage.setItem("mails", JSON.stringify(newMails));

      if (newMails.length > prevMailsLength) {
        AttEmail();
      }
      setPrevMailsLength(newMails.length);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const storedMails = localStorage.getItem("mails");
    if (storedMails) {
      const parsedMails = JSON.parse(storedMails);
      setMails(parsedMails);
      setPrevMailsLength(parsedMails.length);
    }
  }, []);
  return (
    <>
      <div className="col-10 mx-auto d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center">
            <button className="btn btn-success mx-2 mt-5" onClick={NovoEmail}>
              GERAR NOVO EMAIL
            </button>
          <div className="d-flex align-items-center mt-4">
            <div className="input-group mb-3" style={{ maxWidth: "40vh" }}>
              <input type="text" className="form-control" value={email} readOnly />
              <div className="input-group-append">
                <button className="btn btn-success" style={{ width: "100px" }} onClick={() => CopyButton(email)}>Copiar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row">
          {mails !== undefined && mails.length > 0 ?
            mails.map((item) => {
              return (
                <div className="col-sm-10 mb-3 mx-auto">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Remetente: {item.fromAddr}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">Assunto: {item.headerSubject}</h6>
                      <p className="card-text">Mensagem: {item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })
            :
            <div className="d-flex flex-column align-items-center">
              <p className="mx-4" style={{color: "white"}}>Sua caixa de entrada está vazia</p>
              <ClipLoader size={50} color={"#1ca819"} loading={true} />
            </div>
          }
        </div>
      </div>
    </>
  )

}

export default RequestsEmail;