import Cabecalho from "./components/Cabecalho/Cabecalho";
import RequestsEmail from "./components/RequestsEmail/RequestsEmail";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <body style={{ backgroundColor: '#181A1B', height: "100vh"}}>
        <header>
          <Cabecalho />
        </header>
        <main>
          <RequestsEmail />
        </main>
      </body>
    </>
  )
}

export default App



