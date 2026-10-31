# NORD storefront

The App Router application is the next version of the NORD storefront. The original HTML pages remain in the repository during the migration; the Next.js app uses the shared styles and copies of the verified product images under `public/`.

## Local setup

Requirements: Node.js 20.9 or newer and a PostgreSQL database. Supabase PostgreSQL is the intended managed database.

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL`. Keep `.env.local` out of Git.
2. Install packages and create the schema:

   ```powershell
   npm install
   npm run db:migrate
   npm run db:seed
   ```

   The seed imports the existing manufacturer catalog. Imported items are drafts with zero stock and are not offered for sale until the owner confirms prices, availability, rental terms, and publishes them in `/admin`.
3. Create the first admin account without putting its password in the repository:

   ```powershell
   $env:ADMIN_LOGIN = "owner"
   $env:ADMIN_PASSWORD = Read-Host "Admin password"
   npm run admin:create
   Remove-Item Env:ADMIN_PASSWORD
   ```

4. For product photo uploads, create a public Supabase Storage bucket (default name `product-images`) and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as server-only environment variables. Never expose the service-role key to browser code.
5. Start the app with `npm run dev`.

## Payments

Set the test shop's `YOOKASSA_SHOP_ID` and `YOOKASSA_SECRET_KEY` in local/Vercel server environment variables. Set `NEXT_PUBLIC_SITE_URL` and an absolute `PAYMENT_RETURN_URL`. Configure YooKassa notifications for `payment.succeeded` and `payment.canceled` to call:

```text
https://YOUR_DOMAIN/api/payment-webhook
```

The server calculates prices from PostgreSQL, creates an order, creates a YooKassa redirect payment, and verifies each notification by fetching the payment from YooKassa's API before changing order state. Use the provider's test shop first. Real payments remain disabled until the merchant account is approved and production credentials are configured.

Fiscal receipts depend on the merchant's tax regime and cash-register setup. Confirm the required VAT code and taxation-system code with the owner's accountant/provider before enabling `YOOKASSA_RECEIPTS_ENABLED`; configure `YOOKASSA_VAT_CODE` and, if required, `YOOKASSA_TAX_SYSTEM_CODE` only with those confirmed values.

## Deploy

Import the repository into Vercel and set the server environment variables there; do not commit real credentials. Run the database migration and seed against the production database before opening the site. Set the production domain in `NEXT_PUBLIC_SITE_URL` and `PAYMENT_RETURN_URL`, then register the webhook URL in YooKassa.

Before public launch, confirm product data and stock, rental availability and cancellation rules, delivery terms, fiscal receipt settings, legal/privacy pages, and the merchant's supported payment methods. The repository cannot deploy to Vercel or activate live payment without the owner's accounts, approved merchant credentials, and production configuration.
