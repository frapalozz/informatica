import CardGrid from "./components/cardgrid";
import Popup from "./components/Popup";

export default function Home() {
  return (
    <>
      <Popup />
      <main className="flex min-h-screen flex-col items-center justify-start w-full">
        <CardGrid anno="1" />
      </main>
    </>
    
  );
}
