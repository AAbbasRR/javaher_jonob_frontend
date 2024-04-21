import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import React from "react";

export function Spin({ className = "", size = 24 }) {
	return (
		<Stack className={className} sx={{ color: "grey.900", margin: "auto" }}>
			<CircularProgress size={size} color="inherit" />
		</Stack>
	);
}
