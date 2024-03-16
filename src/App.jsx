import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Footer from "./components/Footer"
import CardGrid from "./components/CardGrid"

export default function App() {

  return (
    <main className="flex flex-col w-screen justify-center items-center font-montserrat bg-stone-950 min-h-dvh">
      <Navbar />
      <Hero />
      <CardGrid />

      <Footer />
    </main>
  )
}

