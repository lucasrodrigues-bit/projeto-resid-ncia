import Link from "next/link"
import { Users, UserCheck, Calendar, FileText, BarChart3, Settings } from "lucide-react"

function toDate(d: string | Date | undefined | null): Date | null {
  if (!d) return null
  try {
    if (d instanceof Date) return d
    const parsed = new Date(d)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  } catch {
    return null
  }
}

function formatTimeAgo(date: Date | string): string {
  const parsed = toDate(date)
  if (!parsed) return "há pouco"
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - parsed.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "agora mesmo"
  if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

  const diffInDays = Math.floor(diffInHours / 24)
  return `há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`
}

function getActivityIcon(type: string) {
  switch (type) {
    case "patient_created":
    case "patient_updated":
      return <Users className="w-4 h-4 text-blue-600" />
    case "doctor_created":
    case "doctor_updated":
      return <UserCheck className="w-4 h-4 text-green-600" />
    case "appointment_scheduled":
      return <Calendar className="w-4 h-4 text-purple-600" />
    default:
      return <FileText className="w-4 h-4 text-gray-600" />
  }
}

function getActivityBgColor(type: string) {
  switch (type) {
    case "patient_created":
    case "patient_updated":
      return "bg-blue-100"
    case "doctor_created":
    case "doctor_updated":
      return "bg-green-100"
    case "appointment_scheduled":
      return "bg-purple-100"
    default:
      return "bg-gray-100"
  }
}

export default async function HomePage() {
  let items: any[] = []
  try {
    const res = await fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes", {
      cache: "no-store",
    })
    if (res.ok) {
      const json = await res.json()
      items = Array.isArray(json?.data) ? json.data : []
    }
  } catch {}

  const todayStr = new Date().toISOString().split("T")[0]
  const stats = {
    totalPatients: items.length,
    totalDoctors: items.length,
    appointmentsToday: items.filter((p) => {
      const next = p?.proximo_atendimento || p?.proximoAtendimento
      if (!next) return false
      return String(next).includes(todayStr)
    }).length,
    totalAppointments: items.filter((p) => p?.ultimo_atendimento || p?.proximo_atendimento || p?.ultimoAtendimento || p?.proximoAtendimento).length,
  }

  type Activity = { id: string; type: string; description: string; entityName: string; timestamp: string | Date }
  const recentActivities: Activity[] = items
    .map((p) => ({
      id: String(p.id ?? Math.random()),
      type: "patient_created",
      description: "Novo paciente cadastrado",
      entityName: p.nome ?? "Paciente",
      timestamp: p.created_at || p.createdAt || new Date().toISOString(),
    }))
    .sort((a, b) => {
      const da = toDate(a.timestamp)?.getTime() ?? 0
      const db = toDate(b.timestamp)?.getTime() ?? 0
      return db - da
    })
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao Sistema de Gestão Hospitalar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Médicos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Atendimentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/pacientes" className="group">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Pacientes</h3>
                <p className="text-gray-600">Gerenciar cadastro e informações dos pacientes</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Agendamentos</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Histórico médico</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Cadastro completo</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Relatórios</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/medicos" className="group">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Médicos</h3>
                <p className="text-gray-600">Gerenciar cadastro e informações dos médicos</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>CRM e especialidades</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Agenda médica</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Documentos</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className={`w-8 h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.entityName} - {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {recentActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
