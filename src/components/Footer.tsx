const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-100 py-8 border-t-2 border-yellow-400/20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            RW Stringing Service
          </h3>
          <p className="text-zinc-300 mb-4">
            Professional badminton stringing you can trust
          </p>
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} RW Stringing Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;