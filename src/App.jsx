import { Routes, Route } from 'react-router-dom';
import './main.css';
import RegisterPage from './pages/RegisterPage';

function App() {
	return (
		<Routes>
			<Route path="/register" element={<RegisterPage />} />
		</Routes>
	);
}

export default App;
