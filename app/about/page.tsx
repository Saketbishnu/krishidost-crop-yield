import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, BarChart, Sprout, Droplets, Bug, Sun } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                About Krishimitra
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering farmers with AI-powered insights and recommendations
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription>Revolutionizing agriculture through technology and data-driven insights</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Krishimitra is dedicated to empowering farmers across India and beyond with cutting-edge technology that
                makes precision agriculture accessible to everyone. Our AI-powered platform analyzes various factors
                affecting crop yield and provides actionable recommendations to maximize productivity and
                sustainability.
              </p>
              <p>
                We believe that by combining traditional farming knowledge with modern data analytics, we can help
                farmers make better decisions, increase their yields, and improve their livelihoods while promoting
                sustainable agricultural practices.
              </p>
              <div className="flex justify-center my-6">
                <Badge
                  variant="outline"
                  className="text-lg py-2 px-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                >
                  <span className="font-semibold">Developed by Saket Bishnu</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <FeatureCard
              icon={<Leaf className="h-8 w-8 text-green-500" />}
              title="Crop Yield Prediction"
              description="AI-powered predictions based on multiple environmental and agricultural factors"
            />
            <FeatureCard
              icon={<BarChart className="h-8 w-8 text-blue-500" />}
              title="Market Price Analysis"
              description="Real-time market prices from major agricultural markets across the country"
            />
            <FeatureCard
              icon={<Sun className="h-8 w-8 text-yellow-500" />}
              title="Weather Forecasting"
              description="Location-based weather forecasts to help plan farming activities"
            />
            <FeatureCard
              icon={<Sprout className="h-8 w-8 text-emerald-500" />}
              title="Crop Rotation Planning"
              description="Intelligent recommendations for optimal crop rotation sequences"
            />
            <FeatureCard
              icon={<Droplets className="h-8 w-8 text-cyan-500" />}
              title="Water Management"
              description="Irrigation scheduling based on crop needs and weather conditions"
            />
            <FeatureCard
              icon={<Bug className="h-8 w-8 text-red-500" />}
              title="Pest & Disease Alerts"
              description="Early warnings about potential pest and disease outbreaks in your region"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Team</CardTitle>
              <CardDescription>
                A dedicated group of agricultural experts, data scientists, and developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Krishimitra is built by a passionate team that combines expertise in agriculture, data science, and
                software development. We work closely with agricultural universities, research institutions, and most
                importantly, farmers themselves to ensure our platform delivers practical and valuable insights.
              </p>
              <div className="flex items-center justify-center">
                <Users className="h-16 w-16 text-green-500 mr-4" />
                <div>
                  <h3 className="text-xl font-medium">Join Our Community</h3>
                  <p className="text-muted-foreground">Connect with other farmers and agricultural experts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="overflow-hidden border-t-4 border-t-green-500">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
