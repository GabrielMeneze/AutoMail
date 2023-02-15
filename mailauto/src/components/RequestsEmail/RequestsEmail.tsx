import React, { useState, useEffect } from "react";
import CopyButton from "../CopyButton/CopyButton";
import AttEmail from "../AttEmail/AttEmail";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ClipLoader } from "react-spinners";

// função que realiza as requisições para a api e retorna os resultados encontrados
const RequestsEmail = () => {
  const [email, setEmail] = React.useState<string>(localStorage.getItem("email") || "");
  const [sessao, setSessao] = React.useState<string | undefined>(undefined);
  const [prevMailsLength, setPrevMailsLength] = useState(0);
  const [mails, setMails] = React.useState<any[]>(JSON.parse(localStorage.getItem("mails") || "[]"));

  const AUTH_TOKEN = '12345678:';
  const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
  const GRAPHQL_API_URL = `${CORS_PROXY_URL}https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

  // Esta função gera um novo Email e salva os dados (email e id da sessao) em localStorage
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

  // chamado sempre que a aplicação inicia e também a cada 15 segundos
  // O useEffect verifica se já existe algum email Caso não exista um novo email é gerado. 
  // a cada 15 segundos é feita uma requisição na função CheckInbox enviando o id da sessão
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

  // a função CheckInbox verifica se existe um id da sessao. caso exista uma query é enviada
  // retornando a caixa de entrada encontrada na sessao
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

  // para que o usuário também não perca sua caixa de entrada os dados são transformados em string, enviados para localstorage
  useEffect(() => {
    const storedMails = localStorage.getItem("mails");
    if (storedMails) {
      const parsedMails = JSON.parse(storedMails);
      setMails(parsedMails);
      setPrevMailsLength(parsedMails.length);
    }
  }, []);

  // devido ao prazo não foi possivel componentizar ainda mais o codigo 
  return (
    <>
      <section className="col-10 mx-auto d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center">
            <button className="btn btn-success mx-2 mt-5" onClick={NovoEmail}>
              GERAR NOVO EMAIL
            </button>
          <div className="d-flex align-items-center mt-4">
            <div className="input-group mb-3" style={{ maxWidth: "70vh" }}>
              <input type="text" className="form-control" value={email} readOnly />
              <div className="input-group-append">
                <button className="btn btn-success" style={{ width: "100px" }} onClick={() => CopyButton(email)}>Copiar</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mt-5">
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
      </section>
    </>
  )

}

export default RequestsEmail;