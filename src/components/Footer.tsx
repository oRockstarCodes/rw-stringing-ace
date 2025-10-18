const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">RW Stringing Service</h3>
          <p className="text-primary-foreground/80 mb-4">
            Professional badminton stringing you can trust
          </p>
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} RW Stringing Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
