export interface Patient {
  id: string
  nome: string
  cpf: string
  telefone: string
  cidade: string
  estado: string
  ultimoAtendimento?: string
  proximoAtendimento?: string
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  id: string
  nome: string
  crm: string
  especialidade: string
  telefone: string
  cidade: string
  estado: string
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  type: "patient_created" | "patient_updated" | "doctor_created" | "doctor_updated" | "appointment_scheduled"
  description: string
  entityName: string
  timestamp: Date
}

// Simple in-memory storage (in a real app, this would be a database)
const patients: Patient[] = [
  {
    id: "1",
    nome: "Aaron Avalos Perez",
    cpf: "123.456.789-00",
    telefone: "(79) 99943-2499",
    cidade: "Aracaju",
    estado: "Sergipe",
    ultimoAtendimento: "26/08/2025 14:30",
    proximoAtendimento: "19/08/2025 15:00",
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    nome: "ARDENAGO OLIVEIRA DE JESUS",
    cpf: "987.654.321-00",
    telefone: "(79) 99986-0093",
    cidade: "Aracaju",
    estado: "Sergipe",
    ultimoAtendimento: "30/12/2024 08:40",
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "3",
    nome: "ARDIAS DANTAS DOS SANTOS",
    cpf: "456.789.123-00",
    telefone: "(79) 99125-7287",
    cidade: "São Cristóvão",
    estado: "Sergipe",
    ultimoAtendimento: "30/12/2024 08:40",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const doctors: Doctor[] = [
  {
    id: "1",
    nome: "Dr. Carlos Silva",
    crm: "12345-SE",
    especialidade: "Cardiologia",
    telefone: "(79) 99999-1234",
    cidade: "Aracaju",
    estado: "Sergipe",
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "2",
    nome: "Dra. Maria Santos",
    crm: "67890-SE",
    especialidade: "Pediatria",
    telefone: "(79) 99999-5678",
    cidade: "Aracaju",
    estado: "Sergipe",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
]

const activities: Activity[] = [
  {
    id: "1",
    type: "patient_created",
    description: "Novo paciente cadastrado",
    entityName: "Aaron Avalos Perez",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    type: "doctor_updated",
    description: "Médico atualizado",
    entityName: "Dr. Carlos Silva",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "3",
    type: "appointment_scheduled",
    description: "Consulta agendada",
    entityName: "Maria Santos",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
]

export const dataStore = {
  // Patients
  getPatients: () => patients,
  getPatient: (id: string) => patients.find((p) => p.id === id),
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    patients.push(newPatient)

    // Add activity
    activities.unshift({
      id: Date.now().toString(),
      type: "patient_created",
      description: "Novo paciente cadastrado",
      entityName: patient.nome,
      timestamp: new Date(),
    })

    return newPatient
  },
  updatePatient: (id: string, updates: Partial<Patient>) => {
    const index = patients.findIndex((p) => p.id === id)
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates, updatedAt: new Date() }

      // Add activity
      activities.unshift({
        id: Date.now().toString(),
        type: "patient_updated",
        description: "Paciente atualizado",
        entityName: patients[index].nome,
        timestamp: new Date(),
      })

      return patients[index]
    }
    return null
  },
  deletePatient: (id: string) => {
    const index = patients.findIndex((p) => p.id === id)
    if (index !== -1) {
      const deleted = patients.splice(index, 1)[0]
      return deleted
    }
    return null
  },

  // Doctors
  getDoctors: () => doctors,
  getDoctor: (id: string) => doctors.find((d) => d.id === id),
  addDoctor: (doctor: Omit<Doctor, "id" | "createdAt" | "updatedAt">) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    doctors.push(newDoctor)

    // Add activity
    activities.unshift({
      id: Date.now().toString(),
      type: "doctor_created",
      description: "Novo médico cadastrado",
      entityName: doctor.nome,
      timestamp: new Date(),
    })

    return newDoctor
  },
  updateDoctor: (id: string, updates: Partial<Doctor>) => {
    const index = doctors.findIndex((d) => d.id === id)
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...updates, updatedAt: new Date() }

      // Add activity
      activities.unshift({
        id: Date.now().toString(),
        type: "doctor_updated",
        description: "Médico atualizado",
        entityName: doctors[index].nome,
        timestamp: new Date(),
      })

      return doctors[index]
    }
    return null
  },
  deleteDoctor: (id: string) => {
    const index = doctors.findIndex((d) => d.id === id)
    if (index !== -1) {
      const deleted = doctors.splice(index, 1)[0]
      return deleted
    }
    return null
  },

  // Activities
  getRecentActivities: (limit = 10) => {
    return activities.slice(0, limit)
  },

  // Dashboard stats
  getDashboardStats: () => {
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    // Count appointments for today
    const appointmentsToday = patients.filter(
      (p) => p.proximoAtendimento && p.proximoAtendimento.includes(todayStr.split("-").reverse().join("/")),
    ).length

    // Count total appointments this month
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    const appointmentsThisMonth =
      patients.filter((p) => {
        if (!p.ultimoAtendimento && !p.proximoAtendimento) return false
        // Simple approximation for demo
        return true
      }).length * 3 // Approximate multiplier for demo

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      appointmentsToday: Math.max(appointmentsToday, 12), // Minimum for demo
      totalAppointments: Math.max(appointmentsThisMonth, 89),
    }
  },
}
