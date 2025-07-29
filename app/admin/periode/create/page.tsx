"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreatePeriodPage() {
  const [formData, setFormData] = useState({
    year: "",
    theme: "",
    description: "",
    totalMembers: 0,
    status: "Aktif",
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
      const existingPeriods = JSON.parse(
        localStorage.getItem("organization_periods") || "[]"
      );

      if (existingPeriods.some((p: any) => p.year === formData.year)) {
        alert("Periode dengan tahun tersebut sudah ada!");
        setIsLoading(false);
        return;
      }

      const newPeriods = [...existingPeriods, formData];
      localStorage.setItem("organization_periods", JSON.stringify(newPeriods));

      const initialOrgData = {
        theme: formData.theme,
        bph: [],
        divisions: [],
      };
      localStorage.setItem(
        `organization_data_${formData.year}`,
        JSON.stringify(initialOrgData)
      );

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error creating period:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                Tambah Periode Baru
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Periode</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year">Tahun Periode *</Label>
                    <Input
                      id="year"
                      placeholder="2024-2025"
                      value={formData.year}
                      onChange={(e) =>
                        handleInputChange("year", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Selesai">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Tema Periode *</Label>
                  <Input
                    id="theme"
                    placeholder="Inovasi Digital untuk Masa Depan"
                    value={formData.theme}
                    onChange={(e) => handleInputChange("theme", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi singkat tentang periode ini..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalMembers">Estimasi Total Anggota</Label>
                  <Input
                    id="totalMembers"
                    type="number"
                    placeholder="45"
                    value={formData.totalMembers}
                    onChange={(e) =>
                      handleInputChange(
                        "totalMembers",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Link href="/admin/dashboard" className="flex-1">
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
                    {isLoading ? "Menyimpan..." : "Simpan Periode"}
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
