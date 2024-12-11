import CardGrid from "./components/cardgrid";
import Popup from "./components/Popup";

export default function Home() {
  return (
    <>
      <Popup />
      <main className="flex min-h-screen flex-col items-center justify-start w-full xl:mb-9 lg:mb-7 md:mb-5 mb-4">
        <CardGrid anno="1" />
      </main>
    </>
    
  );
}
