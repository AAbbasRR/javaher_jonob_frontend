import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "src/components/PrivateRoute";
import useAuthStore from "src/store";
import NotFound from "./404";
import CustomerManagement from "./Dashboard/CustomerManagement";
import Dashboard from "./Dashboard/Dashboard";
import ProductManagement from "./Dashboard/ProductManagement";
import StaffManagement from "./Dashboard/StaffManagement";
import StoreManagement from "./Dashboard/StoreManagement";
import Layout from "./Dashboard/components/Layout";
import SignIn from "./SignIn";

function Pages() {
	const { accessToken } = useAuthStore();

	return (
		<Routes>
			<Route path="/signin" element={<SignIn />} />
			<Route path="/dashboard/*" element={<PrivateRoute isAuthenticated={accessToken} />}>
				<Route element={<Layout />}>
					<Route index element={<Dashboard />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="staff-management" element={<StaffManagement />} />
					<Route path="customer-management" element={<CustomerManagement />} />
					<Route path="store-management" element={<StoreManagement />} />
					<Route path="product-management" element={<ProductManagement />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Pages;
