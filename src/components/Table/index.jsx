import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { arSD, faIR } from "@mui/x-data-grid/locales";
import { forwardRef, useMemo } from "react";
import style from "./style.module.scss";
import { Empty } from "src/components/Empty";

const sx = {
	fontFamily: "inherit",
	border: "none",
	"& .MuiDataGrid-columnHeaders": {
		color: "var(--bl-on-surface-variant)",
		background: "var(--bl-surface-container-low)",
		border: "none",
		minHeight: "36px !important",
		borderTopLeftRadius: "1rem",
		borderTopRightRadius: "1rem",
	},
	"& .MuiDataGrid-columnHeader": {
		fontSize: "0.75rem",
		height: "36px !important",
		fontWeight: "500 !important",

		"&:focus": {
			outline: "none",
		},

		"&:focus-within": {
			outline: "none",
		},
	},
	".MuiDataGrid-cell": {
		justifyContent: "center",
	},
	"& .MuiDataGrid-row": {
		fontWeight: "500",
		fontSize: "0.875rem",
		color: "var(--bl-on-surface)",

		"&:nth-child(even)": {
			background: "var(--bl-surface-bright) !important",
		},

		"&.Mui-selected": {
			backgroundColor: "transparent",
		},
	},
	".MuiDataGrid-columnHeaderTitleContainer": {
		justifyContent: "center",
	},
	"& .MuiDataGrid-cell": {
		outline: "none",
		borderBottom: "none",
		textAlign: "center !important",
		alignContent: "center !important",

		"&:focus": {
			outline: "none",
		},

		"&:hover": {},
	},
	"& .MuiTablePagination-selectLabel": {
		marginBottom: 0,
	},
	"& .MuiTablePagination-displayedRows": {
		marginBottom: 0,
	},
	"& .MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
		fontSize: "0.75rem",
		fontFamily: "inherit",
		marginBottom: 0,
	},
};

export const Table = forwardRef(function ({ className, ...rest }, ref) {
	const existingTheme = useTheme();
	const theme = useMemo(
		() =>
			createTheme(
				{
					overrides: {
						MUIDataTable: {
							responsiveStacked: {
								maxHeight: "none",
								overflowX: "auto",
							},
						},
					},
				},
				arSD,
				existingTheme,
				{
					direction: "rtl",
				},
			),
		[existingTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<div className={`${style.table} ${className}`}>
				<DataGrid
					sx={sx}
					ref={ref}
					rowHeight={68}
					autoPageSize={false}
					disablePageSize
					disableColumnMenu
					pageSizeOptions={[5, 10, 25, 50]}
					localeText={faIR.components.MuiDataGrid.defaultProps.localeText}
					slots={{
						noRowsOverlay: Empty,
					}}
					{...rest}
				/>
			</div>
		</ThemeProvider>
	);
});
