import { Resend } from 'resend'
import type { CycleSoftwareOrder } from './cyclesoftware'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'
const STORE_EMAILS = [
  process.env.EMAIL_STORE_DOUR ?? 'dour@infobike.be',
  process.env['EMAIL_STORE_MAISIÈRES'] ?? 'maisières@infobike.be',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEur(amount: number) {
  return amount.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })
}

function itemsTable(items: CycleSoftwareOrder['items']) {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          Produit #${i.productId}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
          ${i.quantity}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">
          ${formatEur(i.unitPrice * i.quantity)}
        </td>
      </tr>`,
    )
    .join('')
}

// ─── Template base ────────────────────────────────────────────────────────────

function baseTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#030712;padding:24px 32px;text-align:center;">
            <span style="font-size:26px;font-weight:900;letter-spacing:-0.5px;">
              <span style="color:#2563eb;">INFO</span><span style="color:#F5C518;">BIKE</span>
            </span>
            <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">Cycles INFOBIKE — Vente et réparation</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h1 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;">${title}</h1>
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
            <p style="font-size:12px;color:#6b7280;margin:0;line-height:1.6;">
              <strong>INFOBIKE Dour</strong> — Rue du Centre 15, 7370 Dour — +32 65 65 12 34<br>
              <strong>INFOBIKE Maisières</strong> — Chaussée de Mons 45, 7020 Maisières — +32 65 78 56 78<br>
              <a href="mailto:info@infobike.be" style="color:#2563eb;">info@infobike.be</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Email 1 : Confirmation client ───────────────────────────────────────────

export async function sendOrderConfirmationToClient(
  order: CycleSoftwareOrder,
  customerEmail: string,
  customerFirstName: string,
) {
  const deliveryInfo =
    order.preferredStore
      ? `<p style="background:#eff6ff;border-left:4px solid #2563eb;padding:12px 16px;border-radius:4px;margin:16px 0;font-size:14px;">
           📍 <strong>Retrait en magasin</strong> : ${order.preferredStore}<br>
           Vous serez contacté sous 48h pour convenir du rendez-vous.
         </p>`
      : `<p style="background:#eff6ff;border-left:4px solid #2563eb;padding:12px 16px;border-radius:4px;margin:16px 0;font-size:14px;">
           📦 <strong>Livraison à domicile</strong> en Belgique<br>
           ${order.shippingAddress.address}, ${order.shippingAddress.postalCode} ${order.shippingAddress.city}
         </p>`

  const body = `
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Bonjour <strong>${customerFirstName}</strong>,<br><br>
      Merci pour votre commande ! Nous avons bien reçu votre achat et nos équipes
      le préparent dès maintenant.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:14px;">
      <tr style="background:#f9fafb;">
        <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:600;">Article</th>
        <th style="padding:10px 12px;text-align:center;color:#6b7280;font-weight:600;">Qté</th>
        <th style="padding:10px 12px;text-align:right;color:#6b7280;font-weight:600;">Prix</th>
      </tr>
      ${itemsTable(order.items)}
      <tr style="background:#f9fafb;">
        <td colspan="2" style="padding:10px 12px;font-weight:700;font-size:15px;">Total TTC</td>
        <td style="padding:10px 12px;text-align:right;font-weight:800;font-size:16px;color:#2563eb;">
          ${formatEur(order.total)}
        </td>
      </tr>
    </table>

    ${deliveryInfo}

    <p style="color:#374151;font-size:14px;line-height:1.6;">
      Votre numéro de commande : <strong style="color:#111827;">${order.orderId}</strong><br>
      Mode de paiement : <strong>${order.paymentMethod}</strong>
    </p>

    <p style="color:#6b7280;font-size:13px;margin-top:24px;">
      Une question ? Appelez-nous au <strong>+32 65 65 12 34</strong> (Dour)
      ou <strong>+32 65 78 56 78</strong> (Maisières), du lundi au samedi.
    </p>`

  const { error } = await resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `✅ Commande ${order.orderId} confirmée — INFOBIKE`,
    html: baseTemplate('Votre commande est confirmée !', body),
  })

  if (error) console.error('[Resend] sendOrderConfirmationToClient:', error)
}

// ─── Email 2 : Alerte magasin ─────────────────────────────────────────────────

export async function sendNewOrderAlertToStore(
  order: CycleSoftwareOrder,
  customerEmail: string,
) {
  const body = `
    <div style="background:#fef9c3;border:2px solid #F5C518;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0;font-size:16px;font-weight:700;color:#111827;">
        🛒 Nouvelle commande — ${formatEur(order.total)}
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#374151;">
        Reçue le ${new Date(order.createdAt).toLocaleString('fr-BE')}
      </p>
    </div>

    <h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 8px;">Articles commandés</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:14px;margin-bottom:20px;">
      <tr style="background:#f9fafb;">
        <th style="padding:10px 12px;text-align:left;color:#6b7280;">Article</th>
        <th style="padding:10px 12px;text-align:center;color:#6b7280;">Qté</th>
        <th style="padding:10px 12px;text-align:right;color:#6b7280;">Prix</th>
      </tr>
      ${itemsTable(order.items)}
    </table>

    <h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 8px;">Client</h2>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px;">
      <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br>
      📧 <a href="mailto:${customerEmail}" style="color:#2563eb;">${customerEmail}</a><br>
      📦 ${order.shippingAddress.address}, ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br>
      💳 Paiement : ${order.paymentMethod}
      ${order.preferredStore ? `<br>🏪 Retrait : ${order.preferredStore}` : ''}
    </p>

    <p style="font-size:13px;color:#6b7280;">
      Référence commande : <strong>${order.orderId}</strong>
    </p>`

  const { error } = await resend.emails.send({
    from: FROM,
    to: STORE_EMAILS,
    subject: `🛒 Nouvelle commande ${order.orderId} — ${formatEur(order.total)}`,
    html: baseTemplate(`Nouvelle commande reçue`, body),
  })

  if (error) console.error('[Resend] sendNewOrderAlertToStore:', error)
}

// ─── Email 3 : Commande prête (à appeler manuellement ou via webhook) ─────────

export async function sendOrderReadyNotification(
  orderId: string,
  customerEmail: string,
  customerFirstName: string,
  storeName: string,
) {
  const body = `
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Bonjour <strong>${customerFirstName}</strong>,<br><br>
      Bonne nouvelle ! Votre vélo est <strong>prêt à être retiré</strong> au magasin.
    </p>

    <div style="background:#dcfce7;border-left:4px solid #16a34a;padding:16px;border-radius:4px;margin:20px 0;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#15803d;">✅ Votre commande est prête</p>
      <p style="margin:6px 0 0;font-size:14px;color:#166534;">
        Référence : <strong>${orderId}</strong><br>
        Magasin : <strong>${storeName}</strong>
      </p>
    </div>

    <p style="color:#374151;font-size:14px;line-height:1.6;">
      Présentez-vous avec votre numéro de commande pendant nos heures d'ouverture :<br>
      <strong>Lundi – Samedi, 9h00 – 18h30</strong>
    </p>

    <p style="color:#6b7280;font-size:13px;">
      Des questions ? Contactez-nous au <strong>+32 65 65 12 34</strong>.
    </p>`

  const { error } = await resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `🚲 Votre vélo est prêt ! — Commande ${orderId}`,
    html: baseTemplate('Votre vélo est prêt !', body),
  })

  if (error) console.error('[Resend] sendOrderReadyNotification:', error)
}
