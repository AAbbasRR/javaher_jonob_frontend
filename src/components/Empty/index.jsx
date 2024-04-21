import React from "react";
import NoDaata from "src/assets/icons/icon-search-document.svg";
import style from "./style.module.scss";

export const Empty = ({ className }) => {
	return (
		<span className={`${style.wrapper} ${className}`}>
			<img src={NoDaata} className={style.icom} alt="no-data" />
			رکوردی یافت نشد
		</span>
	);
};
