"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Upload, Loader2, Bug, AlertTriangle, Leaf, Info, Microscope, Sprout, Check } from "lucide-react"

interface DiseaseResult {
  disease: string
  confidence: number
  description: string
  treatment: string[]
  preventionTips: string[]
  images: string[]
}

export function CropDiseaseDetector() {
  const { toast } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    setIsCapturing(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
      setIsCapturing(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setImage(imageDataUrl)
        stopCamera()

        // Auto analyze after capture
        analyzeImage(imageDataUrl)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string
        setImage(imageDataUrl)

        // Auto analyze after upload
        analyzeImage(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = (imageData: string) => {
    setIsAnalyzing(true)

    // In a real app, you would send the image to an API for analysis
    // For demo purposes, we'll simulate an API response after a delay
    setTimeout(() => {
      // Mock disease detection results
      const mockResults: DiseaseResult[] = [
        {
          disease: "Late Blight",
          confidence: 92.5,
          description:
            "Late blight is a disease of potato and tomato plants caused by the fungus-like oomycete pathogen Phytophthora infestans. It appears as dark, water-soaked lesions on leaves that quickly enlarge and turn brown.",
          treatment: [
            "Apply fungicides containing chlorothalonil, mancozeb, or copper compounds",
            "Remove and destroy infected plant parts",
            "Increase plant spacing to improve air circulation",
          ],
          preventionTips: [
            "Use resistant varieties",
            "Practice crop rotation",
            "Avoid overhead irrigation",
            "Plant in well-drained soil",
          ],
          images: ["/placeholder.svg?height=100&width=100"],
        },
        {
          disease: "Powdery Mildew",
          confidence: 88.3,
          description:
            "Powdery mildew is a fungal disease that affects a wide range of plants. It appears as white powdery spots on the leaves and stems of infected plants.",
          treatment: [
            "Apply fungicides containing sulfur or potassium bicarbonate",
            "Remove and destroy infected plant parts",
            "Apply neem oil or milk spray as organic alternatives",
          ],
          preventionTips: [
            "Ensure good air circulation around plants",
            "Avoid overhead watering",
            "Plant resistant varieties",
            "Avoid excessive nitrogen fertilization",
          ],
          images: ["/placeholder.svg?height=100&width=100"],
        },
        {
          disease: "Bacterial Leaf Spot",
          confidence: 76.8,
          description:
            "Bacterial leaf spot is caused by various species of bacteria. It appears as dark, water-soaked spots on leaves that may have a yellow halo.",
          treatment: [
            "Apply copper-based bactericides",
            "Remove and destroy infected plant parts",
            "Avoid working with plants when they are wet",
          ],
          preventionTips: [
            "Use disease-free seeds and transplants",
            "Practice crop rotation",
            "Avoid overhead irrigation",
            "Maintain proper plant spacing",
          ],
          images: ["/placeholder.svg?height=100&width=100"],
        },
      ]

      // Randomly select one of the mock results
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(randomResult)
      setIsAnalyzing(false)
    }, 2000)
  }

  const resetDetection = () => {
    setImage(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
          High Confidence ({confidence.toFixed(1)}%)
        </Badge>
      )
    } else if (confidence >= 70) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
          Medium Confidence ({confidence.toFixed(1)}%)
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
          Low Confidence ({confidence.toFixed(1)}%)
        </Badge>
      )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Crop Disease Detector</span>
          {result && getConfidenceBadge(result.confidence)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!image ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Upload Image</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Upload a clear image of the affected plant part
                </p>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current?.click()}>Choose File</Button>
              </div>

              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Take Photo</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Use your camera to take a photo of the affected plant
                </p>
                <Button onClick={startCamera}>Open Camera</Button>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="relative mb-6">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded plant"
                  className="max-h-[300px] rounded-lg object-contain"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-white mx-auto mb-2" />
                    <p className="text-white font-medium">Analyzing image...</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Our AI is analyzing your image to identify potential diseases. This may take a few moments.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Analyzed plant"
                      className="w-full rounded-lg object-cover aspect-square"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">{result.disease}</Badge>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="p-4 border rounded-lg h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-medium">{result.disease}</h3>
                      {getConfidenceBadge(result.confidence)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{result.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>
                        This is an AI-powered analysis. For critical cases, consult with an agricultural expert.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="treatment" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                  <TabsTrigger value="prevention">Prevention</TabsTrigger>
                  <TabsTrigger value="info">More Info</TabsTrigger>
                </TabsList>

                <TabsContent value="treatment" className="space-y-4 pt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Microscope className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Recommended Treatment</h3>
                    </div>

                    <ul className="space-y-2">
                      {result.treatment.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Important Note</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Always follow product labels when applying treatments. Consider organic alternatives when
                            possible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="prevention" className="space-y-4 pt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Sprout className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Prevention Tips</h3>
                    </div>

                    <ul className="space-y-2">
                      {result.preventionTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Leaf className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Best Practices</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Prevention is always better than treatment. Regular monitoring and good agricultural
                            practices can significantly reduce disease incidence.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-4 pt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Bug className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Disease Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Symptoms</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.disease === "Late Blight"
                            ? "Dark, water-soaked lesions on leaves that quickly enlarge and turn brown. White, fuzzy growth may appear on the undersides of leaves in humid conditions. Infected tubers show copper-brown, granular rot."
                            : result.disease === "Powdery Mildew"
                              ? "White powdery spots on leaves and stems that gradually cover the entire surface. Leaves may yellow, curl, and drop prematurely. Severe infections can reduce yield and fruit quality."
                              : "Dark, water-soaked spots on leaves that may have a yellow halo. Spots may merge to form larger lesions. Leaves may eventually turn yellow and drop. Fruit may develop raised, scabby spots."}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Disease Cycle</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.disease === "Late Blight"
                            ? "The pathogen overwinters in infected tubers or plant debris. In spring, spores are produced and spread by wind and rain. Infection is favored by cool, wet conditions (10-25°C) with high humidity."
                            : result.disease === "Powdery Mildew"
                              ? "The fungus overwinters in plant debris or as dormant mycelium in buds. Spores are produced in spring and spread by wind. Infection is favored by high humidity but dry leaf surfaces, and moderate temperatures (15-28°C)."
                              : "The bacteria overwinter in infected plant debris or seeds. They are spread by splashing water, tools, and handling. Infection is favored by warm, wet conditions (25-30°C) with high humidity."}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Economic Impact</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.disease === "Late Blight"
                            ? "Late blight can cause complete crop failure in severe cases. It was responsible for the Irish Potato Famine in the 1840s and continues to be one of the most destructive plant diseases worldwide."
                            : result.disease === "Powdery Mildew"
                              ? "Powdery mildew can reduce yield by 20-40% in susceptible crops. It affects photosynthesis, reduces fruit quality, and can cause premature defoliation."
                              : "Bacterial leaf spot can reduce marketability of crops and cause yield losses of 10-30%. Severe infections can lead to complete defoliation and significant economic losses."}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={resetDetection}>
                  Analyze Another Image
                </Button>
                <Button>Save Report</Button>
              </div>
            </div>
          ) : null}

          {isCapturing && (
            <div className="fixed inset-0 bg-background z-50 flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">Take a Photo</h3>
                <Button variant="ghost" size="icon" onClick={stopCamera}>
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 flex items-center justify-center bg-black">
                <video ref={videoRef} autoPlay playsInline className="max-h-full max-w-full" />
              </div>

              <div className="p-4 border-t flex justify-center">
                <Button size="lg" onClick={captureImage}>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture
                </Button>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
