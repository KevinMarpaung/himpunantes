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
import {
  Calendar,
  Users,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Period {
  year: string;
  theme: string;
  description: string;
  totalMembers: number;
  status: string;
}

export default function AdminDashboard() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      router.push("/admin");
      return;
    }

    const savedPeriods = localStorage.getItem("organization_periods");
    if (savedPeriods) {
      setPeriods(JSON.parse(savedPeriods));
    } else {
      const defaultPeriods = [
        {
          year: "2024-2025",
          theme: "Inovasi Digital untuk Masa Depan",
          description: "Periode kepengurusan yang fokus padasdad",
          totalMembers: 45,
          status: "Aktif",
        },
        {
          year: "2023-2024",
          theme: "Kolaborasi dan Transformasi",
          description: "Periode yang menekankan kebersamaan",
          totalMembers: 42,
          status: "Selesai",
        },
      ];
      setPeriods(defaultPeriods);
      localStorage.setItem(
        "organization_periods",
        JSON.stringify(defaultPeriods)
      );
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin");
  };

  const handleDeletePeriod = (year: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus periode ${year}?`)) {
      const updatedPeriods = periods.filter((p) => p.year !== year);
      setPeriods(updatedPeriods);
      localStorage.setItem(
        "organization_periods",
        JSON.stringify(updatedPeriods)
      );

      localStorage.removeItem(`organization_data_${year}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">HI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin</h1>
                <p className="text-sm text-gray-600">Himatif</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  Lihat Website
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Periode
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{periods.length}</div>
              <p className="text-xs text-muted-foreground">
                Periode kepengurusan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Periode Aktif
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {periods.filter((p) => p.status === "Aktif").length}
              </div>
              <p className="text-xs text-muted-foreground">Sedang berjalan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Anggota
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {periods.reduce((sum, p) => sum + p.totalMembers, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Semua periode</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Kelola Periode Kepengurusan
            </h2>
            <Link href="/admin/periode/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Periode
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {periods.map((period) => (
              <Card
                key={period.year}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-600">
                      {period.year}
                    </CardTitle>
                    <Badge
                      variant={
                        period.status === "Aktif" ? "default" : "secondary"
                      }
                    >
                      {period.status}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium">
                    {period.theme}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{period.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{period.totalMembers} Anggota</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/admin/periode/${period.year}/edit`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/periode/${period.year}/manage`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Kelola
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePeriod(period.year)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {periods.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum ada periode
                </h3>
                <p className="text-gray-600 mb-4">
                  Mulai dengan menambahkan periode kepengurusan pertama
                </p>
                <Link href="/admin/periode/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Periode
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
