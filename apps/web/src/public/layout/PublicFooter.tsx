export default function PublicFooter() {
  return (
    <footer className="border-t border-gray-100 py-6 mt-16">
      <p className="text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Century 21 · Todos los derechos reservados
      </p>
    </footer>
  );
}
