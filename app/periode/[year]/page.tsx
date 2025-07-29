"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Users, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"

// Replace the organizationData object with this function
function getOrganizationData(year: string) {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem(`organization_data_${year}`)
    if (savedData) {
      return JSON.parse(savedData)
    }
  }

  // Fallback data if nothing in localStorage
  return {
    theme: "Data tidak tersedia",
    bph: [],
    divisions: [],
  }
}

interface PageProps {
  params: {
    year: string
  }
}

// Update the component to use the function
export default function PeriodePage({ params }: PageProps) {
  const { year } = params
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const orgData = getOrganizationData(year)
    if (orgData.bph.length === 0 && orgData.divisions.length === 0) {
      notFound()
    }
    setData(orgData)
  }, [year])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">HI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Periode {year}</h1>
                <p className="text-gray-600">{data.theme}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* BPH Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Badan Pengurus Harian (BPH)</h2>
            <p className="text-gray-600">Pengurus inti yang memimpin organisasi periode {year}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.bph.map((member: any, index: number) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4">
                    <Image
                      src={member.photo || "/placeholder.svg"}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-blue-600">{member.position}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">NIM: {member.nim}</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs">{member.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Divisions Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Struktur Divisi</h2>
            <p className="text-gray-600">Divisi-divisi yang menjalankan program kerja organisasi</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {data.divisions.map((division: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-xl">{division.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{division.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Division Head */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Kepala Divisi</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{division.head.name}</p>
                        <p className="text-sm text-gray-600">NIM: {division.head.nim}</p>
                      </div>
                      <Badge variant="secondary">Leader</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{division.head.email}</p>
                  </div>

                  {/* Division Members */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Anggota Divisi
                    </h4>
                    <div className="space-y-2">
                      {division.members.map((member: any, memberIndex: number) => (
                        <div key={memberIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">NIM: {member.nim}</p>
                          </div>
                          <Badge variant="outline">{member.position}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 Himpunan Informatika - Periode {year}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
