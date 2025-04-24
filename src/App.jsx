import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RequestPage from './pages/RequestPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import Cookies from 'js-cookie';

function App() {
	const navigate = useNavigate();

	const isAuthenticated =
		Cookies.get('isAuthenticated') === 'true' ? true : false;

	const isAdmin = Cookies.get('user') === 'adminka' ? true : false;

	return (
		<>
			<header>
				<nav className="navbar navbar-expand-lg bg-body-tertiary">
					<div className="container-fluid">
						<NavLink className="navbar-brand" to="/">
							WebDev{isAdmin && '.Adm'}
						</NavLink>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNav">
							<ul className="navbar-nav">
								{isAuthenticated && !isAdmin && (
									<li className="nav-item">
										<NavLink
											to="/"
											end
											className={({ isActive }) =>
												'nav-link' + (isActive ? ' active' : '')
											}
										>
											Профиль
										</NavLink>
									</li>
								)}
								{!isAuthenticated && (
									<li className="nav-item">
										<NavLink
											to="/"
											className={({ isActive }) =>
												'nav-link' + (isActive ? ' active' : '')
											}
										>
											Регистрация
										</NavLink>
									</li>
								)}
								{!isAuthenticated && (
									<li className="nav-item">
										<NavLink
											to="/login"
											className={({ isActive }) =>
												'nav-link' + (isActive ? ' active' : '')
											}
										>
											Вход
										</NavLink>
									</li>
								)}
								{!isAdmin && (
									<li className="nav-item">
										<NavLink
											to="/request"
											className={({ isActive }) =>
												'nav-link' + (isActive ? ' active' : '')
											}
										>
											Оставить заявку
										</NavLink>
									</li>
								)}
								{isAuthenticated && (
									<li className="nav-item">
										<button
											className="btn btn-outline-dark"
											onClick={() => {
												Cookies.set('isAuthenticated', 'false');
												Cookies.remove('user');
												navigate('/');
											}}
										>
											Выйти из аккаунта
										</button>
									</li>
								)}
							</ul>
						</div>
					</div>
				</nav>
			</header>

			<Routes>
				<Route path="/" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/request" element={<RequestPage />} />
				<Route path="/user" element={<UserPage />} />
				<Route path="/admin" element={<AdminPage />} />
			</Routes>
		</>
	);
}

export default App;
