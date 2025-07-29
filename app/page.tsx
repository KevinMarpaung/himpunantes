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
import { Calendar, Users, Award } from "lucide-react";
import Link from "next/link";

interface Period {
  year: string;
  theme: string;
  description: string;
  totalMembers: number;
  status: string;
}

export default function HomePage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPeriods = localStorage.getItem("organization_periods");
    if (savedPeriods) {
      const periodsData = JSON.parse(savedPeriods);
      const sortedPeriods = periodsData.sort((a: Period, b: Period) => {
        return b.year.localeCompare(a.year);
      });
      setPeriods(sortedPeriods);
    } else {
      const defaultPeriods = [
        {
          year: "2024-2025",
          theme: "Inovasi Digital untuk Masa Depan",
          description:
            "Periode kepengurusan yang fokus pada pengembangan teknologi dan inovasi digital",
          totalMembers: 45,
          status: "Aktif",
        },
      ];
      setPeriods(defaultPeriods);
      localStorage.setItem(
        "organization_periods",
        JSON.stringify(defaultPeriods)
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedPeriods = localStorage.getItem("organization_periods");
      if (savedPeriods) {
        const periodsData = JSON.parse(savedPeriods);
        const sortedPeriods = periodsData.sort((a: Period, b: Period) => {
          return b.year.localeCompare(a.year);
        });
        setPeriods(sortedPeriods);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("periodsUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("periodsUpdated", handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">HI</span>
          </div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">HI</span>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sejarah Kepengurusan
          </h2>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{periods.length} Periode</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {periods.reduce((sum, p) => sum + p.totalMembers, 0)} Total
                Anggota
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          {periods.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
              {periods.map((period) => (
                <Card
                  key={period.year}
                  className="hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-blue-600">
                        {period.year}
                      </CardTitle>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          period.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {period.status}
                      </span>
                    </div>
                    <CardDescription className="text-lg font-medium text-gray-700">
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
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Periode {period.year}</span>
                      </div>
                    </div>

                    <Link href={`/periode/${period.year}`}>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                        <Award className="w-4 h-4 mr-2" />
                        Lihat Struktur Organisasi
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Belum Ada Periode
              </h3>
              <p className="text-gray-600 mb-6">
                Belum ada periode kepengurusan yang tersedia
              </p>
              <Link href="/admin">
                <Button>Kelola Periode</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
