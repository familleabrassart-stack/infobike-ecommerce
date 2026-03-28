# INFOBIKE — Site E-commerce

## Stack technique
- **Next.js 14.2.35** (App Router, TypeScript)
- **Tailwind CSS 3** — configuration dans `tailwind.config.ts`
- **React 18** — context API pour le panier
- **Resend 3.5.0** — emails transactionnels
- Node.js v18.17.1 (requis ≥ 18.18 pour Next.js 15, rester sur 14 pour l'instant)

## Lancer le projet
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Identité visuelle
- **Jaune** : `#F5C518` (couleur du logo CYCLES INFOBIKE)
- **Bleu** : `#2563eb` (couleur principale, navigation, accents)
- **Fond sombre** : `#030712` / `gray-950` (header, hero)
- **Police** : Poppins (Google Fonts, weights 300/400/600/700/900)
- Tailwind : `text-accent` = jaune, `text-primary` = bleu
- Pas de rouge dans ce projet

## Fichiers importants

| Fichier | Rôle |
|---|---|
| `lib/mock-data.ts` | 20 vélos fictifs + types + données magasins |
| `lib/cyclesoftware.ts` | Fonctions mock API CycleSoftware (à brancher sur la vraie API) |
| `lib/email.ts` | Fonctions d'envoi email via Resend |
| `app/api/orders/route.ts` | Route API : createOrder + envoi emails |
| `context/CartContext.tsx` | Panier global — `useCart()` hook |
| `components/Header.tsx` | Navigation avec logo image + panier |
| `components/Footer.tsx` | Adresses des 2 magasins |
| `components/ProductCard.tsx` | Carte produit réutilisable |
| `components/AddToCartButton.tsx` | Bouton ajout panier avec feedback |

## Pages
- `/` — Accueil : hero + catégories + coups de cœur + magasins
- `/catalogue` — Liste avec filtres (catégorie, marque, prix, magasin)
- `/produit/[slug]` — Fiche produit détaillée
- `/panier` — Récapitulatif panier
- `/checkout` — Formulaire commande (livraison ou retrait) → POST `/api/orders`
- `/confirmation` — Page après commande réussie

## Assets publics (`/public`)
- `hero-bg.png` — Photo fond du hero (intérieur magasin/atelier)
- `logo.png` — Logo CYCLES INFOBIKE (jaune, fond transparent)

## Magasins
- **INFOBIKE Dour** — Rue du Centre 15, 7370 Dour — +32 65 65 12 34
- **INFOBIKE Maisières** — Chaussée de Mons 45, 7020 Maisières — +32 65 78 56 78

## Marques distribuées
Thompson, Scott, Orbea, Colnago

## Variables d'environnement (`.env.local`)
```
RESEND_API_KEY=re_...           # resend.com → API Keys
EMAIL_FROM=commandes@infobike.be  # domaine vérifié dans Resend
EMAIL_STORE_DOUR=dour@infobike.be
EMAIL_STORE_MAISIÈRES=maisières@infobike.be
# CycleSoftware (quand accès disponible) :
# CS_API_KEY=
# CS_STORE_ID_DOUR=
# CS_STORE_ID_MAISIÈRES=
```

## Flux commande
```
Client checkout
  → POST /api/orders
      → createOrder() [mock → CycleSoftware plus tard]
      → sendOrderConfirmationToClient()  ← email client
      → sendNewOrderAlertToStore()       ← email Dour + Maisières
  → redirect /confirmation
```

## Emails disponibles (`lib/email.ts`)
- `sendOrderConfirmationToClient()` — déclenché automatiquement au checkout
- `sendNewOrderAlertToStore()` — déclenché automatiquement au checkout
- `sendOrderReadyNotification()` — à appeler manuellement quand le vélo est prêt

## Intégration CycleSoftware (à faire)
Toutes les fonctions dans `lib/cyclesoftware.ts` sont des **mocks** à remplacer :
- `getProducts()` — catalogue avec filtres
- `getProduct(slug)` — fiche produit
- `checkStock(productId)` — stock temps réel par magasin
- `createOrder(params)` — créer une commande dans la caisse

## Déploiement — IMPORTANT
**Next.js n'est pas un site statique.** Ne pas uploader les fichiers via FTP.
Le site nécessite Node.js — utiliser **Vercel** (gratuit) :
1. Pusher le code sur GitHub
2. Connecter le repo sur vercel.com
3. Ajouter les variables d'env dans Vercel → Settings
4. Pointer le domaine (ex: `shop.infobike.org`) dans Vercel → Domains

## Roadmap
- [ ] Déploiement Vercel + domaine
- [ ] Activer Resend (clé API + vérifier domaine infobike.be)
- [ ] Remplacer les 20 vélos fictifs par le vrai catalogue + vraies photos
- [ ] Intégrer paiement **Mollie** (Bancontact, carte — leader Belgique)
- [ ] Brancher CycleSoftware (stock temps réel)
- [ ] Page admin commandes (statuts + email "vélo prêt")
- [ ] SEO (sitemap, métadonnées, Google Search Console)
- [ ] Analytics (Plausible ou GA4)

## Conventions
- Boutons CTA : `bg-accent` (jaune `#F5C518`)
- Accents UI : `text-primary` / `border-primary` (bleu `#2563eb`)
- Commentaires et labels en français
