import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import { forwardRef, memo, useId } from "react";
import { Controller } from "react-hook-form";
import IconArrow from "src/assets/icons/icon-arrow-select.svg";
import style from "./style.module.scss";

const sxProps = {
	fontFamily: "inherit",
	boxShadow: "none",
	borderRadius: "0.75rem",
	border: "1px solid var(--bl-on-surface-38)",
	backgroundColor: "var(--bl-surface-container-lowest)",
	"&.MuiFilledInput-root": {
		borderColor: "transparent",
		color: "var(--bl-on-surface)",
		backgroundColor: "var(--bl-surface-container-low)",
	},
	"& .MuiSvgIcon-root": {
		right: "unset",
		left: "7px",
		top: "calc(50%)",
		transform: "translateY(-50%)",
		width: "18px",
		height: "18px",
	},
	"& .MuiInputBase-input": {
		position: "relative",
		fontSize: "1rem",
		height: "3rem !important",
		lineHeight: "3rem !important",
		padding: "0.25rem 0.75rem 0.25rem !important",
		minHeight: "unset",
		"&:focus": {
			boxShadow: "none",
			backgroundColor: "transparent",
		},
	},
	"&.MuiInputBase-sizeXLarge .MuiInputBase-input": {
		height: "2.875rem",
		lineHeight: "2.875rem",
	},
	"&.MuiInputBase-sizeLarge .MuiInputBase-input": {
		height: "2.375rem",
		lineHeight: "2.375rem",
	},
	"&.MuiInputBase-sizeSmall": {
		borderRadius: "0.5rem",
		"& .MuiInputBase-input": {
			height: "1.625rem",
			lineHeight: "1.625rem",
		},
	},
	"&.MuiInputBase-sizeXSmall": {
		borderRadius: "0.5rem",
		"& .MuiInputBase-input": {
			height: "1.25rem",
			lineHeight: "1.25rem",
		},
	},
};

const menuProps = {
	PaperProps: {
		sx: {
			boxShadow: "0px 2px 24px 0px #0000001F",
			"& .MuiList-root.MuiMenu-list": {
				padding: ".5rem",
			},
			"& .MuiButtonBase-root.MuiMenuItem-root": {
				fontFamily: "inherit",
				fontSize: "0.75rem",
				padding: "0.3125rem 0.5rem",
				borderRadius: "0.5rem",
				color: "var(--bl-on-surface-variant2)",
				"&:hover": {
					backgroundColor: "var(--bl-secondary-container)",
				},
				"&.Mui-selected": {
					color: "var(--bl-on-surface)",
					backgroundColor: "var(--bl-secondary-container)",
				},
			},
		},
	},
};

const SelectCustom = forwardRef(function (props, ref) {
	const id = useId();
	const {
		size,
		multiple,
		label = "",
		error = "",
		className = "",
		helperText = "",
		required = false,
		control,
		options = [],
		placeholder = "",
		variant = "standard",
		children,
		...rest
	} = props;

	return (
		<div className={`${style.select} ${className} ${error ? "error" : ""}`}>
			{label && (
				<label htmlFor={id} className={style.select__label}>
					{label} {required && <span className={style.select__required}>*</span>}
				</label>
			)}

			<FormControl key={id} sx={{ minWidth: 136 }} variant={variant} size={size} {...rest}>
				{control ? (
					<Controller
						control={control}
						defaultValue={multiple ? [] : null}
						render={({ field }) => (
							<MuiSelect
								{...field}
								id={id}
								labelId={id}
								displayEmpty
								multiple={multiple}
								disableUnderline={true}
								IconComponent={() => (
									<img className={style.select__arrow} src={IconArrow} alt="arrow-icon" />
								)}
								renderValue={(selected) => {
									if (selected === undefined || selected?.[0] === undefined) {
										return <span className={style.select__placeholder}>{placeholder}</span>;
									}

									if (Array.isArray(selected)) {
										let result = [];
										for (let key of selected) {
											result.push(options.find((item) => item.value === key)?.name);
										}

										return result.join(",");
									}

									return options.find((item) => item.value === selected)?.name;
								}}
								sx={sxProps}
								MenuProps={menuProps}
							>
								{children
									? children
									: options.map((option, i) => (
											<MenuItem key={i} disabled={option.disabled} value={option.value ?? ""}>
												{option.name}
											</MenuItem>
									  ))}
							</MuiSelect>
						)}
						{...rest}
					/>
				) : (
					<MuiSelect
						id={id}
						labelId={id}
						displayEmpty
						multiple={multiple}
						disableUnderline={true}
						IconComponent={() => (
							<img className={style.select__arrow} src={IconArrow} alt="arrow-icon" />
						)}
						renderValue={(selected) => {
							if (selected === undefined || selected?.[0] === undefined) {
								return <span className={style.select__placeholder}>{placeholder}</span>;
							}

							if (Array.isArray(selected)) {
								let result = [];
								for (let key of selected) {
									result.push(options.find((item) => item.value === key)?.name);
								}

								return result.join(",");
							}

							return options.find((item) => item.value === selected)?.name;
						}}
						sx={sxProps}
						MenuProps={menuProps}
						{...rest}
					>
						{children
							? children
							: options.map((option, i) => (
									<MenuItem key={i} disabled={option.disabled} value={option.value ?? ""}>
										{option.name}
									</MenuItem>
							  ))}
					</MuiSelect>
				)}
			</FormControl>

			{(error || helperText) && (
				<div className={style.select__help}>
					{(helperText || error) && (
						<span className={style.select__helpText}>{error || helperText}</span>
					)}
				</div>
			)}
		</div>
	);
});

export const Select = memo(SelectCustom);
