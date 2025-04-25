import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Request from './models/Request.js';

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

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(pw, saltRounds);

		const user = new User({
			un,
			pw: hashedPassword,
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

		const isPasswordValid = await bcrypt.compare(pw, user.pw);
		if (!isPasswordValid) {
			return res.status(400).json({ error: 'Неверный пароль.' });
		}

		res.status(200).json({ message: 'Вход выполнен успешно!' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Ошибка сервера.' });
	}
});

app.post('/request', async (req, res) => {
	try {
		const { un, address, phone, date, time, service, customService, payment } =
			req.body;

		const finalService = service === 'Иная услуга' ? customService : service;

		if (!finalService) {
			return res.status(400).json({ error: 'Услуга обязательна.' });
		}

		const request = new Request({
			un,
			address,
			phone,
			date,
			time,
			service: finalService,
			customService: service === 'Иная услуга' ? customService : '',
			payment,
		});

		await request.save();
		res.status(201).json({ message: 'Заявка принята!' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Ошибка при отправке заявки.' });
	}
});

app.post('/getUserRequests', async (req, res) => {
	try {
		const { un } = req.body;

		if (!un) {
			return res.status(400).json({ error: 'Не указано имя пользователя.' });
		}

		const userRequests = await Request.find({ un }).sort({
			createdAt: -1,
		});

		res.status(200).json({ requests: userRequests });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Ошибка при получении заявок.' });
	}
});

app.get('/getAllRequests', async (req, res) => {
	try {
		const allRequests = await Request.find().sort({ createdAt: -1 });
		res.status(200).json({ requests: allRequests });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Ошибка при получении всех заявок.' });
	}
});

app.post('/updateRequestStatus', async (req, res) => {
	try {
		const { id, status, reason } = req.body;

		const update = { status };
		if (status === 'отменено') {
			update.cancelReason = reason;
		}

		await Request.findByIdAndUpdate(id, update);
		res.status(200).json({ message: 'Статус обновлен' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Ошибка при обновлении статуса.' });
	}
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
