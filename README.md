# OpenEmail
Idealizado pela coodesh OpenEmail é um projeto que gera emails temporários.


# INSTRUÇÕES
Ao abrir o projeto rode o seguinte comando na pasta mailauto: "yarn" ou "npm install --force" para instalar as dependências.
Para inicializar o projeto é necessário o seguinte comando: "yarn run dev" ou "npm run dev".

#Processo de desenvolvimento:
  Ferramentas de desenvolvimento escolhidas{
      React.js
      Vite.js
      Typescript.js
      Bootstrap
   }
   
  No primeiro dia tive algumas dificuldades com a documentação do dropmail, então eu decidi começar pelas coisas que complementariam o codigo em si.
  Comecei pelo desenvolvimento das notificações e Botão para copiar o email gerado.
    Notificações{
      No começo foi dificil achar bibliotecas para enviar notificações diretamente no browser do usuário. 
      Só achava bibliotecas que geravam notificações dentro do site então comecei a desenvolver uma api para usar o node-notification.
      Enquanto pesquisava videos para desenvolver a api achei um outro mosrandoa biblioteca react-push-notification. 
      A notificação foi dividida em 2 partes. 1° a parte do botão que fica visivel para o usuario e pede a permissão e a 2° que é ativada junto com o useEffect que             verifica se existem novos emails, sempre que o array de e-mails aumenta uma notificação é gerada.
      }
  Passei umas boas horas tentando entender o que estava fazendo de errado na requisição para a api do dropmail e descobri depois que na realidade a documentação que       está ultrapassada então para acessar a api utilizei o cors-anywhre.
    Gerar Email{
      Foi minha primeira experiência mandando consultas com graphhql então foi um pouco dificíl de pegar o jeito para as construções das querys. 
      
  
 
