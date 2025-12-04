import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models.js';
import { authMiddleware, requireRole } from './middleware.js';
import { JWT_SECRET } from './config.js';

export const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

// Auth
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, consentGiven, allergies, medications } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!['patient', 'provider'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      consentGiven: !!consentGiven,
      allergies: role === 'patient' ? allergies || '' : undefined,
      medications: role === 'patient' ? medications || '' : undefined,
      goals: role === 'patient'
        ? [
            { type: 'steps', target: 8000, unit: 'steps', logs: [] },
            { type: 'water', target: 8, unit: 'glasses', logs: [] },
            { type: 'sleep', target: 8, unit: 'hours', logs: [] },
          ]
        : [],
      reminders: role === 'patient'
        ? [
            {
              title: 'Annual Wellness Check',
              description: 'Schedule your yearly preventive checkup.',
              dueDate: new Date(new Date().getFullYear(), 11, 31),
            },
          ]
        : [],
    });
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    allergies: user.allergies,
    medications: user.medications,
  });
});

// Patient profile
router.get('/patient/profile', authMiddleware, requireRole('patient'), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Patient not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    allergies: user.allergies,
    medications: user.medications,
  });
});

router.put('/patient/profile', authMiddleware, requireRole('patient'), async (req, res) => {
  const { name, allergies, medications } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, allergies, medications },
    { new: true }
  );
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    allergies: user.allergies,
    medications: user.medications,
  });
});

// Patient goals & reminders dashboard
router.get('/patient/dashboard', authMiddleware, requireRole('patient'), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Patient not found' });
  res.json({
    goals: user.goals,
    reminders: user.reminders,
  });
});

router.post('/patient/goals/:goalId/log', authMiddleware, requireRole('patient'), async (req, res) => {
  const { value } = req.body;
  const { goalId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Patient not found' });
  const goal = user.goals.id(goalId);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  goal.logs.push({ date: new Date(), value });
  await user.save();
  res.json({ goals: user.goals });
});

router.post('/patient/reminders/:reminderId/complete', authMiddleware, requireRole('patient'), async (req, res) => {
  const { reminderId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Patient not found' });
  const reminder = user.reminders.id(reminderId);
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
  reminder.completed = true;
  await user.save();
  res.json({ reminders: user.reminders });
});

// Provider dashboard
router.get('/provider/patients', authMiddleware, requireRole('provider'), async (req, res) => {
  const provider = await User.findById(req.user.id).populate('assignedPatients');
  if (!provider) return res.status(404).json({ message: 'Provider not found' });

  const patients = provider.assignedPatients || [];
  const now = new Date();

  const summary = patients.map((p) => {
    const lastGoalLog = p.goals
      .flatMap((g) => g.logs || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const upcomingReminder = p.reminders.find((r) => r.dueDate && new Date(r.dueDate) < now && !r.completed);
    let status = 'On Track';
    if (!lastGoalLog) status = 'No Recent Activity';
    if (upcomingReminder) status = 'Missed Preventive Checkup';
    return {
      id: p._id,
      name: p.name,
      email: p.email,
      status,
    };
  });

  res.json({ patients: summary });
});

router.get('/provider/patients/:patientId', authMiddleware, requireRole('provider'), async (req, res) => {
  const { patientId } = req.params;
  const provider = await User.findById(req.user.id).populate('assignedPatients');
  if (!provider) return res.status(404).json({ message: 'Provider not found' });
  const patient = (provider.assignedPatients || []).find(
    (p) => p._id.toString() === patientId
  );
  if (!patient) return res.status(404).json({ message: 'Patient not assigned to this provider' });
  res.json({
    id: patient._id,
    name: patient.name,
    email: patient.email,
    goals: patient.goals,
    reminders: patient.reminders,
  });
});

