import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <div className="appShell">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App