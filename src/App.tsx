import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';
import { BetHistoryPage } from './pages/BetHistoryPage';
import { HomePage } from './pages/HomePage';
import { LivePage } from './pages/LivePage';
import { LoginPage } from './pages/LoginPage';
import { PrematchPage } from './pages/PrematchPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AuthProvider>
					<Routes>
						{/* Публичные маршруты */}
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />

						{/* Защищенные маршруты */}
						<Route path='/' element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route path='live' element={<LivePage />} />
							<Route path='prematch' element={<PrematchPage />} />

							{/* Маршруты, требующие авторизации */}
							<Route
								path='profile'
								element={
									<ProtectedRoute>
										<ProfilePage />
									</ProtectedRoute>
								}
							/>
							<Route
								path='bets'
								element={
									<ProtectedRoute>
										<BetHistoryPage />
									</ProtectedRoute>
								}
							/>
						</Route>
					</Routes>
				</AuthProvider>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
