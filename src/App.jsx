import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Footer from "./components/Footer"
import Card from "./components/Card"

export default function App() {

  return (
    <main className="flex flex-col w-screen justify-center items-center font-montserrat bg-zinc-900">
      <Navbar />
      <Hero />
      <Card />

      <Footer />
    </main>
  )
}

