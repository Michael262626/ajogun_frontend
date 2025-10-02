"use client"

import { useState } from "react"
import { mockBeneficiaries } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SharedLayout from "@/components/shared-layout"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Mail,
  User
} from "lucide-react"

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState(mockBeneficiaries)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const headerAction = (
    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold px-6 py-2 rounded-xl">
      <Plus className="w-4 h-4 mr-2" />
      Add Beneficiary
    </Button>
  )

  return (
    <SharedLayout
      title="Beneficiaries"
      subtitle="Manage your will beneficiaries and their information"
      headerAction={headerAction}
      toastMessage={toastMessage}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Beneficiaries</p>
                <p className="text-3xl font-bold text-white mt-2">{beneficiaries.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Verified</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {beneficiaries.filter(b => b.status === 'verified').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {beneficiaries.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Beneficiaries List */}
      <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Beneficiary Management</CardTitle>
          <p className="text-blue-300">Manage your will beneficiaries and their contact information</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="bg-gradient-to-r from-black to-blue-950/50 rounded-xl p-6 border border-blue-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{beneficiary.name}</h3>
                    <p className="text-blue-300">{beneficiary.relationship}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300">{beneficiary.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">{beneficiary.percentage}%</div>
                    <div className="text-sm text-blue-300">Allocation</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                      beneficiary.status === 'verified' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {beneficiary.status.charAt(0).toUpperCase() + beneficiary.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-800/30">
                <div className="text-sm">
                  <span className="text-blue-300">Wallet Address: </span>
                  <span className="text-white font-mono">{beneficiary.walletAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </SharedLayout>
  )
}