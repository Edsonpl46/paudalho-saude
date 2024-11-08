Projeto Saúde Paudalho
Aplicativo web para cadastro e gerenciamento de usuários da Secretaria de Saúde de Paudalho. Este projeto utiliza Firebase para autenticação e armazenamento de dados, além de uma interface moderna construída com React e Material-UI.

Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

Node.js (versão recomendada: 18.17.0 ou superior)
npm (geralmente incluído com a instalação do Node.js)

Configuração do Projeto
Passo 1: Clonar o Repositório:

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio

Passo 2: Instalar Dependências
Dentro do diretório do projeto, execute o comando abaixo para instalar todas as dependências listadas no package.json:

npm install

Passo 3: Configuração do Firebase
Acesse o Firebase Console e crie um novo projeto.
No projeto criado, habilite o Firestore para o banco de dados e Authentication para autenticação.
Na aba Configurações do Projeto, copie as configurações de integração do Firebase.
Crie um arquivo firebaseConfig.js na pasta src e cole as configurações:

// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2_upwJIigitzp521_rq00ovKs0MsnSQo",
  authDomain: "saude-paudalho.firebaseapp.com",
  projectId: "saude-paudalho",
  storageBucket: "saude-paudalho.firebasestorage.app",
  messagingSenderId: "50351405957",
  appId: "1:50351405957:web:23d76589a79b9d89cf22ec",
  measurementId: "G-Z4QKVGL91Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

Passo 4: Executar o Projeto
Para iniciar o projeto em ambiente de desenvolvimento:

npm start

Acesse http://localhost:3000 no navegador para ver a aplicação.

Bibliotecas e Dependências Principais
Abaixo estão listadas as dependências essenciais deste projeto:

Firebase: Serviços de autenticação e Firestore para o banco de dados.

npm install firebase

React Router: Navegação entre as diferentes páginas da aplicação.

npm install react-router-dom

Material-UI: Biblioteca de componentes para a interface moderna e responsiva.

npm install @mui/material @emotion/react @emotion/styled



Estrutura do Projeto
src/components: Componentes de interface do usuário, como Signup.js, Login.js, Dashboard.js e CadastroPaciente.js.
src/firebaseConfig.js: Configurações do Firebase.
src/App.js: Configuração das rotas e componentes principais.
Possíveis Problemas e Soluções
Erro de autenticação ou configuração não encontrada: Verifique se as credenciais do Firebase estão corretas no arquivo firebaseConfig.js.
Erro de navegação: Verifique o react-router-dom e a configuração de rotas no App.js.
