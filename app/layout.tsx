import './globals.css';
import Navbar from './Components/Navbar';

export const metadata = {
  title: 'Assignment App',
  description: 'Next.js Assignment for MALLAM VIKRAM ADITHYA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define currentDate here inside the component
  const currentDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
        <footer className="footer">
          &copy; <strong>{currentDate}</strong> MALLAM VIKRAM ADITHYA | 21950303
        </footer>
      </body>
    </html>
  );
}
