import Cabecalho from "./components/Cabecalho/Cabecalho";
import RequestsEmail from "./components/RequestsEmail/RequestsEmail";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <header>
        <Cabecalho />
      </header>
      <main>
        <RequestsEmail />
      </main>
    </>
  )
}

export default App



