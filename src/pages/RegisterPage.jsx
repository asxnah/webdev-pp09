import React, { useState } from 'react';

// для валидации
const regex = {
	// минимум 5 символов (буквы, цифры, нижнее подчеркивание)
	un: /^[a-zA-Z0-9_]{5,}$/,
	// минимум 6 символов, включая хотя бы одну цифру
	pw: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
	// только кириллица и пробелы
	name: /^[А-Яа-яЁё\s]+$/,
	// формат +7(XXX)-XXX-XX-XX
	tel: /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/,
	// почта
	email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		un: '',
		pw: '',
		name: '',
		tel: '',
		email: '',
	});

	const [errors, setErrors] = useState({
		un: '',
		pw: '',
		name: '',
		tel: '',
		email: '',
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

		if (!formData.un || !regex.un.test(formData.un)) {
			newErrors.un =
				'Логин должен содержать минимум 5 символов (буквы, цифры, нижнее подчеркивание).';
		}

		if (!formData.pw || !regex.pw.test(formData.pw)) {
			newErrors.pw =
				'Пароль должен содержать минимум 6 символов, включая хотя бы одну цифру.';
		}

		if (!formData.name || !regex.name.test(formData.name)) {
			newErrors.name =
				'ФИО должно содержать только кириллические символы и пробелы.';
		}

		if (!formData.tel || !regex.tel.test(formData.tel)) {
			newErrors.tel =
				'Неверный формат телефона. Используйте формат +7(XXX)-XXX-XX-XX.';
		}

		if (!formData.email || !regex.email.test(formData.email)) {
			newErrors.email = 'Неверный формат электронной почты.';
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			alert('Форма успешно отправлена!');
		}
	};

	return (
		<main className="container mt-2">
			<h1 className="text-center mb-4">Регистрация</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="un" className="form-label">
						Логин:
					</label>
					<input
						type="text"
						id="un"
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
						autoComplete="current-password"
						className="form-control"
						value={formData.pw}
						onChange={handleChange}
					/>
					{errors.pw && <p className="text-danger">{errors.pw}</p>}
				</div>

				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						ФИО:
					</label>
					<input
						type="text"
						id="name"
						autoComplete="name"
						className="form-control"
						value={formData.name}
						onChange={handleChange}
					/>
					{errors.name && <p className="text-danger">{errors.name}</p>}
				</div>

				<div className="mb-3">
					<label htmlFor="tel" className="form-label">
						Телефон:
					</label>
					<input
						type="text"
						id="tel"
						autoComplete="tel"
						className="form-control"
						value={formData.tel}
						onChange={handleChange}
					/>
					{errors.tel && <p className="text-danger">{errors.tel}</p>}
				</div>

				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Электронная почта:
					</label>
					<input
						type="email"
						id="email"
						autoComplete="email"
						className="form-control"
						value={formData.email}
						onChange={handleChange}
					/>
					{errors.email && <p className="text-danger">{errors.email}</p>}
				</div>

				<button type="submit" className="btn btn-primary w-100">
					Зарегистрироваться
				</button>
			</form>
		</main>
	);
};

export default RegisterPage;
