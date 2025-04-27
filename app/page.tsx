import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CropAdvisor } from "@/components/crop-advisor"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <CropAdvisor />
      </main>
      <Footer />
    </div>
  )
}
