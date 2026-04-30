import app from "./server";

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));
