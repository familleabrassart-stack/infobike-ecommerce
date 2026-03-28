export type Brand = 'Thompson' | 'Scott' | 'Orbea' | 'Colnago'
export type Category = 'vtt' | 'route' | 'electrique' | 'urbain'

export interface ProductSpecs {
  cadre?: string
  fourche?: string
  transmission?: string
  freins?: string
  roues?: string
  poids?: string
  moteur?: string
  batterie?: string
  autonomie?: string
  tailles?: string
  vitesses?: string
}

export interface StockByStore {
  dour: number
  maisières: number
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: Brand
  category: Category
  price: number
  originalPrice?: number
  description: string
  longDescription: string
  images: string[]
  specs: ProductSpecs
  stock: StockByStore
  featured: boolean
  tags: string[]
  color?: string
}

export const products: Product[] = [
  // ─── VTT ────────────────────────────────────────────────────────────────────
  {
    id: '1',
    slug: 'scott-aspect-950',
    name: 'Scott Aspect 950',
    brand: 'Scott',
    category: 'vtt',
    price: 899,
    description: 'VTT hardtail polyvalent idéal pour débuter sur les sentiers.',
    longDescription:
      "Le Scott Aspect 950 est le compagnon idéal pour découvrir le VTT en toute confiance. Son cadre en aluminium léger et réactif offre une rigidité parfaite pour les sentiers techniques, tandis que sa fourche suspendue de 100 mm absorbe efficacement les chocs. Équipé d'une transmission Shimano Altus 3×8 et de freins hydrauliques, ce vélo offre un excellent rapport qualité/prix pour les riders débutants à intermédiaires.",
    images: [
      'https://picsum.photos/seed/scott-aspect-950/800/600',
      'https://picsum.photos/seed/scott-aspect-950b/800/600',
    ],
    specs: {
      cadre: 'Aluminium 6061, géométrie Traction',
      fourche: 'SR Suntour XCM 100 mm',
      transmission: 'Shimano Altus 3×8 vitesses',
      freins: 'Hydrauliques Shimano MT200',
      roues: '29 pouces, jantes double paroi',
      poids: '13,8 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 3, maisières: 2 },
    featured: true,
    tags: ['vtt', 'hardtail', 'débutant', '29 pouces'],
    color: 'Noir / Rouge',
  },
  {
    id: '2',
    slug: 'scott-scale-980',
    name: 'Scott Scale 980',
    brand: 'Scott',
    category: 'vtt',
    price: 1299,
    description: 'VTT XC hardtail performant pour les compétiteurs en herbe.',
    longDescription:
      "Le Scott Scale 980 représente le parfait équilibre entre performance et accessibilité. Son cadre HMF en aluminium, hérité des modèles de compétition, assure légèreté et rigidité. Couplé à une fourche RockShox Judy Silver TK de 100 mm, il offre un comportement précis et réactif. La transmission Shimano Deore 1×12 simplifie la gestion des vitesses sur tous les terrains.",
    images: [
      'https://picsum.photos/seed/scott-scale-980/800/600',
      'https://picsum.photos/seed/scott-scale-980b/800/600',
    ],
    specs: {
      cadre: 'Aluminium HMF, Tapered HT, 12×148 mm Boost',
      fourche: 'RockShox Judy Silver TK 100 mm',
      transmission: 'Shimano Deore 1×12 vitesses',
      freins: 'Hydrauliques Shimano MT420',
      roues: '29 pouces, Syncros X-30',
      poids: '11,9 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 2, maisières: 1 },
    featured: false,
    tags: ['vtt', 'xc', 'hardtail', '29 pouces', 'deore'],
    color: 'Bleu / Blanc',
  },
  {
    id: '3',
    slug: 'orbea-mx-50',
    name: 'Orbea MX 50',
    brand: 'Orbea',
    category: 'vtt',
    price: 749,
    originalPrice: 849,
    description: 'VTT hardtail abordable et robuste pour les sorties en forêt.',
    longDescription:
      "L'Orbea MX 50 est un VTT hardtail fiable et polyvalent, parfait pour ceux qui souhaitent s'initier au VTT sans se ruiner. Son cadre aluminium robuste supporte les terrains variés des forêts belges, tandis que sa fourche suspendue de 120 mm absorbe les impacts du sentier. La transmission 3×8 vitesses couvre une large gamme pour s'adapter à toutes les pentes.",
    images: [
      'https://picsum.photos/seed/orbea-mx-50/800/600',
      'https://picsum.photos/seed/orbea-mx-50b/800/600',
    ],
    specs: {
      cadre: 'Orbea Aluminium, Tapered HT',
      fourche: 'SR Suntour XCE 120 mm',
      transmission: 'Shimano Acera 3×8 vitesses',
      freins: 'Mécaniques Tektro M280',
      roues: '27,5 pouces, double paroi',
      poids: '14,5 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 5, maisières: 4 },
    featured: false,
    tags: ['vtt', 'hardtail', 'entrée de gamme', '27.5 pouces'],
    color: 'Vert / Noir',
  },
  {
    id: '4',
    slug: 'orbea-alma-h30',
    name: 'Orbea Alma H30',
    brand: 'Orbea',
    category: 'vtt',
    price: 1599,
    description: 'VTT XC hardtail haut de gamme pour la compétition.',
    longDescription:
      "L'Orbea Alma H30 est un vélo de compétition XC taillé pour la performance. Son cadre aluminium hydroformé Orbea NEAT offre une rigidité exceptionnelle tout en restant relativement léger. Équipé d'une transmission Shimano SLX 1×12 et d'une fourche RockShox Recon 100 mm, il est prêt pour affronter les courses XC les plus exigeantes.",
    images: [
      'https://picsum.photos/seed/orbea-alma-h30/800/600',
      'https://picsum.photos/seed/orbea-alma-h30b/800/600',
    ],
    specs: {
      cadre: 'Orbea Aluminium NEAT, 148 mm Boost',
      fourche: 'RockShox Recon RL 100 mm',
      transmission: 'Shimano SLX 1×12 vitesses',
      freins: 'Hydrauliques Shimano SLX M7100',
      roues: '29 pouces, Syncros Silverton 1.5',
      poids: '11,2 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 1, maisières: 2 },
    featured: true,
    tags: ['vtt', 'xc', 'compétition', 'hardtail', 'slx'],
    color: 'Rouge / Noir',
  },
  {
    id: '5',
    slug: 'scott-spark-rc-comp',
    name: 'Scott Spark RC Comp',
    brand: 'Scott',
    category: 'vtt',
    price: 2899,
    description: 'VTT full-suspension de compétition pour les trails techniques.',
    longDescription:
      "Le Scott Spark RC Comp est le choix des compétiteurs sérieux. Son cadre full-suspension en aluminium avec la technologie TwinLoc de Scott permet de contrôler la suspension depuis le guidon. Équipé de la fourche RockShox SID 100 mm et d'un groupe Shimano XT 1×12, ce vélo offre confort et performance sur les trails les plus exigeants.",
    images: [
      'https://picsum.photos/seed/scott-spark-rc/800/600',
      'https://picsum.photos/seed/scott-spark-rcb/800/600',
    ],
    specs: {
      cadre: 'Aluminium HMF TwinLoc, full-suspension 100 mm',
      fourche: 'RockShox SID RL 100 mm',
      transmission: 'Shimano XT 1×12 vitesses',
      freins: 'Hydrauliques Shimano XT M8100',
      roues: '29 pouces, Syncros Silverton 2.0',
      poids: '10,8 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 1, maisières: 1 },
    featured: true,
    tags: ['vtt', 'full-suspension', 'compétition', 'xc', 'xt'],
    color: 'Noir / Jaune',
  },

  // ─── Route ───────────────────────────────────────────────────────────────────
  {
    id: '6',
    slug: 'colnago-c68',
    name: 'Colnago C68',
    brand: 'Colnago',
    category: 'route',
    price: 4999,
    description: 'Vélo de route ultime en carbone pour les passionnés exigeants.',
    longDescription:
      "Le Colnago C68 représente le summum du vélo de route artisanal. Fabriqué à la main en Italie avec un cadre en carbone haut module T-800, il incarne 70 ans de passion et de savoir-faire Colnago. La géométrie racing pure offre une réactivité exceptionnelle, tandis que la transmission Shimano Ultegra Di2 électronique garantit des changements de vitesse précis dans toutes les conditions.",
    images: [
      'https://picsum.photos/seed/colnago-c68/800/600',
      'https://picsum.photos/seed/colnago-c68b/800/600',
    ],
    specs: {
      cadre: 'Carbone haut module T-800',
      fourche: 'Carbone intégré C68',
      transmission: 'Shimano Ultegra Di2 2×12',
      freins: 'Disques hydrauliques Shimano Ultegra',
      roues: '700c, Zipp 303 S',
      poids: '7,4 kg',
      tailles: '48, 50, 52, 54, 56, 58 cm',
    },
    stock: { dour: 0, maisières: 1 },
    featured: true,
    tags: ['route', 'carbone', 'premium', 'di2', 'italie'],
    color: 'Blanc / Rouge',
  },
  {
    id: '7',
    slug: 'colnago-v3rs',
    name: 'Colnago V3Rs',
    brand: 'Colnago',
    category: 'route',
    price: 3499,
    description: 'Vélo de route carbone aérodynamique pour les compétiteurs.',
    longDescription:
      "Le Colnago V3Rs est l'arme secrète des coureurs professionnels. Son cadre en carbone HM-T1100 offre une combinaison parfaite de rigidité et légèreté. Le profil aérodynamique du cadre et de la fourche réduit la traînée au minimum, vous donnant un avantage décisif dans les sprints et les ascensions. Équipé d'un groupe Shimano 105 R7100 Di2, il allie performance et fiabilité.",
    images: [
      'https://picsum.photos/seed/colnago-v3rs/800/600',
      'https://picsum.photos/seed/colnago-v3rsb/800/600',
    ],
    specs: {
      cadre: 'Carbone HM-T1100, profil aéro',
      fourche: 'Carbone V3Rs intégré',
      transmission: 'Shimano 105 R7100 Di2 2×12',
      freins: 'Disques hydrauliques Shimano 105',
      roues: '700c, Fulcrum Racing 900 DB',
      poids: '7,8 kg',
      tailles: '48, 50, 52, 54, 56, 58 cm',
    },
    stock: { dour: 1, maisières: 1 },
    featured: false,
    tags: ['route', 'carbone', 'aéro', 'di2', 'compétition'],
    color: 'Noir / Or',
  },
  {
    id: '8',
    slug: 'scott-addict-rc-30',
    name: 'Scott Addict RC 30',
    brand: 'Scott',
    category: 'route',
    price: 2299,
    description: 'Vélo de route carbone léger et réactif pour les cyclosportifs.',
    longDescription:
      "Le Scott Addict RC 30 est le vélo de route carbone accessible qui ne sacrifie rien à la performance. Son cadre Addict RC en carbone HMF assure une rigidité exemplaire et un amorti optimal. La géométrie racing confort est parfaite pour les longues sorties comme pour les cyclosportives. Équipé d'un groupe Shimano 105 R7000, il offre précision et fiabilité.",
    images: [
      'https://picsum.photos/seed/scott-addict-rc/800/600',
      'https://picsum.photos/seed/scott-addict-rcb/800/600',
    ],
    specs: {
      cadre: 'Carbone HMF IMP5, BB86',
      fourche: 'Carbone Addict RC',
      transmission: 'Shimano 105 R7000 2×11',
      freins: 'Disques hydrauliques Shimano 105',
      roues: '700c, Syncros Silverton 1.5',
      poids: '8,2 kg',
      tailles: '48, 50, 52, 54, 56, 58, 61 cm',
    },
    stock: { dour: 2, maisières: 1 },
    featured: false,
    tags: ['route', 'carbone', 'cyclosportif', '105'],
    color: 'Rouge / Blanc',
  },
  {
    id: '9',
    slug: 'orbea-orca-m35',
    name: 'Orbea Orca M35',
    brand: 'Orbea',
    category: 'route',
    price: 1899,
    description: 'Vélo de route carbone polyvalent pour tous les cyclistes.',
    longDescription:
      "L'Orbea Orca M35 démocratise le vélo de route en carbone à moins de 2 000 €. Son cadre OMR Carbon offre légèreté et rigidité torsionnelle pour une transmission de puissance optimale. La géométrie équilibrée convient aussi bien aux randonneurs qu'aux compétiteurs du dimanche. La transmission Shimano 105 assure des changements précis et une longue durabilité.",
    images: [
      'https://picsum.photos/seed/orbea-orca-m35/800/600',
      'https://picsum.photos/seed/orbea-orca-m35b/800/600',
    ],
    specs: {
      cadre: 'OMR Carbon, BB386EVO',
      fourche: 'Carbone OMR intégré',
      transmission: 'Shimano 105 R7000 2×11',
      freins: 'Disques hydrauliques Shimano 105',
      roues: '700c, Orbea OC-II',
      poids: '8,6 kg',
      tailles: '47, 49, 51, 53, 55, 57 cm',
    },
    stock: { dour: 2, maisières: 3 },
    featured: true,
    tags: ['route', 'carbone', 'polyvalent', '105'],
    color: 'Bleu / Argent',
  },
  {
    id: '10',
    slug: 'scott-speedster-30',
    name: 'Scott Speedster 30',
    brand: 'Scott',
    category: 'route',
    price: 999,
    originalPrice: 1149,
    description: 'Vélo de route aluminium performant pour débuter en cyclisme.',
    longDescription:
      "Le Scott Speedster 30 est le point d'entrée idéal dans le monde du vélo de route. Son cadre aluminium 6061 T6 offre une construction légère et rigide, tandis que sa fourche carbone absorbe les vibrations de la route. Équipé d'un groupe Shimano Sora 9 vitesses, il couvre largement les besoins des cyclistes débutants à intermédiaires.",
    images: [
      'https://picsum.photos/seed/scott-speedster-30/800/600',
      'https://picsum.photos/seed/scott-speedster-30b/800/600',
    ],
    specs: {
      cadre: 'Aluminium 6061 T6, tubes butés',
      fourche: 'Carbone, roulements intégrés',
      transmission: 'Shimano Sora R3000 2×9',
      freins: 'Patins Shimano Sora',
      roues: '700c, Syncros Silverton 2.0',
      poids: '9,8 kg',
      tailles: '48, 50, 52, 54, 56, 58 cm',
    },
    stock: { dour: 3, maisières: 2 },
    featured: false,
    tags: ['route', 'aluminium', 'entrée de gamme', 'sora'],
    color: 'Blanc / Rouge',
  },

  // ─── Électrique ──────────────────────────────────────────────────────────────
  {
    id: '11',
    slug: 'thompson-e-force',
    name: 'Thompson E-Force',
    brand: 'Thompson',
    category: 'electrique',
    price: 2499,
    description: 'VTT électrique puissant pour conquérir tous les sentiers.',
    longDescription:
      "Le Thompson E-Force est le VTT électrique qui redéfinit l'aventure en forêt. Son moteur Bosch Performance CX de 85 Nm offre une assistance puissante sur tous les terrains, même les montées les plus raides des Ardennes. La batterie intégrée de 500 Wh assure une autonomie confortable pour les longues randonnées. La fourche RockShox Yari 140 mm garantit un contrôle total en descente.",
    images: [
      'https://picsum.photos/seed/thompson-e-force/800/600',
      'https://picsum.photos/seed/thompson-e-forceb/800/600',
    ],
    specs: {
      cadre: 'Aluminium 6061, intégration batterie',
      fourche: 'RockShox Yari RC 140 mm',
      transmission: 'Shimano Deore 1×12',
      freins: 'Hydrauliques Shimano MT420 4 pistons',
      roues: '29 pouces, jantes double paroi',
      moteur: 'Bosch Performance CX 85 Nm',
      batterie: '500 Wh intégrée',
      autonomie: "Jusqu'à 120 km",
      poids: '24,5 kg',
      tailles: 'S, M, L, XL',
    },
    stock: { dour: 2, maisières: 3 },
    featured: true,
    tags: ['électrique', 'vtt', 'bosch', 'tout-terrain'],
    color: 'Noir / Orange',
  },
  {
    id: '12',
    slug: 'thompson-e-urban-pro',
    name: 'Thompson E-Urban Pro',
    brand: 'Thompson',
    category: 'electrique',
    price: 1999,
    description: 'Vélo électrique urbain pour vos déplacements quotidiens.',
    longDescription:
      "Le Thompson E-Urban Pro est le vélo électrique idéal pour se déplacer en ville sans effort. Son moteur Shimano E6100 silencieux et son assistance naturelle rendent chaque trajet agréable. La batterie de 418 Wh intégrée dans le tube diagonal permet jusqu'à 100 km d'autonomie en mode éco. L'équipement complet (garde-boues, porte-bagages, éclairage) en fait un vélo prêt à l'emploi dès la sortie du magasin.",
    images: [
      'https://picsum.photos/seed/thompson-e-urban/800/600',
      'https://picsum.photos/seed/thompson-e-urbanb/800/600',
    ],
    specs: {
      cadre: 'Aluminium step-over, intégration batterie',
      fourche: 'Aluminium rigide avec élastomère',
      transmission: 'Shimano Nexus 8 vitesses (moyeu)',
      freins: 'Hydrauliques Tektro HD-T510',
      roues: '28 pouces, pneus Schwalbe',
      moteur: 'Shimano E6100 60 Nm',
      batterie: '418 Wh',
      autonomie: "Jusqu'à 100 km",
      poids: '23,8 kg',
      tailles: 'S/M, M/L',
    },
    stock: { dour: 4, maisières: 3 },
    featured: false,
    tags: ['électrique', 'urbain', 'shimano', 'commuter'],
    color: 'Gris mat',
  },
  {
    id: '13',
    slug: 'scott-e-sub-cross-10',
    name: 'Scott E-Sub Cross 10',
    brand: 'Scott',
    category: 'electrique',
    price: 2799,
    description: 'Vélo électrique crossover polyvalent pour la ville et les chemins.',
    longDescription:
      "Le Scott E-Sub Cross 10 est le compagnon polyvalent par excellence. Aussi à l'aise sur les pistes cyclables qu'en forêt, il s'adapte à tous les terrains grâce à ses pneus 27,5\" de 2,0 pouces. Le moteur Bosch Performance de 75 Nm et la batterie PowerTube 625 Wh assurent une assistance puissante et une grande autonomie. Le display Kiox facilite la gestion de l'assistance.",
    images: [
      'https://picsum.photos/seed/scott-e-sub-cross/800/600',
      'https://picsum.photos/seed/scott-e-sub-crossb/800/600',
    ],
    specs: {
      cadre: 'Aluminium, géométrie Sub Cross',
      fourche: 'SR Suntour NCX 63 mm',
      transmission: 'Shimano Deore 1×10',
      freins: 'Hydrauliques Shimano MT420',
      roues: "27,5 pouces, pneus all-terrain 2,0\"",
      moteur: 'Bosch Performance 75 Nm',
      batterie: 'PowerTube 625 Wh',
      autonomie: "Jusqu'à 130 km",
      poids: '25,2 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 2, maisières: 1 },
    featured: false,
    tags: ['électrique', 'crossover', 'bosch', 'polyvalent'],
    color: 'Noir / Vert',
  },
  {
    id: '14',
    slug: 'orbea-gain-m30i',
    name: 'Orbea Gain M30i',
    brand: 'Orbea',
    category: 'electrique',
    price: 3299,
    description: 'Vélo de route électrique discret et léger pour les sportifs.',
    longDescription:
      "L'Orbea Gain M30i révolutionne le concept du vélo de route électrique. Son moteur Mahle X35+ ultra-léger (1,9 kg) et sa batterie intégrée dans le tube diagonal lui confèrent l'apparence d'un vélo classique. L'assistance discrète et naturelle préserve le plaisir de pédaler tout en prolongeant vos sorties. Avec 360 Wh de capacité, il offre jusqu'à 150 km d'autonomie en mode éco.",
    images: [
      'https://picsum.photos/seed/orbea-gain-m30i/800/600',
      'https://picsum.photos/seed/orbea-gain-m30ib/800/600',
    ],
    specs: {
      cadre: 'OMR Carbon, intégration batterie',
      fourche: 'Carbone OMR',
      transmission: 'Shimano 105 R7000 2×11',
      freins: 'Disques hydrauliques Shimano 105',
      roues: '700c, Fulcrum Racing e-DB',
      moteur: 'Mahle X35+ 40 Nm',
      batterie: '360 Wh intégrée',
      autonomie: "Jusqu'à 150 km",
      poids: '13,2 kg',
      tailles: '47, 49, 51, 53, 55, 57 cm',
    },
    stock: { dour: 1, maisières: 2 },
    featured: true,
    tags: ['électrique', 'route', 'léger', 'carbone'],
    color: 'Blanc / Bleu',
  },
  {
    id: '15',
    slug: 'thompson-e-mountain-275',
    name: 'Thompson E-Mountain 27.5',
    brand: 'Thompson',
    category: 'electrique',
    price: 3499,
    description: 'VTT électrique full-suspension pour les grands explorateurs.',
    longDescription:
      "Le Thompson E-Mountain 27.5 est le vélo des grands explorateurs. Son cadre full-suspension avec 140 mm de débattement avant et arrière offre un confort exceptionnel sur les terrains accidentés. Le moteur Bosch Performance CX 85 Nm et la batterie 625 Wh permettent d'explorer les plus beaux sentiers des Ardennes belges sans se soucier de l'autonomie.",
    images: [
      'https://picsum.photos/seed/thompson-e-mountain/800/600',
      'https://picsum.photos/seed/thompson-e-mountainb/800/600',
    ],
    specs: {
      cadre: 'Aluminium full-suspension 140 mm',
      fourche: 'RockShox Yari RC 140 mm',
      transmission: 'Shimano SLX 1×12',
      freins: 'Hydrauliques Shimano SLX M7100 4 pistons',
      roues: "27,5+ pouces, pneus 2,8\"",
      moteur: 'Bosch Performance CX 85 Nm',
      batterie: 'PowerTube 625 Wh',
      autonomie: "Jusqu'à 110 km",
      poids: '26,8 kg',
      tailles: 'S, M, L, XL',
    },
    stock: { dour: 1, maisières: 1 },
    featured: false,
    tags: ['électrique', 'vtt', 'full-suspension', 'bosch', 'trail'],
    color: 'Rouge / Noir',
  },

  // ─── Urbain ──────────────────────────────────────────────────────────────────
  {
    id: '16',
    slug: 'thompson-city-comfort',
    name: 'Thompson City Comfort',
    brand: 'Thompson',
    category: 'urbain',
    price: 699,
    description: 'Vélo de ville confortable pour vos déplacements quotidiens.',
    longDescription:
      "Le Thompson City Comfort est le vélo urbain par excellence. Sa position de conduite droite et confortable réduit la fatigue sur les trajets quotidiens. Équipé d'un dérailleur Shimano Nexus 7 vitesses à moyeu, il ne nécessite quasiment aucun entretien. Le garde-boues intégral, le porte-bagages arrière et le dynamomètre sont de série.",
    images: [
      'https://picsum.photos/seed/thompson-city-comfort/800/600',
      'https://picsum.photos/seed/thompson-city-comfortb/800/600',
    ],
    specs: {
      cadre: 'Aluminium step-over, géométrie confort',
      fourche: 'Acier rigide chromé',
      transmission: 'Shimano Nexus 7 vitesses (moyeu)',
      freins: 'Patins V-brake aluminium',
      roues: '28 pouces, pneus Schwalbe Marathon',
      poids: '15,2 kg',
      tailles: 'S (46 cm), M (51 cm), L (56 cm)',
    },
    stock: { dour: 6, maisières: 5 },
    featured: false,
    tags: ['urbain', 'confort', 'nexus', 'quotidien'],
    color: 'Noir brillant',
  },
  {
    id: '17',
    slug: 'thompson-nexus-7',
    name: 'Thompson Nexus 7',
    brand: 'Thompson',
    category: 'urbain',
    price: 849,
    description: 'Vélo de ville premium avec moyeu 7 vitesses et équipement complet.',
    longDescription:
      "Le Thompson Nexus 7 est le vélo de ville premium pensé pour les navetteurs exigeants. Son cadre aluminium léger et sa fourche à suspension légère procurent une conduite confortable même sur les pavés. Le moyeu Shimano Nexus 7 offre un entretien minimal et une grande fiabilité par tous les temps. L'éclairage dynamo intégré et le double antivol en font un vélo vraiment complet.",
    images: [
      'https://picsum.photos/seed/thompson-nexus-7/800/600',
      'https://picsum.photos/seed/thompson-nexus-7b/800/600',
    ],
    specs: {
      cadre: 'Aluminium butted, câbles intégrés',
      fourche: 'Aluminium avec tête élastomère',
      transmission: 'Shimano Nexus 7 vitesses, pignons à rouleaux',
      freins: 'Roller brakes Shimano, insensibles à la pluie',
      roues: '28 pouces, jantes double paroi',
      poids: '14,8 kg',
      tailles: 'S, M, L',
    },
    stock: { dour: 4, maisières: 3 },
    featured: false,
    tags: ['urbain', 'premium', 'nexus', 'commuter'],
    color: 'Gris métal',
  },
  {
    id: '18',
    slug: 'orbea-carpe-30',
    name: 'Orbea Carpe 30',
    brand: 'Orbea',
    category: 'urbain',
    price: 599,
    originalPrice: 699,
    description: 'Vélo de ville léger et agile pour se faufiler dans la circulation.',
    longDescription:
      "L'Orbea Carpe 30 est le vélo urbain sportif qui combine agilité et polyvalence. Ses pneus semi-slick 700×45c roulent vite sur l'asphalte tout en restant confortables sur les chemins. La transmission dérailleur Shimano Claris 8 vitesses est simple et fiable. Léger et maniable, il est idéal pour les cyclistes qui veulent mettre un peu de sport dans leurs déplacements quotidiens.",
    images: [
      'https://picsum.photos/seed/orbea-carpe-30/800/600',
      'https://picsum.photos/seed/orbea-carpe-30b/800/600',
    ],
    specs: {
      cadre: 'Aluminium 6061, géométrie sportive',
      fourche: 'Chromoly rigide',
      transmission: 'Shimano Claris 2×8 vitesses',
      freins: 'Patins V-brake Tektro',
      roues: '700c, pneus 700×45c semi-slick',
      poids: '11,8 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 3, maisières: 4 },
    featured: false,
    tags: ['urbain', 'sportif', 'léger', 'commuter'],
    color: 'Rouge / Blanc',
  },
  {
    id: '19',
    slug: 'scott-sub-cross-30',
    name: 'Scott Sub Cross 30',
    brand: 'Scott',
    category: 'urbain',
    price: 799,
    description: 'Vélo crossover urbain polyvalent pour la ville et les voies vertes.',
    longDescription:
      "Le Scott Sub Cross 30 est le vélo polyvalent par excellence pour les cyclistes urbains aventuriers. Ses pneus 27,5\" de 2,0 pouces roulent sur tous les revêtements avec aisance, du macadam aux pistes cyclables forestières. La fourche à suspension absorbe les irrégularités, et la transmission Shimano Deore 1×10 couvre tous les terrains.",
    images: [
      'https://picsum.photos/seed/scott-sub-cross/800/600',
      'https://picsum.photos/seed/scott-sub-crossb/800/600',
    ],
    specs: {
      cadre: 'Aluminium 6061, géométrie Sub Cross',
      fourche: 'SR Suntour NCX 63 mm',
      transmission: 'Shimano Deore 1×10',
      freins: 'Hydrauliques Shimano MT200',
      roues: "27,5 pouces, pneus 2,0\" all-terrain",
      poids: '13,4 kg',
      tailles: 'XS, S, M, L, XL',
    },
    stock: { dour: 3, maisières: 2 },
    featured: false,
    tags: ['urbain', 'crossover', 'polyvalent', 'tout-terrain'],
    color: 'Vert sauge',
  },
  {
    id: '20',
    slug: 'colnago-lifestyle',
    name: 'Colnago Lifestyle',
    brand: 'Colnago',
    category: 'urbain',
    price: 1299,
    description: 'Vélo urbain haut de gamme alliant style italien et praticité.',
    longDescription:
      "Le Colnago Lifestyle apporte l'élégance du design italien dans le cyclisme urbain quotidien. Son cadre en acier chromoly peint à la main offre une qualité esthétique incomparable et une durabilité exceptionnelle. La position droite et confortable, les pneus larges anti-crevaison et l'équipement complet (garde-boues, porte-bagages, éclairage, courroie Gates) en font un investissement pour la vie.",
    images: [
      'https://picsum.photos/seed/colnago-lifestyle/800/600',
      'https://picsum.photos/seed/colnago-lifestyleb/800/600',
    ],
    specs: {
      cadre: 'Acier chromoly 4130, soudé à la main',
      fourche: 'Acier chromoly, boucles porte-bagages',
      transmission: 'Shimano Nexus 8, courroie Gates Carbon Drive',
      freins: 'Roller brakes Shimano',
      roues: '700c, pneus 700×45c Schwalbe Marathon Plus',
      poids: '16,5 kg',
      tailles: 'S, M, L',
    },
    stock: { dour: 2, maisières: 1 },
    featured: true,
    tags: ['urbain', 'premium', 'acier', 'lifestyle', 'design'],
    color: 'Crème / Cuir',
  },
]

export const categories = [
  {
    id: 'vtt' as Category,
    label: 'VTT',
    description: 'Vélos tout-terrain pour les aventuriers',
    emoji: '⛰️',
  },
  {
    id: 'route' as Category,
    label: 'Route',
    description: 'Vélos de route pour les performeurs',
    emoji: '🏆',
  },
  {
    id: 'electrique' as Category,
    label: 'Électrique',
    description: 'E-bikes pour tous les profils',
    emoji: '⚡',
  },
  {
    id: 'urbain' as Category,
    label: 'Urbain',
    description: 'Vélos de ville pour le quotidien',
    emoji: '🏙️',
  },
]

export const brands: Brand[] = ['Thompson', 'Scott', 'Orbea', 'Colnago']

export const stores = [
  {
    id: 'dour',
    name: 'INFOBIKE Dour',
    address: 'Rue du Centre 15',
    city: '7370 Dour',
    phone: '+32 65 65 12 34',
    email: 'dour@infobike.be',
    hours: 'Lun – Sam : 9h00 – 18h00',
  },
  {
    id: 'maisières',
    name: 'INFOBIKE Maisières',
    address: 'Chaussée de Mons 45',
    city: '7020 Maisières',
    phone: '+32 65 78 56 78',
    email: 'maisières@infobike.be',
    hours: 'Lun – Sam : 9h30 – 18h30',
  },
]
