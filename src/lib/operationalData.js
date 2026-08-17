// Mock repository. Replace these exports with authenticated API repositories when persistence is available.
export const workflowTemplates = [
  { id: 'WF-ONBOARD', name: 'Penerapan Pelanggan Baru', description: 'Perjalanan penerapan standar dari penggalian kebutuhan sampai siap digunakan.', standardSlaHours: 120, requiredSkills: ['Implementasi', 'Keamanan'], expectedOutputs: ['Ruang kerja aktif', 'Persetujuan pelanggan'], linkedPlaybookIds: ['PB-ONBOARD'], stages: [{ id: 'STG-DISC', name: 'Penggalian kebutuhan', gate: 'Ruang lingkup disetujui', slaHours: 16 }, { id: 'STG-SETUP', name: 'Penyiapan', gate: 'Keamanan disetujui', slaHours: 32 }, { id: 'STG-GO', name: 'Mulai digunakan', gate: 'Pelanggan menerima', slaHours: 72 }] },
  { id: 'WF-INCIDENT', name: 'Penyelesaian Gangguan Kritis', description: 'Tanggapan lintas tim untuk gangguan yang berdampak pada pelanggan.', standardSlaHours: 24, requiredSkills: ['Dukungan', 'Teknik'], expectedOutputs: ['Gangguan terselesaikan', 'Pembaruan pelanggan'], linkedPlaybookIds: ['PB-INCIDENT'], stages: [{ id: 'STG-TRIAGE', name: 'Pemeriksaan awal', gate: 'Tingkat gangguan dipastikan', slaHours: 2 }, { id: 'STG-RCA', name: 'Cari akar masalah', gate: 'Perbaikan disetujui', slaHours: 8 }, { id: 'STG-RESOLVE', name: 'Penyelesaian', gate: 'Pelanggan mengonfirmasi', slaHours: 14 }] },
  { id: 'WF-REPORT', name: 'Pelaporan Operasional', description: 'Penyusunan dan pemeriksaan laporan operasional bulanan.', standardSlaHours: 72, requiredSkills: ['Operasional Data'], expectedOutputs: ['Laporan diperiksa'], linkedPlaybookIds: ['PB-REPORT'], stages: [{ id: 'STG-PREP', name: 'Siapkan laporan', gate: 'Kualitas data diperiksa', slaHours: 40 }, { id: 'STG-REVIEW', name: 'Tinjau laporan', gate: 'Laporan diterbitkan', slaHours: 32 }] }
  ,{ id: 'WF-RENEWAL', name: 'Perpanjangan & Pengembangan Pelanggan', description: 'Serah-terima komersial dan operasional standar untuk perpanjangan layanan.', standardSlaHours: 96, requiredSkills: ['Penjualan', 'Kontrak'], expectedOutputs: ['Keputusan perpanjangan', 'Pesanan ditandatangani'], linkedPlaybookIds: ['PB-RENEWAL'], stages: [{ id: 'STG-HEALTH', name: 'Tinjau kondisi pelanggan', gate: 'Risiko perpanjangan disepakati', slaHours: 24 }, { id: 'STG-OFFER', name: 'Penawaran & negosiasi', gate: 'Persetujuan komersial', slaHours: 40 }, { id: 'STG-CONTRACT', name: 'Serah-terima kontrak', gate: 'Kontrak ditandatangani', slaHours: 32 }] }
  ,{ id: 'WF-CHANGE', name: 'Penyelesaian Permintaan Perubahan', description: 'Permintaan perubahan pelanggan yang dibatasi, disetujui, dan diselesaikan.', standardSlaHours: 80, requiredSkills: ['Implementasi', 'Teknik'], expectedOutputs: ['Perubahan diterima'], linkedPlaybookIds: ['PB-CHANGE'], stages: [{ id: 'STG-SCOPE', name: 'Rumuskan permintaan', gate: 'Ruang lingkup disetujui', slaHours: 16 }, { id: 'STG-BUILD', name: 'Konfigurasi & pengerjaan', gate: 'Kualitas diperiksa', slaHours: 40 }, { id: 'STG-ACCEPT', name: 'Penerimaan pelanggan', gate: 'Perubahan diterima', slaHours: 24 }] }
];

export const servicePackages = [
  { id: 'PKG-ENTERPRISE', name: 'Peluncuran Perusahaan', description: 'Penerapan dan adopsi untuk pelanggan perusahaan.', workflowIds: ['WF-ONBOARD'], slaExpectation: '120 jam hingga siap digunakan dan diterima', targetSector: 'SaaS', active: true },
  { id: 'PKG-CARE', name: 'Dukungan Prioritas', description: 'Tanggapan gangguan prioritas dan komunikasi pelanggan.', workflowIds: ['WF-INCIDENT'], slaExpectation: 'Tanggapan kritis dalam 24 jam', targetSector: 'Teknologi', active: true },
  { id: 'PKG-OPS', name: 'Operasional Terkelola', description: 'Pelaporan dan tinjauan operasional berkala.', workflowIds: ['WF-REPORT'], slaExpectation: 'Siklus pelaporan 72 jam', targetSector: 'Jasa Profesional', active: true }
];

