import addNotification from "react-push-notification"

// Função que gera pedido de permissão para as notificações serem enviadas
const Notificacao = () => {
    if (!("Notification" in window)) {
      alert("Este navegador não suporta notificações de desktop.");
    } else if (Notification.permission === "granted") {
      alert("Suas notificações já estão ativadas!")
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission()
    } else {
      alert("Você bloqueou as notificações deste site. Por favor, ative-as nas configurações do navegador.");
    }
  };  export default Notificacao;