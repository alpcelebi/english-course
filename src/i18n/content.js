const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/
const TR_RESIDUE = /\b(zaman|fiil|isim|soru|cevap|olumsuz|olumlu|konu|ders|kullan|kullanilmaz|kullanılmaz|gerek|zamir|miktar|edat|kosul|koşul|baglac|bağlaç|anlatim|anlatım|yanlis|yanlış|dogru|doğru|ornek|örnek|gelir|gelmez|kurulur|veya|sonra|belirli|soyut|emir|rica)\b/i

const levelEn = {
  a1: {
    name: 'Beginner',
    tag: 'Beginner',
    description:
      'First steps: to be, pronouns, articles, simple present, present continuous, and can.',
  },
  a2: {
    name: 'Elementary',
    tag: 'Elementary',
    description:
      'Past forms, future forms, comparisons, obligation, quantifiers, and everyday grammar.',
  },
  b1: {
    name: 'Lower Intermediate',
    tag: 'Intermediate',
    description:
      'Present perfect, past perfect, conditionals, passive voice, reported speech, and relative clauses.',
  },
  b2: {
    name: 'Upper Intermediate',
    tag: 'Upper-Intermediate',
    description:
      'Narrative tenses, third and mixed conditionals, advanced passive, and richer linking devices.',
  },
  c1: {
    name: 'Advanced',
    tag: 'Advanced',
    description:
      'Inversion, cleft sentences, participle clauses, advanced modals, nuance, and academic control.',
  },
  c2: {
    name: 'Proficiency',
    tag: 'Proficiency',
    description:
      'Fine meaning distinctions, nominalisation, ellipsis, cohesion, register, and complex sentence architecture.',
  },
}

const subtitleEn = {
  'Özne Zamirleri ve İyelik Sıfatları': 'Subject pronouns and possessive adjectives',
  'a / an / the ve Çoğul İsimler': 'a / an / the and plural nouns',
  'Geniş Zaman': 'Simple present',
  'Şimdiki Zaman': 'Present continuous',
  'Yetenek ve İzin': 'Ability and permission',
  'Belirli Geçmiş Zaman': 'Completed past actions',
  'Karşılaştırma ve Üstünlük': 'Comparison and degree',
  'Zorunluluk ve Gereklilikler': 'Obligation and necessity',
  'Gelecek: Plan ve Kesinlik': 'Future plans and certainty',
  'Geniş, Şimdiki ve Present Perfect': 'Present simple, present continuous, and present perfect',
  'When / While Bağlaçları': 'When / while clauses',
  'Yakın Geçmiş / Deneyim': 'Recent past and life experience',
  'Miş’li Geçmişin Öncesi': 'The earlier past',
  'Geçmiş Alışkanlıklar': 'Past habits',
  'Koşul Cümleleri': 'Conditional sentences',
  'Anlatı Zamanları': 'Narrative tense control',
  'Üçüncü ve Karma Koşul': 'Third and mixed conditionals',
  'Gelişmiş Edilgen Yapı': 'Advanced passive structures',
  'Dolaylı Anlatım': 'Indirect speech',
  'İlgi (Sıfat) Cümleleri': 'Relative clauses',
  'Çıkarım Modalları': 'Modals for deduction',
  'İmkânsızlık, Tercih ve Güçlü Tavsiye': 'Impossibility, preference, and strong advice',
  'Toplumsal Sorunlar ve Evsizlik Söz Varlığı': 'Social issues and homelessness vocabulary',
  'Perfect Infinitive ile Modallar': 'Modals with perfect infinitive',
  'Geçmiş Alışkanlıklar ve Tercihler': 'Past habits and preferences',
  'Farklılık, Uyum ve Yaratıcılık Söz Varlığı': 'Individuality, conformity, and creativity vocabulary',
  'Bağlayıcı Fiiller': 'Linking verbs',
  'Devrik Yapılar': 'Inverted structures',
  'Vurgu Cümleleri': 'Emphatic sentence patterns',
  'Ortaç Cümlecikleri': 'Participle clauses',
  'Gelişmiş Modallar': 'Advanced modal verbs',
  'Devrik Koşul ve Wish': 'Inverted conditionals and wish',
  'İsim-fiil ve Mastar': 'Gerunds and infinitives',
  'İsimleştirme': 'Nominalisation',
  'Eksiltili Yapılar ve İkame': 'Ellipsis and substitution',
  'Öne Çıkarma ve Vurgu': 'Fronting and emphasis',
  'Söylem Belirleyicileri': 'Discourse markers',
  'İhtiyatlı Dil ve İnce Anlam': 'Hedging and nuance',
  'Deyimsel Kullanımlar ve Eşdizimlilik': 'Idioms and collocations',
  'Var / Yok cümleleri': 'Existence with there is / there are',
  'Sahip olma': 'Possession',
  'Emir, yönerge ve uyarı': 'Commands, instructions, and warnings',
  'in / on / at ve yer edatları': 'in / on / at and place prepositions',
  'Sayılabilen ve sayılamayan isimler': 'Countable and uncountable nouns',
  'Temel miktar ifadeleri': 'Basic quantity expressions',
  'Özne + fiil + nesne': 'Subject + verb + object',
  'Fazla ve yeterli': 'Too much and sufficient amount',
  'Tavsiye ve öneri': 'Advice and recommendation',
  'Kibar istekler': 'Polite requests',
  'Amaç bildiren to + verb': 'to + verb for purpose',
  '-ing mi, to + verb mü?': '-ing or to + verb?',
  'Genel gerçekler': 'General facts',
  'Kurallar ve doğal sonuçlar': 'Rules and natural results',
  'Koşul bağlaçları': 'Conditional connectors',
  'İstek ve pişmanlık': 'Wishes and regrets',
  'Resmi ve günlük yapı seçimi': 'Formal and everyday grammar choices',
  'Yoğun ve dengeli cümleler': 'Dense and balanced sentences',
}

