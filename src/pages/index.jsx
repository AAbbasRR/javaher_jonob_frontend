import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "src/components/PrivateRoute";
import useAuthStore from "src/store";
import NotFound from "./404";
import CustomerManagement from "./Dashboard/CustomerManagement";
import Dashboard from "./Dashboard/Dashboard";
import { useState } from "react";
import FactorManagement from "./Dashboard/FactorManagement";
import ProductManagement from "./Dashboard/ProductManagement";
import StaffManagement from "./Dashboard/StaffManagement";
import StoreManagement from "./Dashboard/StoreManagement";
import ChangePassword from "./Dashboard/ChangePassword";
import Layout from "./Dashboard/components/Layout";
import SignIn from "./SignIn";

const dashboardPages = [
	{
		element: <Dashboard />,
		path: "dashboard",
		permissions: ["staff", "superuser"],
	},
	{
		element: <StaffManagement />,
		path: "staff-management",
		permissions: ["superuser"],
	},
	{
		element: <FactorManagement />,
		path: "factor-management",
		permissions: ["superuser", "staff", "secretary", "worker"],
	},
	{
		element: <CustomerManagement />,
		path: "customer-management",
		permissions: ["superuser", "staff", "secretary"],
	},
	{
		element: <StoreManagement />,
		path: "store-management",
		permissions: ["staff", "superuser"],
	},
	{
		element: <ProductManagement />,
		path: "product-management",
		permissions: ["staff", "superuser"],
	},
	{
		element: <ChangePassword />,
		path: "change-password",
		permissions: ["superuser", "staff", "secretary", "worker"],
	},
];

function Pages() {
	const { accessToken, userInfo } = useAuthStore();

	return (
		<Routes>
			<Route path="/signin" element={<SignIn />} />
			<Route path="/dashboard/*" element={<PrivateRoute isAuthenticated={accessToken} />}>
				<Route element={<Layout />}>
					{["staff", "superuser"].includes(userInfo?.type) ? (
						<Route index element={<Dashboard />} />
					) : (
						<Route index element={<FactorManagement />} />
					)}
					{dashboardPages.map((page, i) => {
						if (page?.permissions.includes(userInfo?.type)) {
							return <Route key={i} path={page?.path} element={page?.element} />;
						}
					})}
					<Route path="*" element={<NotFound />} />
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Pages;
