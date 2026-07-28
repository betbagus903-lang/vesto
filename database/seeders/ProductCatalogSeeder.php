<?php

namespace Database\Seeders;

use App\Models\AttributeOption;
use App\Models\Category;
use App\Models\ConfigurableAttribute;
use App\Models\Product;
use App\Models\ProductAttributeValue;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        // ── Existing subcategories ─────────────────────────────────
        $tshirt = Category::find(21);   // T.Shirt (under Mens)
        $hoodie = Category::find(23);   // Hoodie (under Mens)
        $jacket = Category::find(24);   // Jacket (under Mens)
        $dress  = Category::find(22);   // Dress (under Womens)
        $bags   = Category::find(27);   // Bags (under Accessories)
        $sneakers = Category::find(28); // Sneakers (under Footwear)
        $mens   = Category::find(19);
        $womens = Category::find(20);
        $acc    = Category::find(25);
        $foot   = Category::find(26);

        // ── New subcategories ──────────────────────────────────────
        $top = Category::firstOrCreate(['slug' => 'top'], ['name' => 'Top', 'slug' => 'top', 'parent_id' => $womens->id, 'is_active' => true, 'position' => 5]);
        $pants = Category::firstOrCreate(['slug' => 'pants'], ['name' => 'Pants', 'slug' => 'pants', 'parent_id' => $womens->id, 'is_active' => true, 'position' => 6]);
        $scarves = Category::firstOrCreate(['slug' => 'scarves'], ['name' => 'Scarves', 'slug' => 'scarves', 'parent_id' => $acc->id, 'is_active' => true, 'position' => 3]);
        $boots = Category::firstOrCreate(['slug' => 'boots'], ['name' => 'Boots', 'slug' => 'boots', 'parent_id' => $foot->id, 'is_active' => true, 'position' => 3]);

        // ── Reuse existing attributes from Clothing family ─────────
        // color(1), size(2), material(5) with their options already seeded

        // ── Helper ─────────────────────────────────────────────────
        $familyId = 1; // Clothing
        $colorAttrId = 1;
        $sizeAttrId = 2;
        $materialAttrId = 5;

        // Color options: White(1), Black(2), Grey(3), Navy(4), Red(5), Blue(6), Green(7), Pink(9)
        // Size options: XS(13), S(14), M(15), L(16), XL(17), XXL(18)
        $colors = [
            ['name' => 'White',  'id' => 1],
            ['name' => 'Black',  'id' => 2],
            ['name' => 'Grey',   'id' => 3],
            ['name' => 'Navy',   'id' => 4],
            ['name' => 'Red',    'id' => 5],
            ['name' => 'Blue',   'id' => 6],
            ['name' => 'Green',  'id' => 7],
            ['name' => 'Pink',   'id' => 9],
        ];
        $sizes = [
            ['name' => 'XS',  'id' => 13],
            ['name' => 'S',   'id' => 14],
            ['name' => 'M',   'id' => 15],
            ['name' => 'L',   'id' => 16],
            ['name' => 'XL',  'id' => 17],
            ['name' => 'XXL', 'id' => 18],
        ];

        // ═══════════════════════════════════════════════════════════
        //  MENS
        // ═══════════════════════════════════════════════════════════

        // ── T-Shirt: Polo Shirt (simple) ───────────────────────────
        if (!Product::where('sku', 'VST-POLO-001')->exists()) {
            $polo = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Polo Shirt',
                'short_description' => 'Classic cotton polo shirt with ribbed collar.',
                'description' => 'A timeless polo shirt crafted from breathable piqué cotton. Features a two-button placket and ribbed collar for a polished casual look.',
                'sku' => 'VST-POLO-001',
                'price' => 189000,
                'compare_at_price' => 249000,
                'stock' => 80,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $polo->categories()->attach([$tshirt->id, $mens->id]);
            ProductAttributeValue::create(['product_id' => $polo->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Cotton']);
        }

        // ── T-Shirt: Graphic Tee (configurable - color x size) ────
        if (!Product::where('sku', 'VST-GPH-001')->exists()) {
            $graphicTee = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Graphic Tee',
                'short_description' => 'Bold graphic print t-shirt in multiple colors.',
                'description' => 'Express yourself with our statement graphic tee. Printed on premium cotton with a relaxed fit. Available in 5 colors.',
                'sku' => 'VST-GPH-001',
                'price' => 149000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'featured' => true,
            ]);
            $graphicTee->categories()->attach([$tshirt->id, $mens->id]);
            ConfigurableAttribute::create(['product_id' => $graphicTee->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $graphicTee->id, 'attribute_id' => $sizeAttrId]);

            $gtColors = [['name' => 'White', 'id' => 1], ['name' => 'Black', 'id' => 2], ['name' => 'Navy', 'id' => 4], ['name' => 'Grey', 'id' => 3], ['name' => 'Red', 'id' => 5]];
            $this->createColorSizeVariants($graphicTee->id, 'VST-GPH', $gtColors, $sizes, 149000);
        }

        // ── Hoodie: Pullover Hoodie (simple) ───────────────────────
        if (!Product::where('sku', 'VST-HUD-001')->exists()) {
            $pulloverHoodie = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Pullover Hoodie',
                'short_description' => 'Cozy fleece pullover hoodie with kangaroo pocket.',
                'description' => 'Stay warm with our oversized pullover hoodie. Made from soft brushed fleece with a kangaroo pocket and adjustable drawstring hood.',
                'sku' => 'VST-HUD-001',
                'price' => 279000,
                'compare_at_price' => 349000,
                'stock' => 60,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $pulloverHoodie->categories()->attach([$hoodie->id, $mens->id]);
            ProductAttributeValue::create(['product_id' => $pulloverHoodie->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Fleece']);
        }

        // ── Hoodie: Zip-Up Hoodie (configurable - color x size) ───
        if (!Product::where('sku', 'VST-ZPH-001')->exists()) {
            $zipHoodie = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Zip-Up Hoodie',
                'short_description' => 'Lightweight zip-up hoodie, perfect for layering.',
                'description' => 'A versatile zip-up hoodie in a lightweight French terry fabric. Features full zip closure, side pockets, and ribbed cuffs.',
                'sku' => 'VST-ZPH-001',
                'price' => 319000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
            ]);
            $zipHoodie->categories()->attach([$hoodie->id, $mens->id]);
            ConfigurableAttribute::create(['product_id' => $zipHoodie->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $zipHoodie->id, 'attribute_id' => $sizeAttrId]);

            $zhColors = [['name' => 'Black', 'id' => 2], ['name' => 'Grey', 'id' => 3], ['name' => 'Navy', 'id' => 4]];
            $this->createColorSizeVariants($zipHoodie->id, 'VST-ZPH', $zhColors, $sizes, 319000);
        }

        // ── Jacket: Denim Jacket (configurable - color x size) ────
        if (!Product::where('sku', 'VST-DNM-001')->exists()) {
            $denimJacket = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Denim Jacket',
                'short_description' => 'Classic trucker denim jacket in vintage wash.',
                'description' => 'A wardrobe essential. Our denim jacket is crafted from premium selvedge denim with a vintage stone wash finish. Features button closure and chest pockets.',
                'sku' => 'VST-DNM-001',
                'price' => 459000,
                'compare_at_price' => 599000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'featured' => true,
            ]);
            $denimJacket->categories()->attach([$jacket->id, $mens->id]);
            ConfigurableAttribute::create(['product_id' => $denimJacket->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $denimJacket->id, 'attribute_id' => $sizeAttrId]);

            $djColors = [['name' => 'Blue', 'id' => 6], ['name' => 'Black', 'id' => 2], ['name' => 'Navy', 'id' => 4]];
            $this->createColorSizeVariants($denimJacket->id, 'VST-DNM', $djColors, $sizes, 459000);
        }

        // ── Jacket: Bomber Jacket (simple) ─────────────────────────
        if (!Product::where('sku', 'VST-BMB-001')->exists()) {
            $bomber = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Bomber Jacket',
                'short_description' => 'Sleek nylon bomber jacket with ribbed trim.',
                'description' => 'Stay stylish in our lightweight bomber jacket. Constructed from water-resistant nylon with satin lining, ribbed collar and cuffs.',
                'sku' => 'VST-BMB-001',
                'price' => 549000,
                'stock' => 40,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $bomber->categories()->attach([$jacket->id, $mens->id]);
            ProductAttributeValue::create(['product_id' => $bomber->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Polyester']);
        }

        // ═══════════════════════════════════════════════════════════
        //  WOMENS
        // ═══════════════════════════════════════════════════════════

        // ── Dress: Floral Wrap Dress (configurable - color x size) ─
        if (!Product::where('sku', 'VST-FLW-001')->exists()) {
            $floralDress = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Floral Wrap Dress',
                'short_description' => 'Romantic floral print wrap dress with adjustable tie.',
                'description' => 'Turn heads in our Floral Wrap Dress. Features a flattering V-neckline, adjustable waist tie, and flowing midi-length skirt. Available in 4 colors.',
                'sku' => 'VST-FLW-001',
                'price' => 389000,
                'compare_at_price' => 499000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'new' => true,
                'featured' => true,
            ]);
            $floralDress->categories()->attach([$dress->id, $womens->id]);
            ConfigurableAttribute::create(['product_id' => $floralDress->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $floralDress->id, 'attribute_id' => $sizeAttrId]);

            $fdColors = [['name' => 'Pink', 'id' => 9], ['name' => 'Green', 'id' => 7], ['name' => 'Blue', 'id' => 6], ['name' => 'Red', 'id' => 5]];
            $this->createColorSizeVariants($floralDress->id, 'VST-FLW', $fdColors, $sizes, 389000);
        }

        // ── Dress: Satin Maxi Dress (simple) ───────────────────────
        if (!Product::where('sku', 'VST-SAT-001')->exists()) {
            $satinDress = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Satin Maxi Dress',
                'short_description' => 'Luxurious satin maxi dress with side slit.',
                'description' => 'Make an entrance with our Satin Maxi Dress. Made from lustrous satin with a figure-skimming silhouette, V-back, and elegant side slit.',
                'sku' => 'VST-SAT-001',
                'price' => 699000,
                'compare_at_price' => 899000,
                'stock' => 30,
                'status' => true,
                'is_active' => true,
            ]);
            $satinDress->categories()->attach([$dress->id, $womens->id]);
            ProductAttributeValue::create(['product_id' => $satinDress->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Silk']);
        }

        // ── Top: Cropped Blouse (simple) ───────────────────────────
        if (!Product::where('sku', 'VST-CRP-001')->exists()) {
            $croppedBlouse = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Cropped Blouse',
                'short_description' => 'Charming cropped blouse with puff sleeves.',
                'description' => 'Add a touch of femininity with our Cropped Blouse. Features romantic puff sleeves, a sweetheart neckline, and a relaxed cropped fit.',
                'sku' => 'VST-CRP-001',
                'price' => 199000,
                'stock' => 50,
                'status' => true,
                'is_active' => true,
            ]);
            $croppedBlouse->categories()->attach([$top->id, $womens->id]);
            ProductAttributeValue::create(['product_id' => $croppedBlouse->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Rayon']);
        }

        // ── Top: Silk Camisole (configurable - color x size) ──────
        if (!Product::where('sku', 'VST-CSL-001')->exists()) {
            $camisole = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Silk Camisole',
                'short_description' => 'Delicate silk camisole with adjustable straps.',
                'description' => 'Our Silk Camisole is a layering essential. Crafted from 100% mulberry silk with adjustable spaghetti straps and a flattering V-neckline.',
                'sku' => 'VST-CSL-001',
                'price' => 259000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $camisole->categories()->attach([$top->id, $womens->id]);
            ConfigurableAttribute::create(['product_id' => $camisole->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $camisole->id, 'attribute_id' => $sizeAttrId]);

            $csColors = [['name' => 'White', 'id' => 1], ['name' => 'Black', 'id' => 2], ['name' => 'Pink', 'id' => 9], ['name' => 'Navy', 'id' => 4]];
            $this->createColorSizeVariants($camisole->id, 'VST-CSL', $csColors, $sizes, 259000);
        }

        // ── Pants: Tailored Trousers (configurable - color x size) ─
        if (!Product::where('sku', 'VST-TRP-001')->exists()) {
            $trousers = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Tailored Trousers',
                'short_description' => 'High-waist tailored trousers with wide leg.',
                'description' => 'Elevate your wardrobe with our Tailored Trousers. High-waist design with a wide-leg silhouette and pressed crease for a refined look.',
                'sku' => 'VST-TRP-001',
                'price' => 349000,
                'compare_at_price' => 429000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'featured' => true,
            ]);
            $trousers->categories()->attach([$pants->id, $womens->id]);
            ConfigurableAttribute::create(['product_id' => $trousers->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $trousers->id, 'attribute_id' => $sizeAttrId]);

            $trColors = [['name' => 'Black', 'id' => 2], ['name' => 'Navy', 'id' => 4], ['name' => 'Beige', 'id' => 11]];
            $this->createColorSizeVariants($trousers->id, 'VST-TRP', $trColors, $sizes, 349000);
        }

        // ── Pants: Wide Leg Jeans (simple) ─────────────────────────
        if (!Product::where('sku', 'VST-WLJ-001')->exists()) {
            $wideLegJeans = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Wide Leg Jeans',
                'short_description' => 'Retro-inspired wide leg jeans in vintage denim.',
                'description' => 'Channel retro vibes with our Wide Leg Jeans. Made from premium vintage-wash denim with a high waist and dramatic wide leg.',
                'sku' => 'VST-WLJ-001',
                'price' => 399000,
                'stock' => 45,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $wideLegJeans->categories()->attach([$pants->id, $womens->id]);
            ProductAttributeValue::create(['product_id' => $wideLegJeans->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Denim']);
        }

        // ═══════════════════════════════════════════════════════════
        //  ACCESSORIES
        // ═══════════════════════════════════════════════════════════

        // ── Bags: Leather Crossbody Bag (simple) ───────────────────
        if (!Product::where('sku', 'VST-XBG-001')->exists()) {
            $crossbody = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Leather Crossbody Bag',
                'short_description' => 'Compact leather crossbody with adjustable strap.',
                'description' => 'Our Leather Crossbody Bag is the perfect everyday companion. Crafted from genuine leather with an adjustable strap and magnetic snap closure.',
                'sku' => 'VST-XBG-001',
                'price' => 459000,
                'compare_at_price' => 599000,
                'stock' => 35,
                'status' => true,
                'is_active' => true,
                'featured' => true,
            ]);
            $crossbody->categories()->attach([$bags->id, $acc->id]);
            ProductAttributeValue::create(['product_id' => $crossbody->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Leather']);
        }

        // ── Bags: Canvas Tote (simple) ─────────────────────────────
        if (!Product::where('sku', 'VST-TOT-001')->exists()) {
            $tote = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Canvas Tote',
                'short_description' => 'Oversized canvas tote with inner pocket.',
                'description' => 'Our Canvas Tote is built for everyday adventures. Heavy-duty cotton canvas with reinforced handles and a zippered inner pocket.',
                'sku' => 'VST-TOT-001',
                'price' => 189000,
                'stock' => 100,
                'status' => true,
                'is_active' => true,
            ]);
            $tote->categories()->attach([$bags->id, $acc->id]);
            ProductAttributeValue::create(['product_id' => $tote->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Cotton']);
        }

        // ── Scarves: Silk Scarf (simple) ───────────────────────────
        if (!Product::where('sku', 'VST-SCR-001')->exists()) {
            $scarf = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Silk Scarf',
                'short_description' => 'Luxurious printed silk scarf with hand-rolled edges.',
                'description' => 'Add a pop of elegance with our Silk Scarf. Made from pure mulberry silk with a vibrant botanical print and hand-rolled edges.',
                'sku' => 'VST-SCR-001',
                'price' => 249000,
                'stock' => 50,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $scarf->categories()->attach([$scarves->id, $acc->id]);
            ProductAttributeValue::create(['product_id' => $scarf->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Silk']);
        }

        // ═══════════════════════════════════════════════════════════
        //  FOOTWEAR
        // ═══════════════════════════════════════════════════════════

        // ── Sneakers: Canvas Sneakers (configurable - color x size) ─
        if (!Product::where('sku', 'VST-CVS-001')->exists()) {
            $canvasSneakers = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Canvas Sneakers',
                'short_description' => 'Minimalist canvas sneakers in clean colorways.',
                'description' => 'Our Canvas Sneakers feature a clean minimalist design with vulcanized rubber soles and breathable cotton canvas uppers.',
                'sku' => 'VST-CVS-001',
                'price' => 299000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $canvasSneakers->categories()->attach([$sneakers->id, $foot->id]);
            ConfigurableAttribute::create(['product_id' => $canvasSneakers->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $canvasSneakers->id, 'attribute_id' => $sizeAttrId]);

            $csColors = [['name' => 'White', 'id' => 1], ['name' => 'Black', 'id' => 2], ['name' => 'Red', 'id' => 5], ['name' => 'Navy', 'id' => 4]];
            $this->createColorSizeVariants($canvasSneakers->id, 'VST-CVS', $csColors, $sizes, 299000);
        }

        // ── Sneakers: Running Shoes (simple) ───────────────────────
        if (!Product::where('sku', 'VST-RNS-001')->exists()) {
            $runningShoes = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Running Shoes',
                'short_description' => 'Lightweight running shoes with responsive cushioning.',
                'description' => 'Hit the ground running with our Running Shoes. Engineered mesh upper, responsive foam midsole, and durable rubber outsole for all-day comfort.',
                'sku' => 'VST-RNS-001',
                'price' => 599000,
                'compare_at_price' => 749000,
                'stock' => 40,
                'status' => true,
                'is_active' => true,
                'featured' => true,
            ]);
            $runningShoes->categories()->attach([$sneakers->id, $foot->id]);
            ProductAttributeValue::create(['product_id' => $runningShoes->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Polyester']);
        }

        // ── Boots: Ankle Boots (configurable - color x size) ──────
        if (!Product::where('sku', 'VST-ANK-001')->exists()) {
            $ankleBoots = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'configurable',
                'name' => 'Ankle Boots',
                'short_description' => 'Chic ankle boots with block heel.',
                'description' => 'Complete any outfit with our Ankle Boots. Genuine leather upper with a comfortable 5cm block heel and side zip closure.',
                'sku' => 'VST-ANK-001',
                'price' => 699000,
                'compare_at_price' => 899000,
                'stock' => 0,
                'status' => true,
                'is_active' => true,
                'new' => true,
            ]);
            $ankleBoots->categories()->attach([$boots->id, $foot->id]);
            ConfigurableAttribute::create(['product_id' => $ankleBoots->id, 'attribute_id' => $colorAttrId]);
            ConfigurableAttribute::create(['product_id' => $ankleBoots->id, 'attribute_id' => $sizeAttrId]);

            $abColors = [['name' => 'Black', 'id' => 2], ['name' => 'Brown', 'id' => 10], ['name' => 'Beige', 'id' => 11]];
            $this->createColorSizeVariants($ankleBoots->id, 'VST-ANK', $abColors, $sizes, 699000);
        }

        // ── Boots: Chelsea Boots (simple) ──────────────────────────
        if (!Product::where('sku', 'VST-CHL-001')->exists()) {
            $chelseaBoots = Product::create([
                'attribute_family_id' => $familyId,
                'type' => 'simple',
                'name' => 'Chelsea Boots',
                'short_description' => 'Timeless suede Chelsea boots with elastic side panels.',
                'description' => 'A forever classic. Our Chelsea Boots are crafted from premium suede with elastic side panels and a pull tab for easy on and off.',
                'sku' => 'VST-CHL-001',
                'price' => 799000,
                'stock' => 25,
                'status' => true,
                'is_active' => true,
            ]);
            $chelseaBoots->categories()->attach([$boots->id, $foot->id]);
            ProductAttributeValue::create(['product_id' => $chelseaBoots->id, 'attribute_id' => $materialAttrId, 'text_value' => 'Leather']);
        }

        $this->command->info('✓ Fashion catalog seeded: 16 products (8 configurable + 8 simple) across 8 subcategories');
    }

    /**
     * Create color x size variant matrix for a configurable product.
     */
    private function createColorSizeVariants(
        int $productId,
        string $skuPrefix,
        array $colors,
        array $sizes,
        int $basePrice,
    ): void {
        $pos = 1;
        foreach ($colors as $col) {
            foreach ($sizes as $sz) {
                $short = strtoupper(substr($col['name'], 0, 3));
                ProductVariant::create([
                    'product_id' => $productId,
                    'sku' => $skuPrefix . '-' . $short . '-' . $sz['name'],
                    'color' => $col['name'],
                    'size' => $sz['name'],
                    'name' => $col['name'] . ' / ' . $sz['name'],
                    'price' => $basePrice,
                    'stock' => rand(10, 50),
                    'is_default' => $pos === 1,
                    'is_active' => true,
                    'position' => $pos++,
                ]);
            }
        }
    }
}
