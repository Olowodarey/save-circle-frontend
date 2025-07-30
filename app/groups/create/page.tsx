"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Lock, Mail, Plus, X, ArrowLeft, Shield, Info, Coins } from "lucide-react"
import Link from "next/link"

export default function CreateGroupPage() {
  const [groupType, setGroupType] = useState<"public" | "private">("public")
  const [lockEnabled, setLockEnabled] = useState(false)
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [selectedToken, setSelectedToken] = useState("usdc")
  const [lockAmount, setLockAmount] = useState("")

  const supportedTokens = [
    { value: "usdc", label: "USDC", icon: "💵" },
    { value: "eth", label: "ETH", icon: "⟠" },
    { value: "strk", label: "STRK", icon: "🔺" },
    { value: "usdt", label: "USDT", icon: "₮" },
    { value: "dai", label: "DAI", icon: "◈" },
    { value: "wbtc", label: "WBTC", icon: "₿" },
  ]

  const addEmail = () => {
    if (currentEmail && !inviteEmails.includes(currentEmail)) {
      setInviteEmails([...inviteEmails, currentEmail])
      setCurrentEmail("")
    }
  }

  const removeEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/groups">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Save Circle</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Savings Group</h1>
          <p className="text-gray-600">Set up a new savings circle for your community</p>
        </div>

        <Tabs
          value={groupType}
          onValueChange={(value) => setGroupType(value as "public" | "private")}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Public Group
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Private Group
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Public Group Settings
                </CardTitle>
                <CardDescription>
                  Create a public group that anyone can join based on reputation criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input id="groupName" placeholder="e.g., Crypto Enthusiasts Circle" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Maximum Members</Label>
                    <Input id="maxMembers" type="number" placeholder="Enter max members (2-100)" min="2" max="100" />
                    <p className="text-sm text-gray-500">Minimum 2 members, maximum 100 members</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your group's purpose and goals..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contribution">Contribution Amount</Label>
                    <div className="flex">
                      <Input id="contribution" placeholder="100" className="rounded-r-none" />
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger className="w-32 rounded-l-none border-l-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedTokens.map((token) => (
                            <SelectItem key={token.value} value={token.value}>
                              <div className="flex items-center gap-2">
                                <span>{token.icon}</span>
                                <span>{token.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-gray-500">
                      {selectedToken !== "usdc" && "Will be automatically converted to USDC"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Payment Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minReputation">Minimum Reputation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No minimum (0)</SelectItem>
                        <SelectItem value="25">Beginner (25+)</SelectItem>
                        <SelectItem value="50">Intermediate (50+)</SelectItem>
                        <SelectItem value="75">Advanced (75+)</SelectItem>
                        <SelectItem value="90">Expert (90+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Trust Lock System */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <Label htmlFor="lockToggle" className="font-medium">
                          Enable Trust Lock System
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Lock additional tokens to build trust and guarantee early withdrawal rights
                      </p>
                    </div>
                    <Switch id="lockToggle" checked={lockEnabled} onCheckedChange={setLockEnabled} />
                  </div>

                  {lockEnabled && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lockAmount">Lock Amount (Optional)</Label>
                          <div className="flex">
                            <Input
                              id="lockAmount"
                              placeholder="0"
                              value={lockAmount}
                              onChange={(e) => setLockAmount(e.target.value)}
                              className="rounded-r-none"
                            />
                            <Select value={selectedToken} onValueChange={setSelectedToken}>
                              <SelectTrigger className="w-32 rounded-l-none border-l-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {supportedTokens.map((token) => (
                                  <SelectItem key={token.value} value={token.value}>
                                    <div className="flex items-center gap-2">
                                      <span>{token.icon}</span>
                                      <span>{token.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Lock Benefits</Label>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>Higher lock = Early withdrawal priority</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span>Builds trust with other members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              <span>Unlocks premium group features</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">How Trust Lock Works:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Lock additional tokens beyond your contribution to demonstrate commitment</li>
                              <li>• Higher lock amounts guarantee early withdrawal rights in emergencies</li>
                              <li>• Locked tokens are returned when you complete the full cycle</li>
                              <li>• All tokens are automatically converted to USDC for consistency</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="private" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Private Group Settings
                </CardTitle>
                <CardDescription>Create an invitation-only group for selected members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="privateGroupName">Group Name</Label>
                    <Input id="privateGroupName" placeholder="e.g., Private Investors Circle" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privateMaxMembers">Maximum Members</Label>
                    <Input
                      id="privateMaxMembers"
                      type="number"
                      placeholder="Enter max members (2-50)"
                      min="2"
                      max="50"
                    />
                    <p className="text-sm text-gray-500">Minimum 2 members, maximum 50 members for private groups</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privateDescription">Description</Label>
                  <Textarea
                    id="privateDescription"
                    placeholder="Describe your private group's purpose..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="privateContribution">Contribution Amount</Label>
                    <div className="flex">
                      <Input id="privateContribution" placeholder="500" className="rounded-r-none" />
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger className="w-32 rounded-l-none border-l-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedTokens.map((token) => (
                            <SelectItem key={token.value} value={token.value}>
                              <div className="flex items-center gap-2">
                                <span>{token.icon}</span>
                                <span>{token.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-gray-500">
                      {selectedToken !== "usdc" && "Will be automatically converted to USDC"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privateFrequency">Payment Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Trust Lock System for Private Groups */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <Label htmlFor="privateLockToggle" className="font-medium">
                          Enable Trust Lock System
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Lock additional tokens to build trust and guarantee early withdrawal rights
                      </p>
                    </div>
                    <Switch id="privateLockToggle" checked={lockEnabled} onCheckedChange={setLockEnabled} />
                  </div>

                  {lockEnabled && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="privateLockAmount">Lock Amount (Optional)</Label>
                          <div className="flex">
                            <Input
                              id="privateLockAmount"
                              placeholder="0"
                              value={lockAmount}
                              onChange={(e) => setLockAmount(e.target.value)}
                              className="rounded-r-none"
                            />
                            <Select value={selectedToken} onValueChange={setSelectedToken}>
                              <SelectTrigger className="w-32 rounded-l-none border-l-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {supportedTokens.map((token) => (
                                  <SelectItem key={token.value} value={token.value}>
                                    <div className="flex items-center gap-2">
                                      <span>{token.icon}</span>
                                      <span>{token.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Trust Benefits</Label>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>Emergency withdrawal priority</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span>Demonstrates commitment</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              <span>Higher group reputation</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Private Group Lock Benefits:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Higher locks provide emergency withdrawal guarantees</li>
                              <li>• Shows serious commitment to invited members</li>
                              <li>• Locked tokens earn reputation bonuses</li>
                              <li>• All conversions handled automatically via DEX integration</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Invite Members Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <Label className="font-medium">Invite Members</Label>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter wallet address or email"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addEmail()}
                    />
                    <Button onClick={addEmail} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {inviteEmails.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Invited Members:</Label>
                      <div className="flex flex-wrap gap-2">
                        {inviteEmails.map((email) => (
                          <Badge key={email} variant="secondary" className="flex items-center gap-1">
                            {email}
                            <button onClick={() => removeEmail(email)} className="ml-1 hover:text-red-600">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Token Conversion Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Coins className="w-5 h-5 text-indigo-600" />
              Multi-Token Support & Automatic Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Supported Tokens</h4>
                <div className="grid grid-cols-2 gap-2">
                  {supportedTokens.map((token) => (
                    <div key={token.value} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-lg">{token.icon}</span>
                      <span className="font-medium">{token.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">How It Works</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Accept contributions in any supported Starknet token</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Automatic conversion to USDC via integrated DEX protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All savings stored in stable USDC for consistency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Real-time conversion rates with minimal slippage</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" asChild>
            <Link href="/groups">Cancel</Link>
          </Button>
          <Button className="px-8">Create Group</Button>
        </div>
      </div>
    </div>
  )
}