const headingEn = {
  'Olumlu ve Olumsuz': 'Affirmative and Negative',
  Sorular: 'Questions',
  'Özne Zamirleri': 'Subject Pronouns',
  'İyelik Sıfatları': 'Possessive Adjectives',
  Articles: 'Articles',
  'Çoğul İsimler': 'Plural Nouns',
  'Olumlu Cümleler': 'Affirmative Sentences',
  'Olumsuz ve Soru': 'Negative and Questions',
  'Olumsuz Zarflarla Devrik': 'Inversion with Negative Adverbs',
  Yapı: 'Structure',
  Yetenek: 'Ability',
  'İzin ve Rica': 'Permission and Requests',
  'Düzenli ve Düzensiz Fiiller': 'Regular and Irregular Verbs',
  'Geçmiş Zaman Soruları': 'Past Simple Questions',
  'Temel Yapı': 'Core Structure',
  'Kullanım ve Dikkat': 'Usage and Watch-outs',
}

const textMap = {
  'am / is / are ve değilleme': 'am / is / are and negatives',
  'Belirsiz ve belirli tanımlık': 'Indefinite and definite articles',
  '-s / -es kuralı': 'The -s / -es rule',
  'can / can’t + yalın fiil': 'can / can’t + base verb',
  'V2 biçimi': 'The V2 form',
  'Doğru cümle içinde kullanma': 'Use it in correct sentences',
  'Am/Is/Are with soru kurma': 'Am/Is/Are question formation',
  'Temel miktar ifadeleri': 'Basic quantity expressions',
  'for / since ve belirli zaman': 'for / since and specific time references',
}

const cueMap = {
  benim: 'my',
  senin: 'your',
  bizim: 'our',
  onların: 'their',
  'onun, kadın': 'her',
  'onun, erkek': 'his',
  'o, kadın': 'she',
  'o, erkek': 'he',
  'o, cansız': 'it',
  olumsuz: 'negative',
  yapamayız: 'we cannot',
  yapabilir: 'can',
  anlayamıyorum: 'I cannot understand',
  duyamıyoruz: 'we cannot hear',
  'yapıyor': 'is doing',
  'yapmıyor': 'is not doing',
}

