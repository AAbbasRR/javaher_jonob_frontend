import { useState } from "react";
import { NavLink } from "react-router-dom";
import IconStaffManagement from "src/assets/icons/icon-admin-management.svg";
import IconStoreManagement from "src/assets/icons/icon-store.svg";
import IconProductManagement from "src/assets/icons/icon-product-management.svg";
import IconCustomerManagement from "src/assets/icons/icon-customer-management.svg";
import IconRemove from "src/assets/icons/icon-exit-24.svg";
import IconExit from "src/assets/icons/icon-exit.svg";
import IconHome from "src/assets/icons/icon-home.svg";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useAuthStore from "src/store";
import style from "./style.module.scss";

const menu = [
	{
		title: "داشبورد",
		icon: IconHome,
		path: "dashboard",
		permissions: ["staff", "superuser"],
	},
	{
		title: "مدیریت انبار",
		icon: IconStoreManagement,
		path: "store-management",
		permissions: ["superuser"],
	},
	{
		title: "مدیریت محصولات",
		icon: IconProductManagement,
		path: "product-management",
		permissions: ["superuser"],
	},
	{
		title: "مدیریت کارمندان",
		icon: IconStaffManagement,
		path: "staff-management",
		permissions: ["superuser"],
	},
	{
		title: "مدیریت مشتریان",
		icon: IconCustomerManagement,
		path: "customer-management",
		permissions: ["superuser", "staff", "secretary"],
	},
];

export const Sidebar = ({ sidebar, setSidebar }) => {
	const { logout, userInfo } = useAuthStore();

	const [open, setOpen] = useState(false);

	const handleLogout = () => {
		setOpen(false);
		logout();
	};

	return (
		<>
			<aside className={`${style.wrapper} ${sidebar ? "active" : ""}`}>
				<img
					className={style.close}
					alt="remove-icon"
					src={IconRemove}
					onClick={() => setSidebar(false)}
				/>
				<div className={style.header}>
					<div className={style.logo}>{/* <img src={logo} alt='logo' /> */}</div>
				</div>

				<div className={style.main}>
					<nav className={style.nav}>
						{menu.map((link, i) => {
							if (link?.permissions.includes(userInfo.type)) {
								return (
									<NavLink
										key={i}
										to={link.path}
										end
										className={style.nav__link}
										onClick={() => setSidebar(false)}
									>
										<img className={style.nav__linkIcon} src={link.icon} alt="icon" />
										<span className={style.nav__linkTitle}>{link.title}</span>
									</NavLink>
								);
							}
						})}

						<div className={style.nav__separator_bottom} />

						<button className={style.nav__link} onClick={() => setOpen(true)}>
							<img className={style.nav__linkIcon} alt="logout-icon" src={IconExit} />
							<span className={style.nav__linkTitle}>خروج</span>
						</button>
					</nav>
				</div>
			</aside>

			<Modal
				fullWidth
				state={open}
				setState={setOpen}
				title="خروج"
				footerEnd={
					<div className={style.buttons}>
						<Button size="xlarge" variant="ghost" onClick={() => setOpen(false)}>
							انصراف
						</Button>
						<Button size="xlarge" onClick={handleLogout}>
							تایید
						</Button>
					</div>
				}
			>
				<div className={style.exit}>آیا مطمئن هستید که میخواهید خارج شوید؟</div>
			</Modal>
		</>
	);
};
