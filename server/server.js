import cors from 'cors';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { stateResults, teamMembers } from './data.js';

const app = express();
const sessions = new Map();
let actionCount = 0;

app.use(cors());
app.use(express.json());

function getAuthenticatedUser(request) {
  const token = request.get('authorization')?.replace(/^Bearer\s+/i, '');
  return token ? sessions.get(token) : undefined;
}

app.post('/api/login', (request, response) => {
  const { email, password } = request.body ?? {};
  const validEmail = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!validEmail || typeof password !== 'string' || password.length === 0) {
    return response.status(400).json({ message: 'Informe um e-mail válido e uma senha.' });
  }

  const name = email.split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const user = { id: randomUUID(), name, email };
  const token = randomUUID();
  sessions.set(token, user);
  return response.json({ token, user });
});

app.get('/api/user/profile', (request, response) => {
  const user = getAuthenticatedUser(request);
  if (!user) return response.status(401).json({ message: 'Sessão inválida ou expirada.' });

  return response.json({
    user: { ...user, role: 'Membro', joinedAt: '2025-01-15', focus: 'Fazer o que importa' },
  });
});

app.get('/api/admin/users', (request, response) => {
  if (!getAuthenticatedUser(request)) {
    return response.status(401).json({ message: 'Faça login para consultar a equipe.' });
  }
  return response.json({ users: teamMembers, demoData: true });
});

app.post('/api/admin/users', (request, response) => {
  if (!getAuthenticatedUser(request)) {
    return response.status(401).json({ message: 'Faça login para cadastrar usuários.' });
  }

  const { name, email, role } = request.body ?? {};
  const validEmail = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (typeof name !== 'string' || name.trim().length < 2 || !validEmail || !['Analista', 'Leitor', 'Administradora'].includes(role)) {
    return response.status(400).json({ message: 'Informe nome, e-mail válido e perfil.' });
  }
  if (teamMembers.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
    return response.status(409).json({ message: 'Já existe um usuário com esse e-mail.' });
  }

  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: email.trim(),
    role,
    status: 'Pendente',
    area: 'Nova colaboração',
    lastSeen: 'Convite enviado',
  };
  teamMembers.unshift(user);
  return response.status(201).json({ user });
});

app.get('/api/analysis/states', (request, response) => {
  if (!getAuthenticatedUser(request)) {
    return response.status(401).json({ message: 'Faça login para consultar os dados.' });
  }
  return response.json({ states: stateResults, source: 'Capturas fornecidas em img/', demoData: true });
});

app.post('/api/action', (request, response) => {
  const user = getAuthenticatedUser(request);
  if (!user) return response.status(401).json({ message: 'Faça login para executar esta ação.' });

  const { command } = request.body ?? {};
  if (typeof command !== 'string' || command.length === 0) {
    return response.status(400).json({ message: 'Informe um comando para executar.' });
  }

  actionCount += 1;
  return response.json({
    success: true,
    count: actionCount,
    message: `Ação recebida, ${user.name}. Seu próximo passo já está em movimento.`,
  });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`API Ritmo disponível em http://localhost:${port}`);
});