const phraseMap = [
  ['now, at the moment, right now zaman ifadeleriyle gelir.', 'It is used with time expressions such as now, at the moment, and right now.'],
  ['Possessive pronoun’dan sonra isim gelmez.', 'Do not use a noun after a possessive pronoun.'],
  ['Olumlu emir verbin base form haliyle kurulur', 'Affirmative imperatives use the base form of the verb'],
  ['Edatlardan sonra genellikle isim veya object pronoun gelir.', 'After prepositions, use a noun or an object pronoun.'],
  ['Why sorusuna cevap verebilir', 'It can answer a why question'],
  ['Zamir araya girer', 'The pronoun goes in the middle'],
  ['Sebep/zaman vurgusu da olur', 'It can also emphasize reason or time'],
  ['that KULLANILMAZ', 'do not use that'],
  ['Gerek yok', 'No obligation'],
  ['Past Perfect soru', 'Past Perfect question'],
  ['Present Simple olumlu', 'Present Simple affirmative'],
  ['Were olumlu', 'Were affirmative'],
  ['First -> present olumsuz', 'First conditional -> present negative'],
  ['Subjunctive olumsuz', 'Subjunctive negative'],
  ['Genel soyut isim', 'General abstract noun'],
  ['Genel soyut noun', 'General abstract noun'],
  ['one — isim ikamesi', 'one is noun substitution'],
  ['Such + (a) + isim', 'Such + (a) + noun'],
  ['Such + a + isim', 'Such + a + noun'],
  ['Such + isim', 'Such + noun'],
  ['Despite + isim', 'Despite + noun'],
  ['decide -> decision (isim)', 'decide -> decision (noun)'],
  ['rise (isim)', 'rise (noun)'],
  ['Zaman -> that', 'Time focus -> that'],
  ['Tekil isim', 'Singular noun'],
  ['Çoğul isim', 'Plural noun'],
  ['Tekil soru', 'Singular question'],
  ['Çoğul soru', 'Plural question'],
  ['Çoğul kişiler', 'Plural people'],
  ['Çoğul', 'Plural'],
  ['Tekil', 'Singular'],
  ['Düzensiz', 'Irregular form'],
  ['İyelik', 'Possessive form'],
  ['Kadın', 'Female subject'],
  ['Erkek', 'Male subject'],
  ['Cansız', 'Thing / animal'],
  ['Hayvan/cansız', 'Animal / thing'],
  ['Sayılamayan', 'Uncountable noun'],
  ['Genel sayılamayan', 'General uncountable noun'],
  ['Belirli zaman', 'Specific time expression'],
  ['belirli zaman', 'specific time expression'],
  ['Olumlu', 'Affirmative'],
  ['olumlu', 'affirmative'],
  ['Olumsuz', 'Negative form'],
  ['olumsuz', 'negative'],
  ['Kısa cevap', 'Short answer'],
  ['İzin', 'Permission'],
  ['Soru', 'Question'],
  ['soru kurma', 'question formation'],
  ['sorusuna cevap', 'question'],
  ['soru', 'question'],
  ['cevap', 'answer'],
  ['Zamir', 'Pronoun'],
  ['zamir', 'pronoun'],
  ['isim ikamesi', 'noun substitution'],
  ['isim', 'noun'],
  ['Genel', 'General'],
  ['genel', 'general'],
  ['özne', 'subject'],
  ['fiil', 'verb'],
  ['yalın fiil', 'base verb'],
  ['yalın', 'base form'],
  ['değişmez', 'does not change'],
  ['kullanılır', 'is used'],
  ['gerekir', 'is required'],
  ['başa gelir', 'comes first'],
  ['çoğuldur', 'is plural'],
  ['tekildir', 'is singular'],
  ['tanımlık yok', 'no article'],
  ['doğru', 'correct'],
  ['yanlış', 'incorrect'],
  ['ile', 'with'],
]

function hasTurkish(value) {
  return TR_CHARS.test(String(value))
}

function hasTurkishResidue(value) {
  return TR_RESIDUE.test(String(value))
}

function needsEnglishFallback(value) {
  return hasTurkish(value) || hasTurkishResidue(value)
}

function replaceCues(value) {
  return String(value).replace(/\(([^)]*)\)/g, (full, inner) => {
    const key = inner.trim().toLocaleLowerCase('tr-TR')
    return cueMap[key] ? `(${cueMap[key]})` : full
  })
}

function simpleTranslate(value) {
  if (!value) return value
  if (textMap[value]) return textMap[value]

  let output = replaceCues(value)
  for (const [tr, en] of phraseMap) {
    output = output.split(tr).join(en)
  }

  output = output
    .replace(/→/g, '->')
    .replace(/’/g, "'")
    .replace(/“|”/g, '"')
    .replace(/…/g, '...')

  return output
}

