import app from './server';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor Century 21 corriendo en http://localhost:${PORT}`);
});
