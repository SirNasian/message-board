import * as React from "react";
import { createRoot } from "react-dom/client";

const Counter = () => {
	const [count, setCount] = React.useState<number>(0);
	return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

createRoot(document.getElementById("root")).render(<Counter />);
