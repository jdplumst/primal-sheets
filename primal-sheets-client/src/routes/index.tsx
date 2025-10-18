import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8787/");
      if (!res.ok) {
        console.error("Failed to fetch data");
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      console.log(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
