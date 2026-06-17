"""
Usage:
  python scripts/update-opening-sale-prices.py <your-shopify-export.csv>

Reads the full Shopify products CSV, finds all Opening Sale products,
sets Variant Price = 219 and Variant Compare At Price = original price,
and writes an import-ready CSV to scripts/opening-sale-import.csv.

Only rows for Opening Sale products are included in the output — safe to
import without touching anything else in your store.
"""

import csv
import sys
import os

OPENING_SALE_HANDLES = {
    "ardeen-shoe-rack", "darneil-storage-cabinets", "mateo-storage-cabinet",
    "darold-walnut-open-bookshelf", "dariel-storage-cabinet", "koen-storage-cabinet-4-tier",
    "nickel-bed-side-table", "jaryll-bed-side-table", "nick-bed-side-table",
    "darrell-bed-side-table", "dalbert-bed-side-table", "braventa-bedside-table",
    "halviero-bedside-table", "varnel-bedside-table", "brenna-divan-bed-frame-water-repellent",
    "ardella-office-chair", "charlotte-office-chair", "verna-office-chair",
    "kelene-ii-mesh-office-chair", "ned-office-chair", "harvey-office-chair",
    "balaks-table-castors-wheels", "balaks-warar-less-cable-management", "billy-office-chair",
    "balaks-entray", "balaks-meja-mini-desk-shelf", "celeste-black-mesh-office-chair",
    "cian-office-chair", "pico-coffee-table", "tillian-coffee-table",
    "nobles-wooden-coffee-table", "delora-wooden-side-table", "indio-metal-bench-120cm",
    "warrick-junior-shoe-cabinet", "waylon-white-corner-shelf", "derek-oak-storage-cabinets",
    "arnatte-bookshelf", "derek-storage-cabinets", "trystan-wooden-bedside-table",
    "remington-side-table", "brasken-bedside-table", "lorizzo-bedside-table",
    "skarlen-bedside-table", "torvik-bedside-table", "ashleah-fabric-bed-frame",
    "cole-wooden-bed", "ellie-fabric-bed-frame", "ellie-faux-leather-bed-frame",
    "ashleah-faux-leather-bed-frame", "bancroft-mesh-office-chair", "kelene-office-chair",
    "andrei-wooden-ottoman", "nivian-side-table", "riven-ottoman", "riven-ottoman-1",
    "xavian-ottoman", "xavian-side-table", "vailor-side-table", "thalion-side-table",
    "ragnar-side-table", "quinlan-side-table", "percival-side-table", "jorah-side-table",
    "galadriel-side-table", "arqo-2-door-shoe-cabinet-80cm", "arvis-open-bookshelf",
    "darius-walnut-storage-cabinet", "ashlee-open-bookshelf", "darius-storage-cabinet",
    "martha-bedside-table", "rossholm-bed-side-table", "delio-bedside-table",
    "norvik-bedside-table", "ervado-bedside-table", "brevon-bedside-table",
    "deltaro-bedside-table", "princebed-robin-3-fold-mattress", "princebed-robin-foam-single-4",
    "princebed-para-foam-3-fold-foldable-mattress", "princebed-para-foam-single-4",
    "princebed-pegasus-3-fold-mattress", "bamboo-3-fold-foldable-foam-mattress-single",
    "sleepy-night-sleep-deluxe-mattress", "sleepy-night-dream-comfort-mattress",
    "arnatt-junior-bookshelf", "rylee-walnut-storage-cabinet", "arche-chest-of-drawer",
    "hylos-bed-side-table", "sigrid-wooden-bedside-table", "baby-sv-faux-leather-bed-frame",
    "danica-study-table-1-2m", "rylee-cherry-storage-cabinet", "vorie-rattan-side-table",
    "arvis-walnut-open-bookshelf", "koen-ii-storage-cabinet-3-tier", "caspira-bedside-table",
    "altaro-bedside-table", "carvion-bedside-table", "devonne-faux-leather-bed-frame",
    "una-office-chair",
}

SALE_PRICE = "219.00"

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/update-opening-sale-prices.py <shopify-export.csv>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = os.path.join(os.path.dirname(__file__), "opening-sale-import.csv")

    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        sys.exit(1)

    with open(input_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

        if "Handle" not in fieldnames or "Variant Price" not in fieldnames:
            print("ERROR: CSV doesn't look like a Shopify products export.")
            print(f"  Found columns: {fieldnames[:8]}...")
            sys.exit(1)

        rows = list(reader)

    output_rows = []
    current_handle = None
    include_current = False
    updated = 0
    skipped_already_219 = 0

    for row in rows:
        handle = row.get("Handle", "").strip()

        # Shopify CSV: only the first variant row has the handle; continuation
        # rows for the same product have an empty Handle field.
        if handle:
            current_handle = handle
            include_current = current_handle in OPENING_SALE_HANDLES

        if not include_current:
            continue

        output_rows.append(row)

        price_str = row.get("Variant Price", "").strip()
        compare_str = row.get("Variant Compare At Price", "").strip()

        if not price_str:
            continue  # image-only or non-variant row

        try:
            price = float(price_str)
        except ValueError:
            continue

        if price == 219.0:
            skipped_already_219 += 1
            continue

        # Only set compareAt if it isn't already set to something meaningful
        if not compare_str or float(compare_str or 0) < price:
            row["Variant Compare At Price"] = f"{price:.2f}"

        row["Variant Price"] = SALE_PRICE
        updated += 1

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"\nDone!")
    print(f"  Variants updated to $219:     {updated}")
    print(f"  Variants already at $219:     {skipped_already_219}")
    print(f"  Total rows in output CSV:     {len(output_rows)}")
    print(f"\n  Output saved to: {output_path}")
    print(f"\nNext step: Shopify admin → Products → Import → upload opening-sale-import.csv")

if __name__ == "__main__":
    main()
