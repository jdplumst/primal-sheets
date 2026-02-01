import { useEffect, useState } from "react";
import { api } from "./rpc";

function App() {
	const [message, setMessage] = useState("");
	useEffect(() => {
		api.index.$get().then(async (res) => {
			const data = await res.json();
			setMessage(data.message);
		});
	});

	return (
		<div>
			<h1>Primal Sheets</h1>
			<p>Message: {message}</p>
		</div>
	);
}

export default App;
