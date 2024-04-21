import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import IconInfo from "src/assets/icons/icon-info.svg";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import style from "./style.module.scss";

const ImportMedicineModal = ({ open, setOpen, reload, setReload }) => {
	const [loading, setLoading] = useState(false);
	const [updateCheckBox, setUpdateCheckBox] = useState(false);
	const [excellFile, setExcellFile] = useState(null);
	const [fileError, setFileError] = useState(null);

	const handleSubmit = () => {
		setLoading(true);
		let newData = new FormData();
		newData.append("data_file", excellFile);
		newData.append("update", updateCheckBox);

		axios
			.post(`/admin/medicine/manage/import/`, newData)
			.then((res) => {
				closeModal();
				notify("با موفقیت انجام شد", "success");
				setReload(!reload);
			})
			.catch((err) => {
				const response = err?.response?.data ?? {};

				if (Object.hasOwn(response, "detail")) {
					notify(response.detail, "error");
				} else {
					for (let key in response) {
						setFileError(response[key][0]);
					}
				}
			})
			.finally(() => setLoading(false));
	};
	const closeModal = () => {
		setOpen(false);
		setUpdateCheckBox(false);
		setExcellFile(null);
		setFileError(null);
	};

	useEffect(() => {
		setFileError(null);
	}, [excellFile]);

	return (
		<Modal
			fullWidth
			state={open}
			setState={closeModal}
			maxWidth="md"
			footerEnd={
				<div className={style.buttons}>
					<Button size="xlarge" variant="ghost" onClick={closeModal}>
						انصراف
					</Button>
					<Button size="xlarge" onClick={handleSubmit} loading={loading}>
						تایید
					</Button>
				</div>
			}
		>
			<form className={style.form}>
				<Typography fontSize="small" className={style.form__inputFull}>
					<img src={IconInfo} alt="info" /> فرمت های قابل تایید برای فایل: xlsx, csv
				</Typography>
				<Button className={style.form__inputFull}>
					{excellFile?.name ? excellFile?.name : "انتخاب فایل"}
					<input
						className={style.fileUploadInput}
						type="file"
						onChange={(event) => setExcellFile(event.target.files[0])}
					/>
				</Button>
				{fileError && (
					<Typography className={style.form__inputFull} color="error">
						{fileError}
					</Typography>
				)}
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={updateCheckBox}
								onChange={(e) => setUpdateCheckBox(e.target.checked)}
							/>
						}
						label="بروزرسانی داده هایی که از قبل ثبت شده اند"
					/>
				</FormGroup>
			</form>
		</Modal>
	);
};

export default ImportMedicineModal;
