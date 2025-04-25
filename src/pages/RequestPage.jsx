import { useNavigate } from 'react-router-dom';
import RequestForm from '../components/RequestForm';
import Cookies from 'js-cookie';

const RequestPage = () => {
	const navigate = useNavigate();

	if (Cookies.get('user') === 'adminka') navigate('/admin');

	return (
		<main className="container mt-2">
			<h1 className="text-center mb-4">Оставить заявку</h1>
			<RequestForm />
		</main>
	);
};

export default RequestPage;
