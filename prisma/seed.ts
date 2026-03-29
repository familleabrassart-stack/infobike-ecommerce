import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed de la base de données INFOBIKE…')

  // Catégories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'vtt' },      update: {}, create: { name: 'VTT',       slug: 'vtt',       label: 'VTT' } }),
    prisma.category.upsert({ where: { slug: 'route' },    update: {}, create: { name: 'Route',     slug: 'route',     label: 'Route' } }),
    prisma.category.upsert({ where: { slug: 'electrique' }, update: {}, create: { name: 'Électrique', slug: 'electrique', label: 'Électrique' } }),
    prisma.category.upsert({ where: { slug: 'urbain' },   update: {}, create: { name: 'Urbain',    slug: 'urbain',    label: 'Urbain' } }),
  ])
  console.log('✅ Catégories créées')

  // Marques
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'thompson' }, update: {}, create: { name: 'Thompson', slug: 'thompson' } }),
    prisma.brand.upsert({ where: { slug: 'scott' },    update: {}, create: { name: 'Scott',    slug: 'scott' } }),
    prisma.brand.upsert({ where: { slug: 'orbea' },    update: {}, create: { name: 'Orbea',    slug: 'orbea' } }),
    prisma.brand.upsert({ where: { slug: 'colnago' },  update: {}, create: { name: 'Colnago', slug: 'colnago' } }),
  ])
  console.log('✅ Marques créées')

  const [catVTT, catRoute, catElec, catUrbain] = categories
  const [brandThompson, brandScott, brandOrbea, brandColnago] = brands

  // Produits d'exemple
  const products = [
    {
      slug: 'thompson-trail-x3',
      name: 'Thompson Trail X3',
      description: 'VTT hardtail polyvalent idéal pour les sentiers. Cadre aluminium léger et composants fiables pour une pratique quotidienne.',
      price: 1299,
      categoryId: catVTT.id,
      brandId: brandThompson.id,
      stockDour: 3,
      stockMaisieres: 2,
      featured: true,
      specs: { cadre: 'Aluminium 6061', fourche: 'SR Suntour XCT 100mm', transmission: 'Shimano Altus 3x8', freins: 'Disque hydraulique', roues: '29"', poids: '13.5 kg' },
    },
    {
      slug: 'scott-aspect-950',
      name: 'Scott Aspect 950',
      description: 'Le Scott Aspect 950 offre une géométrie moderne et des composants haut de gamme pour les riders exigeants.',
      price: 1599,
      categoryId: catVTT.id,
      brandId: brandScott.id,
      stockDour: 2,
      stockMaisieres: 1,
      featured: true,
      specs: { cadre: 'Aluminium 6061', fourche: 'SR Suntour XCR 120mm', transmission: 'Shimano Deore 1x12', freins: 'Shimano MT200 hydraulique', roues: '29"', poids: '12.8 kg' },
    },
    {
      slug: 'orbea-orca-m30',
      name: 'Orbea Orca M30',
      description: 'Vélo de route carbone léger pour les performances sur route. Idéal pour les cyclistes passionnés.',
      price: 2999,
      categoryId: catRoute.id,
      brandId: brandOrbea.id,
      stockDour: 1,
      stockMaisieres: 1,
      featured: true,
      specs: { cadre: 'Carbone OMX', fourche: 'Carbone full', transmission: 'Shimano 105 2x11', freins: 'Disque hydraulique 105', roues: '700c', poids: '7.8 kg' },
    },
    {
      slug: 'colnago-v3rs',
      name: 'Colnago V3Rs',
      description: 'La référence absolue du vélo de route carbone haut de gamme. Utilisé en compétition professionnelle.',
      price: 4999,
      originalPrice: 5499,
      promo: true,
      promoLabel: 'Promo -9%',
      categoryId: catRoute.id,
      brandId: brandColnago.id,
      stockDour: 1,
      stockMaisieres: 0,
      featured: false,
      specs: { cadre: 'Carbone C64', fourche: 'Carbone full intégré', transmission: 'Shimano Dura-Ace Di2 2x12', freins: 'Disque hydraulique Dura-Ace', roues: '700c', poids: '6.9 kg' },
    },
    {
      slug: 'thompson-e-urban-500',
      name: 'Thompson E-Urban 500',
      description: 'Vélo électrique urbain avec assistance jusqu\'à 25 km/h. Parfait pour les déplacements quotidiens.',
      price: 2199,
      categoryId: catElec.id,
      brandId: brandThompson.id,
      stockDour: 4,
      stockMaisieres: 3,
      featured: true,
      specs: { cadre: 'Aluminium', moteur: 'Brose Drive C 250W', batterie: '500 Wh', autonomie: '80-120 km', roues: '28"', poids: '22 kg' },
    },
    {
      slug: 'scott-sub-active-eride',
      name: 'Scott Sub Active eRide',
      description: 'VTT électrique polyvalent avec moteur Bosch Performance CX pour les trails les plus exigeants.',
      price: 3499,
      categoryId: catElec.id,
      brandId: brandScott.id,
      stockDour: 2,
      stockMaisieres: 2,
      featured: false,
      specs: { cadre: 'Aluminium alloy', moteur: 'Bosch Performance CX 85Nm', batterie: '625 Wh', autonomie: '100-150 km', roues: '29"', poids: '25 kg' },
    },
    {
      slug: 'thompson-city-comfort',
      name: 'Thompson City Comfort',
      description: 'Vélo urbain confortable pour les déplacements en ville. Position droite et équipement pratique.',
      price: 899,
      categoryId: catUrbain.id,
      brandId: brandThompson.id,
      stockDour: 5,
      stockMaisieres: 4,
      featured: false,
      specs: { cadre: 'Aluminium step-through', fourche: 'Acier droite', transmission: 'Shimano Nexus 7 vitesses', freins: 'V-brake', roues: '28"', poids: '14 kg' },
    },
    {
      slug: 'orbea-gain-d30',
      name: 'Orbea Gain D30',
      description: 'Vélo de route électrique discret et élégant. La légèreté d\'un vélo classique avec l\'assistance d\'un e-bike.',
      price: 3299,
      categoryId: catElec.id,
      brandId: brandOrbea.id,
      stockDour: 1,
      stockMaisieres: 1,
      featured: true,
      specs: { cadre: 'Carbone OMR', moteur: 'Fazua Ride 60 60Nm', batterie: '430 Wh', autonomie: '100 km', roues: '700c', poids: '11.5 kg' },
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        images: [],
        active: true,
        promo: p.promo ?? false,
        promoLabel: p.promoLabel ?? null,
        originalPrice: p.originalPrice ?? null,
        specs: p.specs,
      },
    })
  }
  console.log(`✅ ${products.length} produits créés`)

  // Premier administrateur
  const adminEmail = 'admin@infobike.be'
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } })

  if (!existing) {
    const hashed = await bcrypt.hash('infobike2027!', 12)
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Admin INFOBIKE',
        password: hashed,
        role: 'superadmin',
      },
    })
    console.log(`✅ Admin créé : ${adminEmail} / infobike2027!`)
    console.log('⚠️  CHANGEZ ce mot de passe après la première connexion !')
  } else {
    console.log('ℹ️  Admin déjà existant, skip')
  }

  console.log('🎉 Seed terminé !')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
