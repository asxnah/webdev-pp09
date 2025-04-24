import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
	const [requests, setRequests] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState({});
	const [cancelReasons, setCancelReasons] = useState({});

	const fetchAllRequests = async () => {
		try {
			const response = await axios.get('http://localhost:5000/getAllRequests');
			setRequests(response.data.requests);
		} catch (error) {
			console.error('Ошибка при получении заявок:', error);
		}
	};

	const handleStatusChange = (id, status) => {
		setSelectedStatus({ ...selectedStatus, [id]: status });
	};

	const handleCancelReasonChange = (id, reason) => {
		setCancelReasons({ ...cancelReasons, [id]: reason });
	};

	const updateStatus = async (id) => {
		const status = selectedStatus[id];
		const reason = cancelReasons[id] || '';

		if (status === 'отменено' && !reason) {
			alert('Необходимо указать причину отмены');
			return;
		}

		try {
			await axios.post('http://localhost:5000/updateRequestStatus', {
				id,
				status,
				reason,
			});
			fetchAllRequests();
		} catch (err) {
			console.error('Ошибка при обновлении статуса:', err);
		}
	};

	useEffect(() => {
		fetchAllRequests();
	}, []);

	return (
		<main className="container">
			<h1 className="mb-3">Заявки пользователей</h1>
			<div className="row">
				{requests.length > 0 ? (
					requests.map((request) => (
						<div className="col-12 mb-3" key={request._id}>
							<div className="card">
								<div className="card-body">
									<h4 className="card-title">{request.service}</h4>
									<p className="card-text">
										<b>ФИО:</b> {request.un} <br />
										<b>Телефон:</b> {request.phone} <br />
										<b>Адрес:</b> {request.address} <br />
										<b>Дата и время:</b> {request.date} {request.time} <br />
										<b>Оплата:</b> {request.payment} <br />
										<b>Статус:</b> {request.status}
										{request.status === 'отменено' && (
											<p>
												<b>Причина отмены:</b> {request.cancelReason}
											</p>
										)}
									</p>

									<div className="mb-2">
										<select
											className="form-select"
											value={selectedStatus[request._id] || ''}
											onChange={(e) =>
												handleStatusChange(request._id, e.target.value)
											}
										>
											<option value="">Изменить статус</option>
											<option value="выполнено">Выполнено</option>
											<option value="отменено">Отменено</option>
										</select>
									</div>

									{selectedStatus[request._id] === 'отменено' && (
										<div className="mb-2">
											<input
												type="text"
												className="form-control"
												placeholder="Причина отмены"
												value={cancelReasons[request._id] || ''}
												onChange={(e) =>
													handleCancelReasonChange(request._id, e.target.value)
												}
											/>
										</div>
									)}

									<button
										className="btn btn-primary"
										onClick={() => updateStatus(request._id)}
									>
										Сохранить
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<p>Заявок нет.</p>
				)}
			</div>
		</main>
	);
};

export default AdminPage;
