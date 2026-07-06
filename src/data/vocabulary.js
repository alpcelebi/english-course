const TARGET_PER_LEVEL = 500

const b2Concepts = [
  ['homelessness', 'evsizlik', 'problem', 'urban life'],
  ['poverty', 'yoksulluk', 'problem', 'social policy'],
  ['inequality', 'eşitsizlik', 'problem', 'education and work'],
  ['unemployment', 'işsizlik', 'problem', 'local communities'],
  ['social isolation', 'sosyal yalnızlık', 'problem', 'mental health'],
  ['sleep deprivation', 'uyku yoksunluğu', 'problem', 'daily performance'],
  ['discrimination', 'ayrımcılık', 'problem', 'public life'],
  ['prejudice', 'önyargı', 'problem', 'relationships'],
  ['alienation', 'yabancılaşma', 'problem', 'modern society'],
  ['humiliation', 'aşağılanma', 'problem', 'personal dignity'],
  ['desperation', 'çaresizlik', 'problem', 'crisis situations'],
  ['food insecurity', 'gıda güvensizliği', 'problem', 'family life'],
  ['housing instability', 'barınma istikrarsızlığı', 'problem', 'urban poverty'],
  ['public pressure', 'toplumsal baskı', 'problem', 'identity'],
  ['misinformation', 'yanlış bilgi', 'problem', 'digital media'],
  ['burnout', 'tükenmişlik', 'problem', 'work and study'],
  ['peer pressure', 'akran baskısı', 'problem', 'teenage life'],
  ['cultural bias', 'kültürel taraflılık', 'problem', 'communication'],
  ['digital addiction', 'dijital bağımlılık', 'problem', 'technology use'],
  ['income gap', 'gelir farkı', 'problem', 'economic fairness'],
  ['urban overcrowding', 'şehirlerde aşırı kalabalıklaşma', 'problem', 'city planning'],
  ['climate anxiety', 'iklim kaygısı', 'problem', 'young people'],
  ['pollution', 'kirlilik', 'problem', 'the environment'],
  ['resource shortage', 'kaynak kıtlığı', 'problem', 'sustainability'],
  ['empathy gap', 'empati boşluğu / empati eksikliği', 'problem', 'social behaviour'],

  ['shelter', 'barınak / sığınak', 'resource', 'homelessness'],
  ['healthcare', 'sağlık hizmeti', 'resource', 'public welfare'],
  ['education', 'eğitim', 'resource', 'social mobility'],
  ['clean water', 'temiz su', 'resource', 'public health'],
  ['public transport', 'toplu taşıma', 'resource', 'city life'],
  ['legal support', 'hukuki destek', 'resource', 'civil rights'],
  ['mental health care', 'ruh sağlığı desteği', 'resource', 'well-being'],
  ['affordable housing', 'uygun fiyatlı konut', 'resource', 'urban policy'],
  ['job training', 'mesleki eğitim', 'resource', 'employment'],
  ['community support', 'toplum desteği', 'resource', 'social recovery'],
  ['emergency aid', 'acil yardım', 'resource', 'crisis response'],
  ['reliable information', 'güvenilir bilgi', 'resource', 'decision making'],
  ['safe environment', 'güvenli ortam', 'resource', 'learning'],
  ['equal opportunity', 'fırsat eşitliği', 'resource', 'education and work'],
  ['social services', 'sosyal hizmetler', 'resource', 'vulnerable groups'],
  ['financial assistance', 'maddi destek', 'resource', 'poverty reduction'],
  ['childcare', 'çocuk bakımı desteği', 'resource', 'working families'],
  ['digital access', 'dijital erişim', 'resource', 'modern education'],
  ['language support', 'dil desteği', 'resource', 'migration'],
  ['public funding', 'kamu finansmanı', 'resource', 'social projects'],
  ['career guidance', 'kariyer rehberliği', 'resource', 'young adults'],
  ['privacy', 'mahremiyet', 'resource', 'online life'],
  ['security', 'güvenlik', 'resource', 'public spaces'],
  ['nutritious food', 'besleyici gıda', 'resource', 'health'],
  ['inclusive policy', 'kapsayıcı politika', 'resource', 'social equality'],

  ['awareness', 'farkındalık', 'quality', 'social issues'],
  ['empathy', 'empati', 'quality', 'relationships'],
  ['resilience', 'dayanıklılık', 'quality', 'difficult situations'],
  ['confidence', 'özgüven', 'quality', 'communication'],
  ['independence', 'bağımsızlık', 'quality', 'personal growth'],
  ['responsibility', 'sorumluluk', 'quality', 'work and society'],
  ['transparency', 'şeffaflık', 'quality', 'institutions'],
  ['accountability', 'hesap verebilirlik', 'quality', 'leadership'],
  ['diversity', 'çeşitlilik', 'quality', 'teams and cultures'],
  ['inclusion', 'kapsayıcılık', 'quality', 'community life'],
  ['creativity', 'yaratıcılık', 'quality', 'innovation'],
  ['originality', 'özgünlük', 'quality', 'ideas'],
  ['flexibility', 'esneklik', 'quality', 'changing plans'],
  ['curiosity', 'merak', 'quality', 'learning'],
  ['patience', 'sabır', 'quality', 'long-term goals'],
  ['tolerance', 'hoşgörü', 'quality', 'different opinions'],
  ['reliability', 'güvenilirlik', 'quality', 'teamwork'],
  ['accuracy', 'doğruluk / isabetlilik', 'quality', 'information'],
  ['efficiency', 'verimlilik', 'quality', 'work processes'],
  ['sustainability', 'sürdürülebilirlik', 'quality', 'environmental planning'],
  ['cooperation', 'iş birliği', 'quality', 'group projects'],
  ['leadership', 'liderlik', 'quality', 'organisations'],
  ['motivation', 'motivasyon', 'quality', 'learning'],
  ['adaptability', 'uyum sağlayabilme', 'quality', 'new conditions'],
  ['fairness', 'adalet / hakkaniyet', 'quality', 'decision making'],

  ['critical thinking', 'eleştirel düşünme', 'skill', 'academic tasks'],
  ['problem solving', 'problem çözme', 'skill', 'daily challenges'],
  ['decision making', 'karar verme', 'skill', 'complex situations'],
  ['negotiation', 'müzakere', 'skill', 'professional life'],
  ['time management', 'zaman yönetimi', 'skill', 'study routines'],
  ['risk assessment', 'risk değerlendirmesi', 'skill', 'planning'],
  ['evidence analysis', 'kanıt analizi', 'skill', 'reading tasks'],
  ['media literacy', 'medya okuryazarlığı', 'skill', 'online information'],
  ['active listening', 'aktif dinleme', 'skill', 'conversation'],
  ['public speaking', 'topluluk önünde konuşma', 'skill', 'presentations'],
  ['academic writing', 'akademik yazma', 'skill', 'essays'],
  ['persuasive language', 'ikna edici dil', 'skill', 'arguments'],
  ['summarising', 'özetleme', 'skill', 'reading'],
  ['paraphrasing', 'başka sözlerle ifade etme', 'skill', 'writing'],
  ['comparing ideas', 'fikirleri karşılaştırma', 'skill', 'discussion'],
  ['drawing conclusions', 'sonuç çıkarma', 'skill', 'reading comprehension'],
  ['making predictions', 'tahminlerde bulunma', 'skill', 'future scenarios'],
  ['supporting an argument', 'bir argümanı destekleme', 'skill', 'speaking and writing'],
  ['evaluating evidence', 'kanıtı değerlendirme', 'skill', 'academic discussion'],
  ['identifying bias', 'taraflılığı belirleme', 'skill', 'media texts'],
  ['interpreting data', 'veri yorumlama', 'skill', 'reports'],
  ['giving feedback', 'geri bildirim verme', 'skill', 'collaboration'],
  ['setting priorities', 'öncelik belirleme', 'skill', 'planning'],
  ['managing conflict', 'çatışma yönetme', 'skill', 'relationships'],
  ['generating ideas', 'fikir üretme', 'skill', 'creative work'],
]