export const sectorBlueprints = [
  { id: 'BP-SAAS', sector: 'SaaS', packageId: 'PKG-ENTERPRISE', workflowIds: ['WF-ONBOARD', 'WF-INCIDENT'], slaDefaults: '120h onboarding / 24h critical incident', gates: ['Security cleared', 'Customer acceptance'], playbookIds: ['PB-ONBOARD', 'PB-INCIDENT'] },
  { id: 'BP-TECH', sector: 'Technology', packageId: 'PKG-CARE', workflowIds: ['WF-INCIDENT'], slaDefaults: '24h critical incident', gates: ['Severity confirmed', 'Customer confirmed'], playbookIds: ['PB-INCIDENT'] },
  { id: 'BP-PRO', sector: 'Professional Services', packageId: 'PKG-OPS', workflowIds: ['WF-REPORT', 'WF-RENEWAL'], slaDefaults: '72h reporting / 96h renewal', gates: ['Data quality checked', 'Commercial approval'], playbookIds: ['PB-REPORT', 'PB-RENEWAL'] }
];

export const customers = [
  { id: 'CUS-ACME', name: 'Acme Corp', sector: 'SaaS', tier: 'Enterprise', contract: 'CTR-ACME-2026', packageId: 'PKG-ENTERPRISE', slaIds: ['CSLA-101'] },
  { id: 'CUS-DELTA', name: 'Delta Co', sector: 'Technology', tier: 'Priority', contract: 'CTR-DELTA-2026', packageId: 'PKG-CARE', slaIds: ['CSLA-102'] },
  { id: 'CUS-OMEGA', name: 'Omega Inc', sector: 'Technology', tier: 'Enterprise', contract: 'CTR-OMEGA-2026', packageId: 'PKG-CARE', slaIds: ['CSLA-103'] }
];

export const projects = [
  { id: 'PRJ-ACME', name: 'Acme CS Module Launch', customerId: 'CUS-ACME', packageId: 'PKG-ENTERPRISE', workflowIds: ['WF-ONBOARD'], taskIds: ['TSK-1042'], scope: 'Implement and deploy CS module.', milestones: [{ name: 'Discovery', status: 'Complete' }, { name: 'Go-live', status: 'In progress' }], slaId: 'CSLA-101', status: 'In progress', outcomeId: null, learningIds: ['KN-001'] },
  { id: 'PRJ-DELTA', name: 'Delta Critical Incident', customerId: 'CUS-DELTA', packageId: 'PKG-CARE', workflowIds: ['WF-INCIDENT'], taskIds: ['TSK-1045'], scope: 'Restore customer confidence after an incident.', milestones: [{ name: 'Triage', status: 'Complete' }, { name: 'Resolution', status: 'At risk' }], slaId: 'CSLA-102', status: 'At risk', outcomeId: null, learningIds: ['KN-002'] },
  { id: 'PRJ-OMEGA', name: 'Omega API Recovery', customerId: 'CUS-OMEGA', packageId: 'PKG-CARE', workflowIds: ['WF-INCIDENT'], taskIds: ['TSK-1050'], scope: 'Recover API performance.', milestones: [{ name: 'Root cause', status: 'Complete' }, { name: 'Resolution', status: 'Overdue' }], slaId: 'CSLA-103', status: 'Overdue', outcomeId: 'OUT-OMEGA', learningIds: ['KN-003'] }
];

export const leadership = [
  { id: 'C-001', name: 'Arif Pratama', title: 'Direktur Utama', level: 'C-Level', department: 'Executive', accountabilities: ['Strategi perusahaan', 'Penjualan besar', 'Negosiasi harga', 'Keputusan produk'] },
  { id: 'C-002', name: 'Nadia Putri', title: 'Direktur Teknologi & Product', level: 'C-Level', department: 'Teknologi', accountabilities: ['Arsitektur sistem', 'Product management', 'Technical review', 'Keamanan'] },
  { id: 'C-003', name: 'Budi Santoso', title: 'Direktur Operasional', level: 'C-Level', department: 'Operasional', accountabilities: ['Implementasi', 'Support', 'Vendor', 'Kontrak'] },
  { id: 'M-001', name: 'Dimas Kurniawan', title: 'Manager Teknologi', level: 'Manager', department: 'Teknologi', accountabilities: ['Delivery engineering', 'Technical backlog'] },
  { id: 'M-002', name: 'Andi Pratama', title: 'Manager Implementasi', level: 'Manager', department: 'Implementasi', accountabilities: ['Project delivery', 'Go-live readiness'] },
  { id: 'M-003', name: 'Maya Lestari', title: 'Manager Support', level: 'Manager', department: 'Support', accountabilities: ['SLA support', 'Incident response'] },
  { id: 'M-004', name: 'Sarah Lee', title: 'Manager Sales', level: 'Manager', department: 'Sales', accountabilities: ['Pipeline', 'Customer expansion'] },
  { id: 'M-005', name: 'Ratna Dewi', title: 'Manager Administrasi', level: 'Manager', department: 'Administrasi', accountabilities: ['Contracts', 'People operations'] }
];

