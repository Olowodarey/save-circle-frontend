"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, User, Wallet, CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678", // This would come from wallet connection
  })

  const handleSubmit = async () => {
    // Here you would call the smart contract to register the user
    // const result = await registerUser(formData.name, formData.avatar)
    console.log("Registering user:", formData)

    // Simulate registration
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  const generateAvatar = () => {
    const avatars = [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ]
    setFormData({ ...formData, avatar: avatars[Math.floor(Math.random() * avatars.length)] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Your Profile</CardTitle>
          <CardDescription>Set up your Save Circle profile to start your savings journey</CardDescription>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Profile Info</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Wallet Address Display */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Wallet Connected</p>
                    <p className="text-sm text-green-700 font-mono">{formData.walletAddress}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="text-center space-y-4">
                <Label className="text-base font-medium">Profile Picture</Label>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={generateAvatar}>
                      <Upload className="w-4 h-4 mr-2" />
                      Generate Avatar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Display Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your display name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  This name will be visible to other members in your savings circles
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.push("/")}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setStep(2)} disabled={!formData.name.trim()}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Confirm Your Profile</h3>
                <p className="text-gray-600 mb-6">Please review your information before creating your profile</p>
              </div>

              {/* Profile Summary */}
              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xl font-semibold">{formData.name}</h4>
                    <p className="text-gray-600 font-mono text-sm">{formData.walletAddress}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Initial Reputation</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">New Member</Badge>
                      <span className="font-semibold">0 points</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Getting Started</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your profile will be stored on the Starknet blockchain</li>
                  <li>• Start building reputation by joining and completing savings circles</li>
                  <li>• Higher reputation unlocks access to premium groups</li>
                  <li>• Always contribute on time to maintain your reputation score</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  Create Profile
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
