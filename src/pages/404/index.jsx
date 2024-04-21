import { Link } from "react-router-dom";
import IconArrow from "src/assets/icons/icon-more-left-blue.svg";
import ImageNotfound from "src/assets/images/not-found.png";
import style from "./style.module.scss";

const NotFound = () => {
	return (
		<div className="container">
			<div className={style.wrapper}>
				<div className={style.main}>
					<img src={ImageNotfound} alt="notfound-icon" />
					<div className={style.content}>
						404 <span className={style.text}>صفحه‌ای که دنبال آن بودید پیدا نشد!</span>
					</div>
					<Link className={style.link} to="/">
						رفتن به صفحه اصلی
						<img src={IconArrow} alt="arrow-icon" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
