'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    User,
    Wallet,
    ArrowLeft,
    CheckCircle,
    Upload,
    Loader2,
  } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"
import Link from "next/link"

const Page: React.FC = () => {
  const router = useRouter()
  
  const {
    setShowRegistration,
    handleRegistration,
    profileData,
    registrationData,
    setRegistrationData,
    isRegistrationPending,
    isRegistrationSuccess,
    generateNewRegistrationAvatar,
    error
  } = useUser()

  // Handle successful registration - redirect to profile page
  useEffect(() => {
    if (isRegistrationSuccess) {
      // Small delay to show success state before redirect
      const timer = setTimeout(() => {
        setShowRegistration(false)
        router.push('/')
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isRegistrationSuccess, setShowRegistration, router])

  const handleCancel = (): void => {
    setShowRegistration(false)
    router.push('/profile')
  }

  const handleCreateProfile = async (): Promise<void> => {
    await handleRegistration()
  }

  const handleGenerateAvatar = (): void => {
    generateNewRegistrationAvatar()
  }

  return (
    <div className="min-h-screen bg-gray-50">
    
    

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {isRegistrationSuccess ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isRegistrationSuccess ? 'Profile Created!' : 'Create Your Profile'}
            </CardTitle>
            <CardDescription>
              {isRegistrationSuccess 
                ? 'Redirecting you to your profile...' 
                : 'Set up your Save Circle profile to start your savings journey'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Wallet Address Display */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Wallet Connected</p>
                  <p className="text-sm text-green-700 font-mono">
                    {profileData.walletAddress || 'No wallet connected'}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="text-center space-y-4">
              <Label className="text-base font-medium">Profile Picture</Label>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={registrationData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {registrationData.name ? registrationData.name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateAvatar}
                    disabled={isRegistrationPending || isRegistrationSuccess}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Generate Avatar
                  </Button>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Display Name / Nickname
              </Label>
              <Input
                id="name"
                placeholder="Enter your display name or nickname"
                value={registrationData.name}
                onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                className="text-lg"
                disabled={isRegistrationPending || isRegistrationSuccess}
              />
              <p className="text-sm text-gray-500">
                This name will be visible to other members in your savings circles
              </p>
            </div>

            {/* Registration Info */}
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
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent" 
                onClick={handleCancel}
                disabled={isRegistrationPending || isRegistrationSuccess}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleCreateProfile}
                disabled={!registrationData.name.trim() || isRegistrationPending || isRegistrationSuccess}
              >
                {isRegistrationPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : isRegistrationSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Profile Created!
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page