export const employees = [
  { id: 'EMP-TECH-01', name: 'Fajar Ramadhan', initials: 'FT', department: 'Teknologi', skills: ['Engineering', 'Architecture'], experienceYears: 4, availability: 'Available', capacityHours: 40, allocatedHours: 30 },
  { id: 'EMP-TECH-02', name: 'Niko Pratama', initials: 'NP', department: 'Teknologi', skills: ['Engineering', 'Security'], experienceYears: 3, availability: 'Available', capacityHours: 40, allocatedHours: 34 },
  { id: 'EMP-IMPL-01', name: 'Citra Wulandari', initials: 'CW', department: 'Implementasi', skills: ['Implementation', 'Training'], experienceYears: 4, availability: 'Available', capacityHours: 40, allocatedHours: 28 },
  { id: 'EMP-IMPL-02', name: 'Galang Permana', initials: 'GP', department: 'Implementasi', skills: ['Implementation', 'Configuration'], experienceYears: 2, availability: 'Limited', capacityHours: 40, allocatedHours: 36 },
  { id: 'EMP-SUP-01', name: 'Siti Aisyah', initials: 'SA', department: 'Support', skills: ['Support', 'Configuration'], experienceYears: 2, availability: 'Available', capacityHours: 32, allocatedHours: 14 },
  { id: 'EMP-SUP-02', name: 'Joko Saputra', initials: 'JS', department: 'Support', skills: ['Support', 'Incident Management'], experienceYears: 3, availability: 'Available', capacityHours: 40, allocatedHours: 36 },
  { id: 'EMP-SALES-01', name: 'Rian Pratama', initials: 'RP', department: 'Sales', skills: ['Sales', 'Discovery'], experienceYears: 3, availability: 'Available', capacityHours: 40, allocatedHours: 26 },
  { id: 'EMP-SALES-02', name: 'Dewi Anggraini', initials: 'DA', department: 'Sales', skills: ['Sales', 'Account Management'], experienceYears: 4, availability: 'Available', capacityHours: 40, allocatedHours: 32 },
  { id: 'EMP-ADMIN-01', name: 'Lina Kartika', initials: 'LK', department: 'Administrasi', skills: ['Contracts', 'Scheduling'], experienceYears: 3, availability: 'Available', capacityHours: 40, allocatedHours: 24 },
  { id: 'EMP-ADMIN-02', name: 'Rafi Maulana', initials: 'RM', department: 'Administrasi', skills: ['Administration', 'Vendor Management'], experienceYears: 2, availability: 'Available', capacityHours: 40, allocatedHours: 20 }
];

export const knowledgeItems = [
  { id: 'KN-001', title: 'Security review handoff checklist', type: 'Playbook', description: 'Use a named owner and decision deadline before the security gate.', sourceProjectId: 'PRJ-ACME', tags: ['handoff', 'security'], sector: 'SaaS', workflowId: 'WF-ONBOARD', gate: 'Security cleared', playbookId: 'PB-ONBOARD', lesson: 'Explicit owner avoids setup delay.', status: 'Approved' },
  { id: 'KN-002', title: 'Critical incident customer communications', type: 'Playbook', description: 'Send cadence updates during critical incident response.', sourceProjectId: 'PRJ-DELTA', tags: ['incident', 'communication'], sector: 'Technology', workflowId: 'WF-INCIDENT', gate: 'Severity confirmed', playbookId: 'PB-INCIDENT', lesson: 'Customer updates reduce escalation pressure.', status: 'Approved' },
  { id: 'KN-003', title: 'API timeout dependency pattern', type: 'Lesson Learned', description: 'Cloud capacity delays can turn an API incident overdue.', sourceProjectId: 'PRJ-OMEGA', tags: ['dependency', 'capacity'], sector: 'Technology', workflowId: 'WF-INCIDENT', gate: 'Fix approved', playbookId: null, lesson: 'Escalate cloud dependencies at first delayed status.', status: 'Published' }
  ,...Array.from({ length: 17 }, (_, index) => {
    const number = index + 4;
    const workflowId = ['WF-ONBOARD', 'WF-INCIDENT', 'WF-REPORT', 'WF-RENEWAL', 'WF-CHANGE'][index % 5];
    const titles = ['Named gate owner', 'Dependency review cadence', 'Customer update template', 'Capacity handover', 'Acceptance evidence'];
    return { id: `KN-${String(number).padStart(3, '0')}`, title: `${titles[index % 5]} pattern`, type: index % 3 === 0 ? 'Playbook' : 'Lesson Learned', description: 'Pattern extracted from a completed delivery review and approved for reuse at the relevant gate.', sourceProjectId: index % 2 ? 'PRJ-DELTA' : 'PRJ-ACME', tags: ['delivery-review', 'gate'], sector: index % 2 ? 'Technology' : 'SaaS', workflowId, gate: 'Gate review', playbookId: `PB-${workflowId.replace('WF-', '')}`, lesson: 'Use the documented owner, evidence and escalation threshold before moving to the next gate.', status: index % 3 === 0 ? 'Approved' : 'Published' };
  })
];

