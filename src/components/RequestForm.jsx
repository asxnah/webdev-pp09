import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import Cookies from 'js-cookie';
import axios from 'axios';

const RequestForm = ({ onSubmit }) => {
	const user = Cookies.get('user');

	const [formData, setFormData] = useState({
		un: user ? user : 'Незарегистрированный пользователь',
		address: '',
		phone: '',
		date: '',
		time: '',
		service: '',
		customService: '',
		isOtherService: false,
		payment: '',
	});

	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
		setErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const validate = () => {
		let newErrors = {};
		const phoneRegex = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;

		if (!formData.address.trim()) newErrors.address = 'Укажите адрес.';
		if (!formData.phone.trim() || !phoneRegex.test(formData.phone))
			newErrors.phone = 'Введите телефон в формате +7(XXX)-XXX-XX-XX.';
		if (!formData.date) newErrors.date = 'Укажите дату.';
		if (!formData.time) newErrors.time = 'Укажите время.';
		if (!formData.service && !formData.customService.trim())
			newErrors.service = 'Выберите услугу.';
		if (formData.isOtherService && !formData.customService.trim())
			newErrors.customService = 'Опишите услугу.';
		if (!formData.payment) newErrors.payment = 'Выберите тип оплаты.';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validate()) {
			try {
				await axios.post('http://localhost:5000/request', {
					...formData,
					service: formData.service,
				});
				setFormData({
					un: user ? user : 'Незарегистрированный пользователь',
					address: '',
					phone: '',
					date: '',
					time: '',
					service: '',
					customService: '',
					isOtherService: false,
					payment: '',
				});
				setErrors({});
				onSubmit();
			} catch (err) {
				console.error(err);
				if (err.response?.data?.error) {
					setErrors((prev) => ({ ...prev, general: err.response.data.error }));
				} else {
					setErrors((prev) => ({
						...prev,
						general: 'Не удалось отправить заявку. Попробуйте позже.',
					}));
				}
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label">Желаемый доменный адрес</label>
				<input
					type="text"
					name="address"
					className="form-control"
					value={formData.address}
					onChange={handleChange}
				/>
				{errors.address && <p className="text-danger">{errors.address}</p>}
			</div>

			<div className="mb-3">
				<label className="form-label">Ваш номер телефона</label>
				<IMaskInput
					mask="+{7}(000)-000-00-00"
					definitions={{ '#': /[0-9]/ }}
					unmask={false}
					name="phone"
					value={formData.phone}
					onAccept={(value) =>
						setFormData((prev) => ({ ...prev, phone: value }))
					}
					className="form-control"
				/>
				{errors.phone && <p className="text-danger">{errors.phone}</p>}
			</div>

			<div className="row mb-3 alert alert-light mx-1">
				<h4>Когда Вам перезвонить? *</h4>
				<div className="form-text mb-2">
					Мы постараемся это учесть перезвонить Вам в ближайшее время.
				</div>
				<div className="col">
					<label className="form-label">Дата</label>
					<input
						type="date"
						name="date"
						className="form-control"
						value={formData.date}
						onChange={handleChange}
					/>
					{errors.date && <p className="text-danger">{errors.date}</p>}
				</div>
				<div className="col">
					<label className="form-label">Время</label>
					<input
						type="time"
						name="time"
						className="form-control"
						value={formData.time}
						onChange={handleChange}
					/>
					{errors.time && <p className="text-danger">{errors.time}</p>}
				</div>
			</div>

			<div className="mb-3">
				<label className="form-label">Тип веб-сайта</label>
				<select
					name="service"
					className="form-select"
					value={formData.service}
					onChange={handleChange}
					disabled={formData.isOtherService}
				>
					<option value="">-- Выберите --</option>
					<option value="Веб-сайт на Wordpress">Веб-сайт на Wordpress</option>
					<option value="Веб-сайт под ключ">Веб-сайт под ключ</option>
					<option value="Ещё не определился">Ещё не определился</option>
				</select>
				{errors.service && <p className="text-danger">{errors.service}</p>}

				<div className="form-check mt-2">
					<input
						type="checkbox"
						name="isOtherService"
						className="form-check-input"
						checked={formData.isOtherService}
						onChange={handleChange}
						id="otherService"
					/>
					<label className="form-check-label" htmlFor="otherService">
						Иной тип веб-сайта
					</label>
				</div>

				{formData.isOtherService && (
					<div className="mt-2">
						<input
							type="text"
							name="customService"
							className="form-control"
							placeholder="Опишите"
							value={formData.customService}
							onChange={handleChange}
						/>
						{errors.customService && (
							<p className="text-danger">{errors.customService}</p>
						)}
					</div>
				)}
			</div>

			<div className="mb-3">
				<label className="form-label">Тип оплаты</label>
				<div className="form-check">
					<input
						className="form-check-input"
						type="radio"
						name="payment"
						value="cash"
						checked={formData.payment === 'cash'}
						onChange={handleChange}
						id="payCash"
					/>
					<label className="form-check-label" htmlFor="payCash">
						Наличные
					</label>
				</div>
				<div className="form-check">
					<input
						className="form-check-input"
						type="radio"
						name="payment"
						value="card"
						checked={formData.payment === 'card'}
						onChange={handleChange}
						id="payCard"
					/>
					<label className="form-check-label" htmlFor="payCard">
						Банковская карта
					</label>
				</div>
				{errors.payment && <p className="text-danger">{errors.payment}</p>}
			</div>

			<button type="submit" className="btn btn-primary w-100">
				Отправить заявку
			</button>
		</form>
	);
};

export default RequestForm;
