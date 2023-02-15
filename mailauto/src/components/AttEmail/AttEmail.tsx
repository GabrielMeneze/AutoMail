import addNotification from "react-push-notification"

// função que é chamada sempre que um novo email é recebido na caixa de entrada
const AttEmail = () => {
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
            title: 'OpenMail',
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

  export default AttEmail;