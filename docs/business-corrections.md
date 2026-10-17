# Confirmed CaseUp business corrections

The working tree was preserved throughout the correction pass. No existing
product IDs, standard prices, dimensions or image mappings were changed.

- `data/business.ts` owns the 300.000₫ shipping threshold, price bands, 3-day
  policy title and the 149.000₫ made-to-measure base-price configuration.
- `data/vouchers.ts` defines the returning-customer 5% concept. Its public code
  is unconfirmed, so it is informational and cannot silently discount checkout.
  The retired first-order and VIP codes are rejected. Shipping eligibility is
  derived from the same subtotal and threshold used by the progress display.
- `data/fabric-colors.ts` transcribes all 12 names from the official fabric chart:
  Baby Blue, Tím baby, Đỏ, Hồng phấn, Lá đậm, Green baby, Vàng trứng, Navy, Be kem,
  Hồng sen, Đen, Trắng. All sleeve products and customization flows consume it.
- Missing thickness prevents recommendations in both the size tool and chat.
- `data/product-specs.ts` reads only the selected product. Legacy sleeve material,
  weight and surface claims had no confirmed source, so they were removed rather
  than copied between products. Unconfirmed fields are omitted or clearly marked
  as unavailable. Confirmed standard dimensions are retained.
- Product 18, “Bao laptop may theo kích thước yêu cầu”, has its own
  `/products/18` route and shares `CustomStudio` with `/custom`. Three valid
  measurements are required. Standard products remain standard; existing legacy
  custom cart items migrate to this dedicated product. Fabric, button, embroidery
  text, quantity and dimensions persist; accessories remain separate cart lines.
- `customSizeQuote` always uses the confirmed 149.000₫ base until a surcharge
  formula is confirmed. UI and cart state that additional pricing is pending;
  no guessed surcharge is charged.
- Safe shipping and size banners remain active. Artwork ad1–ad4 contains the
  retired offer and is no longer referenced by active promotions. The original
  supplied files were not edited or deleted.

Intentional search matches: obsolete codes in negative regression tests, the
CSS animation's `10%` keyframe, optional review-comment wording (not thickness),
and this internal audit description. No retired offer is rendered by active UI.

Verification includes `verify-business.cjs`, the catalog/account/order/mockup
scripts, and production HTTP checks. Browser visual checks at 375/768/1024/1440
remain manual because no browser is connected. The public returning code,
surcharge formula and product-specific physical specs await shop confirmation.
