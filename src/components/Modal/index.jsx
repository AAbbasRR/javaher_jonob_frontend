import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconClose from "src/assets/icons/icon-close.svg";
import style from "./style.module.scss";

const sxProps = {
	"& .MuiDialog-paper": {
		margin: "auto 16px",
		width: "calc(100% - 32px)",
		borderRadius: "0.75rem",
		"&.MuiDialog-paperFullScreen": {
			margin: "0",
			width: "100%",
			borderRadius: "0",
		},
		"&.MuiDialog-paperWidthSm": {
			maxWidth: "500px",
		},
		"&.MuiDialog-paperWidthMd": {
			maxWidth: "750px",
		},
	},
};

export const Modal = ({
	state,
	setState,
	fullScreen,
	title,
	footerStart,
	footerEnd,
	children,
	...rest
}) => {
	const theme = useTheme();
	const fScreen = useMediaQuery(theme.breakpoints.down("md"));
	const fullScreenProps = fullScreen ? { fullScreen: fScreen } : {};

	const handleClose = () => {
		setState(false);
	};

	return (
		<Dialog
			sx={sxProps}
			open={state}
			{...fullScreenProps}
			keepMounted
			onClose={handleClose}
			{...rest}
		>
			<div className={style.wrapper}>
				<div className={style.header}>
					{title}
					<img
						src={IconClose}
						className={style.header__close}
						onClick={handleClose}
						alt="icon-close"
					/>
				</div>

				<div className={style.main}>{children}</div>

				{(footerStart || footerEnd) && (
					<div className={style.footer}>
						{footerStart && <div>{footerStart}</div>}
						{footerEnd && <div>{footerEnd}</div>}
					</div>
				)}
			</div>
		</Dialog>
	);
};
