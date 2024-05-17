import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

const RightToLeftLayout = ({ children }) => {
	const rtltheme = createTheme({
		direction: "rtl",
	});
	const cacheRtl = createCache({
		key: "muirtl",
		stylisPlugins: [prefixer, rtlPlugin],
	});
	return (
		<CacheProvider value={cacheRtl}>
			<ThemeProvider theme={rtltheme}>{children}</ThemeProvider>
		</CacheProvider>
	);
};

export default RightToLeftLayout;