function capitalise(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function makeEntry(level, category, index, term, meaning, example) {
  return {
    id: `${level}-${category}-${index}`,
    level,
    category,
    term,
    meaning,
    example,
  }
}

function problemCards(level, index, term, meaning, context) {
  return [
    makeEntry(level, 'social-issues', index, term, meaning, `The article examines ${term} as a serious issue in ${context}.`),
    makeEntry(level, 'social-issues', index + 1, `address ${term}`, `${meaning} sorununu ele almak`, `Local leaders must address ${term} before it becomes worse.`),
    makeEntry(level, 'social-issues', index + 2, `deal with ${term}`, `${meaning} ile başa çıkmak`, `Families often need support to deal with ${term}.`),
    makeEntry(level, 'social-issues', index + 3, `reduce ${term}`, `${meaning} sorununu azaltmak`, `Long-term planning can reduce ${term} in vulnerable communities.`),
    makeEntry(level, 'social-issues', index + 4, `${term}-related problem`, `${meaning} ile ilgili sorun`, `The report describes a ${term}-related problem that affects young people.`),
  ]
}

function resourceCards(level, index, term, meaning, context) {
  return [
    makeEntry(level, 'resources', index, term, meaning, `Reliable ${term} can improve outcomes in ${context}.`),
    makeEntry(level, 'resources', index + 1, `access to ${term}`, `${meaning} erişimi`, `Everyone should have access to ${term}, especially in difficult times.`),
    makeEntry(level, 'resources', index + 2, `provide ${term}`, `${meaning} sağlamak`, `The organisation works to provide ${term} for people in need.`),
    makeEntry(level, 'resources', index + 3, `lack of ${term}`, `${meaning} eksikliği`, `A lack of ${term} can make the situation more dangerous.`),
    makeEntry(level, 'resources', index + 4, `improve ${term}`, `${meaning} geliştirmek / iyileştirmek`, `The new policy aims to improve ${term} across the city.`),
  ]
}

function qualityCards(level, index, term, meaning, context) {
  return [
    makeEntry(level, 'qualities', index, term, meaning, `${capitalise(term)} is important in ${context}.`),
    makeEntry(level, 'qualities', index + 1, `develop ${term}`, `${meaning} geliştirmek`, `Students can develop ${term} through practice and reflection.`),
    makeEntry(level, 'qualities', index + 2, `show ${term}`, `${meaning} göstermek`, `A good leader should show ${term} under pressure.`),
    makeEntry(level, 'qualities', index + 3, `lack of ${term}`, `${meaning} eksikliği`, `A lack of ${term} can damage trust within a team.`),
    makeEntry(level, 'qualities', index + 4, `promote ${term}`, `${meaning} teşvik etmek`, `Schools can promote ${term} by encouraging open discussion.`),
  ]
}

function skillCards(level, index, term, meaning, context) {
  return [
    makeEntry(level, 'skills', index, term, meaning, `${capitalise(term)} helps learners perform better in ${context}.`),
    makeEntry(level, 'skills', index + 1, `develop ${term}`, `${meaning} becerisini geliştirmek`, `Learners develop ${term} by working with realistic examples.`),
    makeEntry(level, 'skills', index + 2, `apply ${term}`, `${meaning} becerisini uygulamak`, `You need to apply ${term} when the answer is not obvious.`),
    makeEntry(level, 'skills', index + 3, `improve ${term}`, `${meaning} becerisini iyileştirmek`, `Regular practice can improve ${term} over time.`),
    makeEntry(level, 'skills', index + 4, `${term} skill`, `${meaning} becerisi`, `This exercise builds an important ${term} skill.`),
  ]
}

function createB2Vocabulary() {
  return b2Concepts.flatMap(([term, meaning, kind, context], conceptIndex) => {
    const index = conceptIndex * 5 + 1
    if (kind === 'problem') return problemCards('b2', index, term, meaning, context)
    if (kind === 'resource') return resourceCards('b2', index, term, meaning, context)
    if (kind === 'quality') return qualityCards('b2', index, term, meaning, context)
    return skillCards('b2', index, term, meaning, context)
  })
}

const vocabularyByLevel = {
  a1: [],
  a2: [],
  b1: [],
  b2: createB2Vocabulary(),
  c1: [],
  c2: [],
}

export function getVocabularyByLevel(levelId) {
  return vocabularyByLevel[levelId] ?? []
}

export function getVocabularyCount(levelId) {
  return getVocabularyByLevel(levelId).length
}

export function hasVocabulary(levelId) {
  return getVocabularyCount(levelId) > 0
}

export { TARGET_PER_LEVEL }
