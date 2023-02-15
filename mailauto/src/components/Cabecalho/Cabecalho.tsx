import "bootstrap/dist/css/bootstrap.min.css";
import Notificacao from "../Notificacao/Notificacao";

const Cabecalho = () => {
    return (
        <>
            <header style={{ backgroundColor: "#1b1e23", height: "80px", boxShadow: "0px 0px 10px #1b1e23" }}>
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-around">
                        <div className="col-6 d-flex justify-content-center">
                            <h1 style={{color: "white"}}>OpenEmail</h1>
                        </div>
                        <div className="col-6 d-flex justify-content-center">
                            <button onClick={Notificacao} className="btn btn-outline-light mx-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                                </svg>
                                <span className="ml-2">Ativar notificações</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Cabecalho;