import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'ServeNow Workforce OS',
  description: 'Operating System for Customer-to-Workforce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
