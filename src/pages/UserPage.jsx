import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import RequestForm from '../components/RequestForm';

const UserPage = () => {
	const navigate = useNavigate();

	const isAuthenticated =
		Cookies.get('isAuthenticated') === 'true' ? true : false;
	if (!isAuthenticated) navigate('/user');

	const [requests, setRequests] = useState([]);
	const user = Cookies.get('user');

	const getUserRequests = async () => {
		try {
			const response = await axios.post(
				'http://localhost:5000/getUserRequests',
				{
					un: user,
				}
			);
			setRequests(response.data.requests);
		} catch (error) {
			console.error('Ошибка при получении заявок:', error);
		}
	};

	useEffect(() => {
		getUserRequests();
	}, [user]);

	return (
		<main className="container mt-2">
			<div>
				<h2>Оставить новую заявку</h2>
				<RequestForm onSubmit={getUserRequests} />
			</div>
			<hr />
			<div>
				<h2>История заявок</h2>

				<table className="table">
					<thead>
						<tr>
							<th>Дата</th>
							<th>Услуга</th>
							<th>Статус</th>
						</tr>
					</thead>
					<tbody>
						{requests.length > 0 ? (
							requests.map((request) => (
								<tr key={request._id}>
									<td>
										{request.date}, {request.time}
									</td>
									<td>{request.service}</td>
									<td>{request.status}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="3">Заявок нет</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</main>
	);
};

export default UserPage;