export const pilots = [{ id: 'PIL-001', customerId: 'CUS-ACME', workflowId: 'WF-ONBOARD', packageId: 'PKG-ENTERPRISE', status: 'Active', implementationProgress: 68, slaResult: 'Tracking', friction: 'Security handoff needs a named approver.', feedback: 'Customer wants a shared go-live checklist.', improvementOpportunity: 'Add security gate owner field.' }];
export const outcomes = [{ id: 'OUT-OMEGA', customerId: 'CUS-OMEGA', projectId: 'PRJ-OMEGA', slaAchieved: false, deliveryCompleted: false, resolutionStatus: 'Resolved after breach', notes: 'API restored; post-incident review scheduled.', completionDate: '2026-08-15' }];
export const decisionMatrixRules = [{ id: 'DM-OVERDUE', when: 'overdue', action: 'Immediate Intervention' }, { id: 'DM-DEP', when: 'high risk + delayed dependency', action: 'Escalate Dependency' }, { id: 'DM-CAP', when: 'high risk + overloaded owner', action: 'Reassign Resource' }, { id: 'DM-MON', when: 'medium risk + capacity', action: 'Monitor' }];

// Mutable mock policy store. It deliberately mirrors the future API contract so these
// controls can drive the operational loop today and be replaced by persistence later.
export const slaRules = [
  { id: 'SLA-1', type: 'Support', priority: 'Critical', defaultSla: 24, threshold: 25 },
  { id: 'SLA-2', type: 'Support', priority: 'High', defaultSla: 48, threshold: 25 },
  { id: 'SLA-3', type: 'Implementation', priority: 'Medium', defaultSla: 120, threshold: 25 },
  { id: 'SLA-4', type: 'Data Ops', priority: 'High', defaultSla: 72, threshold: 25 },
  { id: 'SLA-5', type: 'Configuration', priority: 'Low', defaultSla: 96, threshold: 25 }
];

export const escalationRules = [
  { id: 'ESC-1', condition: 'SLA buffer <= threshold', threshold: '25% remaining', level: 'At Risk Notification', recipient: 'Department Manager', trigger: 'at-risk' },
  { id: 'ESC-2', condition: 'SLA remaining time <= 0', threshold: '0 hours', level: 'Overdue Auto-Escalation', recipient: 'Operations Director', trigger: 'overdue' },
  { id: 'ESC-3', condition: 'Dependency delayed', threshold: 'Any delayed predecessor', level: 'Blocker Alert Escalation', recipient: 'Preceding Owner Manager', trigger: 'dependency' }
];

export const customerFrictions = [
  { id: 'FRIC-201', friction: 'Tim support masih memeriksa sisa SLA secara manual.', feedback: 'Timer SLA perlu terlihat pada setiap tugas.', improvement: 'Countdown SLA ditampilkan di kartu tugas.', status: 'Completed' },
  { id: 'FRIC-202', friction: 'Penyerahan lintas divisi belum selalu memiliki riwayat yang jelas.', feedback: 'Tambahkan lini masa aktivitas pada detail tugas.', improvement: 'Riwayat aktivitas terhubung ke setiap tugas.', status: 'Completed' },
  { id: 'FRIC-203', friction: 'Manajer sulit melihat dependensi yang menghambat SLA pelanggan.', feedback: 'Butuh pelacakan SLA pelanggan.', improvement: 'Konteks SLA dan dependensi tersedia pada detail tugas.', status: 'Product Improvement' },
];
