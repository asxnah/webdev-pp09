import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
	const [formData, setFormData] = useState({
		un: '',
		pw: '',
	});

	const [errors, setErrors] = useState({
		un: '',
		pw: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validateForm = () => {
		let newErrors = {};

		if (!formData.un.trim()) {
			newErrors.un = 'Введите имя пользователя.';
		}

		if (!formData.pw.trim()) {
			newErrors.pw = 'Введите пароль.';
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			try {
				const response = await axios.post(
					'http://localhost:5000/login',
					formData
				);
				alert(response.data.message);
			} catch (err) {
				if (err.response && err.response.data.error) {
					setErrors((prev) => ({
						...prev,
						general: err.response.data.error,
					}));
				} else {
					setErrors((prev) => ({
						...prev,
						general: 'Произошла ошибка. Попробуйте позже.',
					}));
				}
			}
		}
	};

	return (
		<main className="container mt-2">
			<h1 className="text-center mb-4">Вход</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="un" className="form-label">
						Имя пользователя:
					</label>
					<input
						type="text"
						id="un"
						name="un"
						autoComplete="username"
						className="form-control"
						value={formData.un}
						onChange={handleChange}
					/>
					{errors.un && <p className="text-danger">{errors.un}</p>}
				</div>

				<div className="mb-3">
					<label htmlFor="pw" className="form-label">
						Пароль:
					</label>
					<input
						type="password"
						id="pw"
						name="pw"
						autoComplete="current-password"
						className="form-control"
						value={formData.pw}
						onChange={handleChange}
					/>
					{errors.pw && <p className="text-danger">{errors.pw}</p>}
				</div>

				<button type="submit" className="btn btn-primary w-100">
					Войти
				</button>
			</form>
		</main>
	);
};

export default LoginPage;
