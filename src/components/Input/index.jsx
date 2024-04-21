import IconClips from "src/assets/icons/icon-clips-gray.svg";
import { memo, forwardRef } from "react";
import style from "./style.module.scss";

export const InputCustom = forwardRef(function (props, ref) {
	const {
		size,
		label = "",
		error = "",
		className = "",
		helperText = "",
		required = false,
		rightIcon = "",
		leftIcon = "",
		counter = "",
		readonly,
		children,
		...rest
	} = props;
	const sizeClass = size ? style[`input_${size}`] : "";
	const typeClass = size ? style[`input_${props.type}`] : "";

	return (
		<div
			className={`${style.input} ${sizeClass} ${typeClass} ${className} ${
				leftIcon ? "hasLeftIcon" : ""
			} ${rightIcon ? "hasRightIcon" : ""} ${error ? "error" : ""}`}
		>
			{label && (
				<label className={style.input__label}>
					{label} {required && <span className={style.input__required}>*</span>}
				</label>
			)}

			<div className={style.input__inputWrapper}>
				{props.type === "file" && <img src={IconClips} className={style.input__attach} />}
				{rightIcon && <span className={style.input__icon}>{rightIcon}</span>}

				{props.type === "textarea" ? (
					<textarea className={style.input__textarea} readOnly={readonly} ref={ref} {...rest} />
				) : (
					<input className={style.input__input} readOnly={readonly} ref={ref} {...rest} />
				)}

				{leftIcon && <span className={style.input__icon}>{leftIcon}</span>}
			</div>

			{(error || helperText || counter) && (
				<div className={style.input__help}>
					{(helperText || error) && (
						<span className={style.input__helpText}>{error || helperText}</span>
					)}
					{counter && <span className={style.input__helpCounter}>۱/۱۰۰۰</span>}
				</div>
			)}
		</div>
	);
});

export const Input = memo(InputCustom);
