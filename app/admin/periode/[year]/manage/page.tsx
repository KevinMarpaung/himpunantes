"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users,
  Crown,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BPHMember {
  position: string;
  name: string;
  nim: string;
  email: string;
  phone: string;
  photo: string;
}

interface DivisionMember {
  name: string;
  nim: string;
  position: string;
}

interface Division {
  name: string;
  description: string;
  head: {
    name: string;
    nim: string;
    email: string;
  };
  members: DivisionMember[];
}

interface OrganizationData {
  theme: string;
  bph: BPHMember[];
  divisions: Division[];
}

interface PageProps {
  params: {
    year: string;
  };
}

export default function ManagePeriodPage({ params }: PageProps) {
  const { year } = params;
  const [orgData, setOrgData] = useState<OrganizationData>({
    theme: "",
    bph: [],
    divisions: [],
  });
  const [activeTab, setActiveTab] = useState("bph");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    const savedData = localStorage.getItem(`organization_data_${year}`);
    if (savedData) {
      setOrgData(JSON.parse(savedData));
    }
  }, [year, router]);

  const saveData = (newData: OrganizationData) => {
    setOrgData(newData);
    localStorage.setItem(`organization_data_${year}`, JSON.stringify(newData));

    const periods = JSON.parse(
      localStorage.getItem("organization_periods") || "[]"
    );
    const updatedPeriods = periods.map((p: any) => {
      if (p.year === year) {
        const totalMembers =
          newData.bph.length +
          newData.divisions.reduce(
            (sum, div) => sum + div.members.length + 1,
            0
          );
        return { ...p, totalMembers };
      }
      return p;
    });
    localStorage.setItem(
      "organization_periods",
      JSON.stringify(updatedPeriods)
    );
  };

  const handleDeleteBPH = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota BPH ini?")) {
      const newData = {
        ...orgData,
        bph: orgData.bph.filter((_, i) => i !== index),
      };
      saveData(newData);
    }
  };

  const handleDeleteDivision = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus divisi ini?")) {
      const newData = {
        ...orgData,
        divisions: orgData.divisions.filter((_, i) => i !== index),
      };
      saveData(newData);
    }
  };

  const handleDeleteDivisionMember = (
    divisionIndex: number,
    memberIndex: number
  ) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      const newDivisions = [...orgData.divisions];
      newDivisions[divisionIndex].members = newDivisions[
        divisionIndex
      ].members.filter((_, i) => i !== memberIndex);

      const newData = {
        ...orgData,
        divisions: newDivisions,
      };
      saveData(newData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Kelola Periode {year}
              </h1>
              <p className="text-sm text-gray-600">{orgData.theme}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bph" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              BPH ({orgData.bph.length})
            </TabsTrigger>
            <TabsTrigger value="divisions" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Divisi ({orgData.divisions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bph" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Badan Pengurus Harian (BPH)
              </h2>
              <Link href={`/admin/periode/${year}/bph/create`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Anggota BPH
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orgData.bph.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="font-medium text-blue-600">
                      {member.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">NIM: {member.nim}</p>
                    <p className="text-sm text-gray-600">
                      Email: {member.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {member.phone}
                    </p>

                    <div className="flex gap-2 pt-3">
                      <Link
                        href={`/admin/periode/${year}/bph/${index}/edit`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBPH(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {orgData.bph.length === 0 && (
                <Card className="col-span-full text-center py-12">
                  <CardContent>
                    <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Belum ada anggota BPH
                    </h3>

                    <Link href={`/admin/periode/${year}/bph/create`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Anggota BPH
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="divisions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Divisi Organisasi
              </h2>
              <Link href={`/admin/periode/${year}/division/create`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Divisi
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {orgData.divisions.map((division, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        {division.name}
                      </CardTitle>
                      <Badge variant="outline">
                        {division.members.length + 1} Anggota
                      </Badge>
                    </div>
                    <CardDescription>{division.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Kepala Divisi
                      </h4>
                      <p className="font-medium">{division.head.name}</p>
                      <p className="text-sm text-gray-600">
                        NIM: {division.head.nim}
                      </p>
                      <p className="text-sm text-gray-600">
                        {division.head.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Anggota ({division.members.length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {division.members.map((member, memberIndex) => (
                          <div
                            key={memberIndex}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {member.nim} - {member.position}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteDivisionMember(index, memberIndex)
                              }
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/admin/periode/${year}/division/${index}/edit`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/periode/${year}/division/${index}/members`}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full">
                          <Users className="w-4 h-4 mr-1" />
                          Anggota
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDivision(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {orgData.divisions.length === 0 && (
                <Card className="col-span-full text-center py-12">
                  <CardContent>
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Belum ada divisi
                    </h3>

                    <Link href={`/admin/periode/${year}/division/create`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Divisi
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
