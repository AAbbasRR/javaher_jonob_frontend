import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import Pages from "./pages";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
	return (
		<>
			<BrowserRouter>
				<ToastContainer />
				<Pages />
			</BrowserRouter>
		</>
	);
}

export default App;
