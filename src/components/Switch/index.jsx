import MuiSwitch from "@mui/material/Switch";
import { forwardRef } from "react";

const sxProps = {
	width: 42,
	height: 26,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: "2px",
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: "var(--bl-secondary)",
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#33cf4d",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color: "#fff",
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: 0.7,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 22,
		height: 22,
	},
	"& .MuiSwitch-track": {
		borderRadius: 26 / 2,
		backgroundColor: "#E9E9EA",
		opacity: 1,
		transition: "background .5s",
	},
};

export const Switch = forwardRef(function ({ sx, ...props }, ref) {
	return (
		<MuiSwitch
			sx={sxProps}
			focusVisibleClassName=".Mui-focusVisible"
			disableRipple
			{...props}
			{...ref}
		/>
	);
});
