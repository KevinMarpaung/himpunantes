"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    year: string;
  };
}

export default function CreateDivisionPage({ params }: PageProps) {
  const { year } = params;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: {
      name: "",
      nim: "",
      email: "",
    },
    members: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const existingData = JSON.parse(
        localStorage.getItem(`organization_data_${year}`) ||
          '{"theme":"","bph":[],"divisions":[]}'
      );

      const newData = {
        ...existingData,
        divisions: [...existingData.divisions, formData],
      };

      localStorage.setItem(
        `organization_data_${year}`,
        JSON.stringify(newData)
      );
      router.push(`/admin/periode/${year}/manage`);
    } catch (error) {
      console.error("Error creating division:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("head.")) {
      const headField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        head: {
          ...prev.head,
          [headField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/periode/${year}/manage`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tambah Divisi</h1>
              <p className="text-sm text-gray-600">Periode {year}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Divisi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detail Divisi
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Divisi *</Label>
                    <Input
                      id="name"
                      placeholder="Divisi Akademik"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Divisi</Label>
                    <Textarea
                      id="description"
                      placeholder="Mengelola kegiatan akademik dan pengembangan skill mahasiswa"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Kepala Divisi
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="headName">Nama Kepala Divisi *</Label>
                    <Input
                      id="headName"
                      placeholder="gilang"
                      value={formData.head.name}
                      onChange={(e) =>
                        handleInputChange("head.name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headNim">NIM *</Label>
                    <Input
                      id="headNim"
                      placeholder="20210005"
                      value={formData.head.nim}
                      onChange={(e) =>
                        handleInputChange("head.nim", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headEmail">Email *</Label>
                    <Input
                      id="headEmail"
                      type="email"
                      placeholder="akademik@himatif.ac.id"
                      value={formData.head.email}
                      onChange={(e) =>
                        handleInputChange("head.email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link
                    href={`/admin/periode/${year}/manage`}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      Batal
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Menyimpan..." : "Simpan Divisi"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
