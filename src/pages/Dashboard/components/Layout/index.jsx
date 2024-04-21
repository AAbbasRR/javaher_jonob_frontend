import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import styles from "./style.module.scss";

const Layout = () => {
	const [sidebar, setSidebar] = useState(false);

	return (
		<>
			<div className={styles.wrapper}>
				<Sidebar sidebar={sidebar} setSidebar={setSidebar} />
				<div className={styles.content}>
					<main className={styles.main}>
						<Outlet />
					</main>
				</div>
			</div>
			<Navbar setSidebar={setSidebar} />
		</>
	);
};

export default Layout;
