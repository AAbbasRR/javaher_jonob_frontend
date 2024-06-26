import { NavLink } from "react-router-dom";
import IconStaffManagement from "src/assets/icons/icon-admin-management.svg";
import IconCustomerManagement from "src/assets/icons/icon-customer-management.svg";
import IconFactorManagement from "src/assets/icons/icon-customer-orders.svg";
import IconDriverManagement from "src/assets/icons/icon-delivery-gray.svg";
import IconHome from "src/assets/icons/icon-home.svg";
import IconProductManagement from "src/assets/icons/icon-product-management.svg";
import IconStoreManagement from "src/assets/icons/icon-store.svg";
import IconTime from "src/assets/icons/icon-time.svg";
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
		title: "رویداد ها",
		icon: IconTime,
		path: "history-management",
		permissions: ["superuser"],
	},
	{
		title: "انبار",
		icon: IconStoreManagement,
		path: "store-management",
		permissions: ["staff", "superuser"],
	},
	{
		title: "محصولات",
		icon: IconProductManagement,
		path: "product-management",
		permissions: ["staff", "superuser"],
	},
	{
		title: "فاکتور",
		icon: IconFactorManagement,
		path: "factor-management",
		permissions: ["superuser", "staff", "secretary", "worker"],
	},
	{
		title: "کارمندان",
		icon: IconStaffManagement,
		path: "staff-management",
		permissions: ["superuser"],
	},
	{
		title: "مشتریان",
		icon: IconCustomerManagement,
		path: "customer-management",
		permissions: ["superuser", "staff", "secretary"],
	},
	{
		title: "راننده ها",
		icon: IconDriverManagement,
		path: "driver-management",
		permissions: ["superuser", "staff", "secretary"],
	},
];

export const Navbar = () => {
	const claassName = ({ isActive }) => (isActive ? style.nav__link + " active" : style.nav__link);
	const { userInfo } = useAuthStore();

	return (
		<div className={style.wrapper}>
			<div className={style.main}>
				<nav className={style.nav}>
					{menu.map((link, i) => {
						if (link?.permissions.includes(userInfo.type)) {
							return (
								<NavLink key={i} to={link.path} end className={claassName}>
									<img className={style.nav__linkIcon} src={link.icon} alt="icon" />
									<span className={style.nav__linkTitle}>{link.title}</span>
								</NavLink>
							);
						}
					})}
				</nav>
			</div>
		</div>
	);
};
