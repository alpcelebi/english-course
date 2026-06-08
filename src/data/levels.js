/**
 * CEFR level metadata. `active` marks levels whose curriculum is authored.
 * Inactive levels appear in the UI as "coming soon" so the roadmap is visible.
 */
export const levels = [
  {
    id: 'a1',
    code: 'A1',
    name: 'Başlangıç',
    tag: 'Beginner',
    description: 'İlk adımlar: to be, zamirler, geniş ve şimdiki zamanın temelleri.',
    active: true,
  },
  {
    id: 'a2',
    code: 'A2',
    name: 'Temel',
    tag: 'Elementary',
    description: 'Geçmiş zamanlar, gelecek biçimleri, karşılaştırmalar ve modallar.',
    active: true,
  },
  {
    id: 'b1',
    code: 'B1',
    name: 'Orta Öncesi',
    tag: 'Intermediate',
    description: 'Present perfect, past perfect, koşul cümleleri ve edilgen yapı.',
    active: true,
  },
  {
    id: 'b2',
    code: 'B2',
    name: 'Orta Üstü',
    tag: 'Upper-Intermediate',
    description: 'Anlatı zamanları, üçüncü koşul, gelişmiş edilgen ve dolaylı anlatım.',
    active: true,
  },
  {
    id: 'c1',
    code: 'C1',
    name: 'İleri',
    tag: 'Advanced',
    description: 'Devrik yapılar, vurgu cümleleri, ortaç (participle) ve gelişmiş modallar.',
    active: true,
  },
  {
    id: 'c2',
    code: 'C2',
    name: 'Ustalık',
    tag: 'Proficiency',
    description: 'İnce anlam ayrımları, isimleştirme, eksiltili yapılar ve deyimsel kullanımlar.',
    active: true,
  },
]

export const getLevel = (id) => levels.find((l) => l.id === id)
