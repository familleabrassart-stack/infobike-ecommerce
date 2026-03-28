import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/lib/cyclesoftware'
import { categories, stores } from '@/lib/mock-data'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const featured = await getFeaturedProducts(6)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

            {/* Colonne texte */}
            <div className="max-w-xl">
              <p className="mb-3 inline-block rounded-full bg-accent/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                Spécialiste vélo depuis 70 ans
              </p>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Pédalez vers
                <br />
                <span className="text-accent">l&apos;aventure</span>
              </h1>
              <p className="mt-5 text-lg font-light text-gray-200">
                Découvrez notre sélection de vélos VTT, route, électriques et urbains.
                Deux magasins à Dour et Maisières pour vous conseiller.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/catalogue"
                  className="rounded-xl bg-accent px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:scale-105 active:scale-100"
                >
                  Voir le catalogue
                </Link>
                <Link
                  href="/catalogue?category=electrique"
                  className="rounded-xl border-2 border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Vélos électriques
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-300">
                {['Livraison en Belgique', 'Retrait en magasin', 'SAV & entretien'].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-10 grid grid-cols-4 gap-3">
                {[
                  { value: '70', label: "ans d'expertise" },
                  { value: '2', label: 'magasins' },
                  { value: '4', label: 'marques' },
                  { value: '20+', label: 'modèles' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/10 px-3 py-3 text-center backdrop-blur-sm"
                  >
                    <div className="text-xl font-black text-accent">{stat.value}</div>
                    <div className="text-xs text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo à droite */}
            <div className="flex shrink-0 items-center justify-center lg:justify-end">
              <Image
                src="/logo.png"
                alt="Cycles INFOBIKE"
                width={420}
                height={280}
                className="w-56 sm:w-72 lg:w-[400px] drop-shadow-2xl"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Nos catégories
            </p>
            <h2 className="text-3xl font-black text-gray-900">Trouvez votre vélo idéal</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue?category=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl border-4 border-transparent bg-gray-50 p-6 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="mb-3 text-4xl">{cat.emoji}</div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary">{cat.label}</h3>
                <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Sélection
              </p>
              <h2 className="text-3xl font-black text-gray-900">Coups de coeur</h2>
            </div>
            <Link
              href="/catalogue"
              className="hidden rounded-xl border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white sm:block"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/catalogue"
              className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white"
            >
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Marques distribuées
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {['Thompson', 'Scott', 'Orbea', 'Colnago'].map((brand) => (
              <Link
                key={brand}
                href={`/catalogue?brand=${brand}`}
                className="text-xl font-black text-gray-300 transition-all hover:text-primary"
              >
                {brand.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stores banner */}
      <section className="bg-primary py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-blue-200">
            Nos magasins
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {stores.map((store) => (
              <div
                key={store.id}
                className="flex items-start gap-4 rounded-2xl bg-white/10 p-6 text-white backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-2xl">
                  📍
                </div>
                <div>
                  <h3 className="text-lg font-bold">{store.name}</h3>
                  <p className="mt-0.5 text-blue-200">
                    {store.address}, {store.city}
                  </p>
                  <p className="text-blue-200">{store.phone}</p>
                  <p className="mt-1 text-sm text-blue-100">{store.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why INFOBIKE */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Nos engagements
            </p>
            <h2 className="text-3xl font-black text-gray-900">Pourquoi choisir INFOBIKE ?</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🏅', title: 'Expertise', desc: 'Plus de 70 ans de passion vélo et de conseils personnalisés.' },
              { icon: '🔧', title: 'SAV & entretien', desc: 'Atelier réparation et entretien dans chacun de nos magasins.' },
              { icon: '🚲', title: 'Large choix', desc: '20+ modèles en stock permanents des meilleures marques.' },
              { icon: '💳', title: 'Paiement flexible', desc: 'Carte, Bancontact ou règlement en magasin, à votre convenance.' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{item.icon}</div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
