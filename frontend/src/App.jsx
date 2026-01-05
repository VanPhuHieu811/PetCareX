import React from 'react';
import { HashRouter, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vaccination from './pages/Vaccination';
import Inventory from './pages/Inventory';
import Employees from './pages/Employees';
import Pets from './pages/Pets';
import Customers from './pages/Customers';

function App() {
	return (
		<BrowserRouter basename={'Manager'}>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Dashboard />} />
					<Route path="vaccination" element={<Vaccination />} />
					<Route path="inventory" element={<Inventory />} />
					<Route path="employees" element={<Employees />} />
					<Route path="pets" element={<Pets />} />
					<Route path="customers" element={<Customers />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
