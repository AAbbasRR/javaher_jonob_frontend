import { useState } from "react";
import { NavLink } from "react-router-dom";
import IconExit from "src/assets/icons/icon-exit.svg";
import IconLock from "src/assets/icons/icon-lock.svg";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useAuthStore from "src/store";
import style from "./style.module.scss";

const menu = [
	{
		title: "تغییر رمزعبور",
		icon: IconLock,
		path: "change-password",
		permissions: ["superuser", "staff", "secretary", "worker"],
	},
];

export const Header = () => {
	const claassName = ({ isActive }) => (isActive ? style.nav__link + " active" : style.nav__link);
	const { logout, userInfo } = useAuthStore();

	const [open, setOpen] = useState(false);

	const handleLogout = () => {
		setOpen(false);
		logout();
	};

	return (
		<>
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
						<button className={style.nav__link} onClick={() => setOpen(true)}>
							<img className={style.nav__linkIcon} alt="logout-icon" src={IconExit} />
							<span className={style.nav__linkTitle}>خروج</span>
						</button>
					</nav>
				</div>
			</div>
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
