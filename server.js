import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';

const app = express();
app.use(express.json());
app.use(cors());

mongoose
	.connect('mongodb://localhost:27017/webdev')
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.log('Failed to connect to MongoDB', err));

app.post('/register', async (req, res) => {
	const { un, pw, name, tel, email } = req.body;

	try {
		const existingUser = await User.findOne({ un });
		if (existingUser) {
			return res.status(400).json({ error: 'Этот логин уже занят.' });
		}

		const user = new User({
			un,
			pw,
			name,
			tel,
			email,
		});

		await user.save();

		res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Произошла ошибка при регистрации.' });
	}
});

app.post('/login', async (req, res) => {
	const { un, pw } = req.body;

	try {
		const user = await User.findOne({ un });

		if (!user) {
			return res.status(400).json({ error: 'Пользователь не найден.' });
		}

		if (user.pw !== pw) {
			return res.status(400).json({ error: 'Неверный пароль.' });
		}

		res.status(200).json({ message: 'Вход выполнен успешно!' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Ошибка сервера.' });
	}
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
