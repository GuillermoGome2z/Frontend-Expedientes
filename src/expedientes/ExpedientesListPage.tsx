import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Download, Search } from "lucide-react";
import { useAuthStore } from "@/auth/auth.store";
import { expedientesApi } from "./expedientes.api";
import type { ExpedienteFilters } from "./expedientes.types";
import { EstadoBadge } from "./EstadoBadge";
import { Page } from "@/shared/ui/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { useToast } from "@/components/ui/toast";

export function ExpedientesListPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [filters, setFilters] = useState<ExpedienteFilters>({
    pagina: 1,
    pageSize: 10,
    q: "",
    estado: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["expedientes", filters],
    queryFn: () => expedientesApi.list(filters),
  });

  const handleSearch = (q: string) => {
    setFilters((prev) => ({ ...prev, q, pagina: 1 }));
  };

  const handleEstadoFilter = (estado: string) => {
    setFilters((prev) => ({ ...prev, estado, pagina: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pagina: page }));
  };

  const handleExport = async () => {
    try {
      toast({
        title: "📄 Exportando...",
        description: "Generando archivo Excel...",
      });
      await expedientesApi.exportExcel(filters);
      toast({
        title: "✅ Archivo listo",
        description: "El archivo se ha descargado correctamente.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el archivo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleExportSingle = async (expedienteId: number, codigo: string) => {
    try {
      toast({
        title: "📄 Exportando...",
        description: `Generando archivo para ${codigo}...`,
      });
      await expedientesApi.exportSingle(expedienteId);
      toast({
        title: "✅ Archivo listo",
        description: `Expediente ${codigo} descargado correctamente.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el archivo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: "codigo",
      label: "Código",
      render: (exp: any) => (
        <Link
          to={`/expedientes/${exp.id}`}
          className="font-medium text-primary hover:underline"
        >
          {exp.codigo}
        </Link>
      ),
    },
    {
      key: "titulo",
      label: "Título",
    },
    {
      key: "estado",
      label: "Estado",
      render: (exp: any) => <EstadoBadge estado={exp.estado} />,
    },
    {
      key: "tecnico",
      label: "Técnico",
      render: (exp: any) => exp.tecnico?.username || "-",
    },
    {
      key: "createdAt",
      label: "Fecha de Creación",
      render: (exp: any) => new Date(exp.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (exp: any) => {
        const canEdit = user?.rol === "tecnico" && exp.tecnicoId === user.id;
        return (
          <div className="flex gap-2">
            <Link to={`/expedientes/${exp.id}`}>
              <Button variant="outline" size="sm">
                Ver
              </Button>
            </Link>
            {canEdit && (
              <Link to={`/expedientes/${exp.id}/editar`}>
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleExportSingle(exp.id, exp.codigo)}
              title="Exportar este expediente"
            >
              <Download size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <Page title="Expedientes">
        <ErrorState onRetry={() => refetch()} />
      </Page>
    );
  }

  return (
    <Page
      title="Expedientes"
      description="Gestiona todos los expedientes del sistema"
      toolbar={
        <>
          <Button onClick={handleExport} variant="outline">
            <Download size={16} />
            Exportar Excel
          </Button>
          <Link to="/expedientes/nuevo">
            <Button>
              <Plus size={16} />
              Nuevo Expediente
            </Button>
          </Link>
        </>
      }
    >
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por código o título..."
            value={filters.q}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filters.estado === "" ? "default" : "outline"}
            onClick={() => handleEstadoFilter("")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filters.estado === "Abierto" ? "default" : "outline"}
            onClick={() => handleEstadoFilter("Abierto")}
            size="sm"
          >
            Abiertos
          </Button>
          <Button
            variant={filters.estado === "Aprobado" ? "default" : "outline"}
            onClick={() => handleEstadoFilter("Aprobado")}
            size="sm"
          >
            Aprobados
          </Button>
          <Button
            variant={filters.estado === "Rechazado" ? "default" : "outline"}
            onClick={() => handleEstadoFilter("Rechazado")}
            size="sm"
          >
            Rechazados
          </Button>
        </div>
      </div>

      {/* Tabla */}
      {data && data.data.length === 0 && !isLoading ? (
        <EmptyState
          icon="📭"
          title="No encontramos expedientes con esos filtros"
          description="Ajusta tu búsqueda o crea uno nuevo."
          action={
            <Link to="/expedientes/nuevo">
              <Button>
                <Plus size={16} />
                Crear Expediente
              </Button>
            </Link>
          }
        />
      ) : (
        <DataTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          pagination={
            data
              ? {
                  currentPage: data.pagina,
                  pageSize: data.pageSize,
                  total: data.total,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
        />
      )}
    </Page>
  );
}
