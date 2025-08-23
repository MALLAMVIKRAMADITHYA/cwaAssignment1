import './globals.css';
import Navbar from './Components/Navbar';
import DarkModeToggle from './Components/togglebutton'; // We'll create this component

export const metadata = {
  title: 'Assignment App',
  description: 'Next.js Assignment for MALLAM VIKRAM ADITHYA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Current date formatting
  const currentDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <html lang="en">
      <body>
        <Navbar />
        
        {/* Wrapper div for toggle and main content */}
        <div style={{ position: 'relative' }}>
          {/* Dark mode toggle placed below navbar, top right */}
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
            <DarkModeToggle />
          </div>

          <main className="main-content" style={{ paddingTop: '50px' }}>
            {children}
          </main>
        </div>

        <footer className="footer">
          &copy; <strong>{currentDate}</strong> MALLAM VIKRAM ADITHYA | 21950303
        </footer>
      </body>
    </html>
  );
}
