import { useEffect, useState } from "react";
import { hono } from "./rpc";

function App() {
	const [message, setMessage] = useState("");
	useEffect(() => {
		hono.api.$get().then(async (res) => {
			const data = await res.json();
			setMessage(data.message);
		});
	}, []);

	return (
		<div>
			<h1>Primal Sheets</h1>
			<p>Message: {message}</p>
		</div>
	);
}

export default App;
