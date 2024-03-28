import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Container from "./components/Container"

export default function App() {

  return (
    <div className="font-mono">
      <main className="flex flex-col w-screen justify-center items-center font-montserrat dark:bg-stone-950 bg-stone-100 min-h-dvh">
        <Navbar />

        <Container />

        <Footer />
      </main>
    </div>
    
  )
}

