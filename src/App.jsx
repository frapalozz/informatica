import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Container from "./components/Container"

export default function App() {

  return (
    <main className="flex flex-col w-screen justify-center items-center font-montserrat bg-stone-950 min-h-dvh">
      <Navbar />

      <Container />

      <Footer />
    </main>
  )
}

