// src/components/Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Supondo que db é a instância do Firestore
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Signup() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const navigate = useNavigate();

  // Função de validação de senha
  const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // A senha deve ter pelo menos uma letra maiúscula, uma minúscula e um número
    return regex.test(senha);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Verificar se a senha é válida
    if (!validarSenha(senha)) {
      setSenhaError('A senha deve ter pelo menos 8 caracteres e incluir letras e números.');
      return;
    } else {
      setSenhaError('');
    }

    try {
      // 1. Verificar se o e-mail já está cadastrado
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError('Este e-mail já foi cadastrado. Tente com outro e-mail.');
        return;
      }

      // 2. Verificar se o CPF já está cadastrado no Firestore
      const cpfDocRef = doc(db, 'usuarios', cpf);
      const cpfDoc = await getDoc(cpfDocRef);
      if (cpfDoc.exists()) {
        setError('Este CPF já está cadastrado.');
        return;
      }

      // 3. Verificar se o telefone já está cadastrado no Firestore
      const telefoneDocRef = doc(db, 'usuarios', telefone);
      const telefoneDoc = await getDoc(telefoneDocRef);
      if (telefoneDoc.exists()) {
        setError('Este número de telefone já está cadastrado.');
        return;
      }

      // 4. Criar o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 5. Armazenar dados adicionais no Firestore (use o UID para associar)
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome,
        cpf,
        telefone,
        email,
        criadoEm: new Date()
      });

      // 6. Armazenar o CPF e telefone de forma única
      // Utilize UID para vincular CPF e telefone ao usuário
      await setDoc(doc(db, 'usuarios_cpf', cpf), { userId: user.uid });
      await setDoc(doc(db, 'usuarios_telefone', telefone), { userId: user.uid });

      // 7. Redirecionar para a tela de login
      navigate('/login');
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Criar Conta</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {senhaError && <Alert severity="error">{senhaError}</Alert>}
      <form onSubmit={handleSignup}>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <TextField
          label="CPF"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <TextField
          label="Telefone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Criar Conta
        </Button>
      </form>
    </Box>
  );
}

export default Signup;
