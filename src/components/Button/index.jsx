import { memo, forwardRef } from "react";
import { Spin } from "../Spin";
import style from "./style.module.scss";

const ButtonCustom = forwardRef(function (props, ref) {
	const { size, variant, noTitle, loading, className = "", children, ...rest } = props;
	const sizeClass = size ? style[`button_${size}`] : "";
	const variantClass = variant ? style[`button_${variant}`] : "";
	const noTitleClass = noTitle ? style["button_noTitle"] : "";

	return (
		<button
			className={`${style.button} ${className} ${sizeClass} ${variantClass} ${noTitleClass}`}
			ref={ref}
			{...rest}
		>
			{children} {loading && <Spin className={style.spin} size={16} />}
		</button>
	);
});

export const Button = memo(ButtonCustom);