function fallbackSummary(topic) {
  const subtitle = localizeSubtitle(topic.subtitle)
  return `Learn how to use ${topic.title} (${subtitle}) with clear rules, natural examples, and quick quiz practice.`
}

function fallbackNote(topic, index) {
  const title = normalizeTitle(topic.title)
  const notes = [
    `Use ${title} to express this grammar meaning accurately in context.`,
    'Pay attention to subject, verb form, word order, and time reference.',
    'In questions and negatives, the auxiliary or marker usually carries the grammar change.',
    'Choose the form that matches the meaning of the sentence, not only the isolated word.',
    'Use the examples to notice how the pattern works in natural English.',
    'When in doubt, check the main clause first and then the supporting clause or phrase.',
  ]
  return notes[index % notes.length]
}

function fallbackExplanation(topic) {
  return `This option matches the rule for ${normalizeTitle(topic.title)}.`
}

function normalizeTitle(value) {
  return simpleTranslate(value)
    .replace(/â€œ|â€/g, '"')
    .replace(/Ä°/g, 'I')
    .replace(/Ä±/g, 'i')
}

function localizeSubtitle(value) {
  return subtitleEn[value] ?? simpleTranslate(value)
}

function localizeNote(note, topic, index) {
  const translated = simpleTranslate(note)
  return needsEnglishFallback(translated) ? fallbackNote(topic, index) : translated
}

function localizeExplanation(explain, topic) {
  const translated = simpleTranslate(explain)
  return needsEnglishFallback(translated) ? fallbackExplanation(topic) : translated
}

function localizePrompt(prompt) {
  const translated = simpleTranslate(prompt)
  if (!needsEnglishFallback(translated)) return translated

  return translated.replace(/\([^)]*[çğıöşüÇĞİÖŞÜ][^)]*\)/g, '(choose the correct meaning)')
}

function localizeSection(section, topic, sectionIndex) {
  return {
    ...section,
    heading: headingEn[section.heading] ?? (needsEnglishFallback(section.heading) ? `Part ${sectionIndex + 1}` : section.heading),
    subheading: needsEnglishFallback(simpleTranslate(section.subheading))
      ? sectionIndex === 0
        ? 'Core form and meaning'
        : 'Usage patterns and common mistakes'
      : simpleTranslate(section.subheading),
    notes: section.notes.map((note, index) => localizeNote(note, topic, index)),
    examples: section.examples.map((example) => ({
      ...example,
      tr: '',
    })),
  }
}

function localizeQuestion(question, topic) {
  return {
    ...question,
    topicTitle: question.topicTitle ? normalizeTitle(question.topicTitle) : question.topicTitle,
    prompt: localizePrompt(question.prompt),
    options: question.options.map((option) => simpleTranslate(option)),
    explain: localizeExplanation(question.explain, topic),
  }
}

export function localizeLevel(level, language) {
  if (!level || language !== 'en') return level
  return {
    ...level,
    ...levelEn[level.id],
  }
}

export function localizeLevels(levels, language) {
  return levels.map((level) => localizeLevel(level, language))
}

export function localizeTopic(topic, language) {
  if (!topic || language !== 'en') return topic

  const localizedTopic = {
    ...topic,
    title: normalizeTitle(topic.title),
    subtitle: localizeSubtitle(topic.subtitle),
    summary: fallbackSummary(topic),
  }

  return {
    ...localizedTopic,
    sections: topic.sections.map((section, index) =>
      localizeSection(section, localizedTopic, index)
    ),
    quiz: topic.quiz?.map((question) => localizeQuestion(question, localizedTopic)) ?? [],
    test: topic.test?.map((question) => localizeQuestion(question, localizedTopic)) ?? topic.test,
  }
}

export function localizeTopics(topics, language) {
  return topics.map((topic) => localizeTopic(topic, language))
}

export function localizeQuestionSet(questions, language) {
  if (language !== 'en') return questions
  return questions.map((question) =>
    localizeQuestion(question, {
      title: question.topicTitle ?? 'this topic',
    })
  )
}

export function toEnglishText(value, fallback = 'Review this item in English mode.') {
  const translated = simpleTranslate(value)
  return needsEnglishFallback(translated) ? fallback : translated
}
