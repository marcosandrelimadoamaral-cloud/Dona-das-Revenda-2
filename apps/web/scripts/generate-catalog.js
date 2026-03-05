const fs = require('fs');
const path = require('path');

const NUM_PRODUCTS_PER_BRAND = 50;

const BRANDS = [
    {
        id: 'natura',
        display: 'Natura',
        lines: [
            { name: 'Ekos', count: 10, category: 'skincare', subcategory: 'hidratante', basePrice: 40, suggestedPrice: 80 },
            { name: 'Tododia', count: 10, category: 'skincare', subcategory: 'creme-corporal', basePrice: 30, suggestedPrice: 60 },
            { name: 'Lumina', count: 5, category: 'cabelos', subcategory: 'shampoo', basePrice: 20, suggestedPrice: 40 },
            { name: 'Ilía', count: 5, category: 'perfumaria', subcategory: 'perfume', basePrice: 80, suggestedPrice: 160 },
            { name: 'Chronos', count: 5, category: 'skincare', subcategory: 'anti-idade', basePrice: 60, suggestedPrice: 120 },
            { name: 'Homem', count: 5, category: 'perfumaria', subcategory: 'perfume', basePrice: 90, suggestedPrice: 180 },
            { name: 'Plant', count: 5, category: 'cabelos', subcategory: 'condicionador', basePrice: 18, suggestedPrice: 36 },
            { name: 'Sève', count: 3, category: 'skincare', subcategory: 'oleo-corporal', basePrice: 50, suggestedPrice: 100 },
            { name: 'Naturé', count: 1, category: 'infantil', subcategory: 'colonia', basePrice: 35, suggestedPrice: 70 },
            { name: 'Mamãe e Bebê', count: 1, category: 'infantil', subcategory: 'sabonete', basePrice: 15, suggestedPrice: 30 },
        ]
    },
    {
        id: 'avon',
        display: 'Avon',
        lines: [
            { name: 'Far Away', count: 8, category: 'perfumaria', subcategory: 'perfume', basePrice: 45, suggestedPrice: 90 },
            { name: '300 km/h', count: 5, category: 'perfumaria', subcategory: 'perfume', basePrice: 40, suggestedPrice: 80 },
            { name: 'ColorTrend', count: 10, category: 'maquiagem', subcategory: 'batom', basePrice: 10, suggestedPrice: 20 },
            { name: 'Advance Techniques', count: 8, category: 'cabelos', subcategory: 'tratamento', basePrice: 15, suggestedPrice: 30 },
            { name: 'Anew', count: 8, category: 'skincare', subcategory: 'anti-idade', basePrice: 50, suggestedPrice: 100 },
            { name: 'Avon Care', count: 5, category: 'skincare', subcategory: 'hidratante', basePrice: 12, suggestedPrice: 24 },
            { name: 'Encanto', count: 3, category: 'skincare', subcategory: 'creme-corporal', basePrice: 25, suggestedPrice: 50 },
            { name: 'Segno', count: 3, category: 'perfumaria', subcategory: 'perfume', basePrice: 60, suggestedPrice: 120 },
        ]
    },
    {
        id: 'boticario',
        display: 'Boticário',
        lines: [
            { name: 'Nativa SPA', count: 15, category: 'skincare', subcategory: 'hidratante', basePrice: 45, suggestedPrice: 90 },
            { name: 'Malbec', count: 10, category: 'perfumaria', subcategory: 'perfume-masculino', basePrice: 90, suggestedPrice: 180 },
            { name: 'Coffee', count: 8, category: 'perfumaria', subcategory: 'perfume', basePrice: 85, suggestedPrice: 170 },
            { name: 'Lily', count: 5, category: 'perfumaria', subcategory: 'perfume-feminino', basePrice: 110, suggestedPrice: 220 },
            { name: 'Quasar', count: 4, category: 'perfumaria', subcategory: 'perfume', basePrice: 70, suggestedPrice: 140 },
            { name: 'Match', count: 4, category: 'cabelos', subcategory: 'mascara-capilar', basePrice: 35, suggestedPrice: 70 },
            { name: 'Intense', count: 2, category: 'maquiagem', subcategory: 'batom', basePrice: 20, suggestedPrice: 40 },
            { name: 'Egeo', count: 2, category: 'perfumaria', subcategory: 'perfume', basePrice: 75, suggestedPrice: 150 },
        ]
    },
    {
        id: 'marykay',
        display: 'Mary Kay',
        lines: [
            { name: 'TimeWise', count: 15, category: 'skincare', subcategory: 'creme-facial', basePrice: 60, suggestedPrice: 120 },
            { name: 'Botanical Effects', count: 10, category: 'skincare', subcategory: 'limpeza', basePrice: 40, suggestedPrice: 80 },
            { name: 'Velocity', count: 8, category: 'skincare', subcategory: 'hidratante', basePrice: 35, suggestedPrice: 70 },
            { name: 'At Play', count: 7, category: 'maquiagem', subcategory: 'batom-liquido', basePrice: 30, suggestedPrice: 60 },
            { name: 'Maquiagem', count: 10, category: 'maquiagem', subcategory: 'base', basePrice: 45, suggestedPrice: 90 },
        ]
    },
    {
        id: 'jequiti',
        display: 'Jequiti',
        lines: [
            { name: 'Ayna', count: 10, category: 'perfumaria', subcategory: 'colonia', basePrice: 30, suggestedPrice: 60 },
            { name: 'Pimenta Rosa', count: 10, category: 'skincare', subcategory: 'hidratante', basePrice: 20, suggestedPrice: 40 },
            { name: 'Sedução', count: 8, category: 'skincare', subcategory: 'locao', basePrice: 25, suggestedPrice: 50 },
            { name: 'Eternity', count: 7, category: 'perfumaria', subcategory: 'perfume', basePrice: 40, suggestedPrice: 80 },
            { name: 'Mais Vaidosa', count: 5, category: 'maquiagem', subcategory: 'esmalte', basePrice: 8, suggestedPrice: 16 },
            { name: 'Aviva', count: 5, category: 'maquiagem', subcategory: 'base', basePrice: 25, suggestedPrice: 50 },
            { name: 'Resgat', count: 5, category: 'cabelos', subcategory: 'tratamento', basePrice: 15, suggestedPrice: 30 },
        ]
    },
    {
        id: 'eudora',
        display: 'Eudora',
        lines: [
            { name: 'Niina Secrets', count: 15, category: 'maquiagem', subcategory: 'base', basePrice: 50, suggestedPrice: 100 },
            { name: 'Diva', count: 12, category: 'perfumaria', subcategory: 'perfume-feminino', basePrice: 70, suggestedPrice: 140 },
            { name: 'Club 6', count: 8, category: 'perfumaria', subcategory: 'perfume-masculino', basePrice: 65, suggestedPrice: 130 },
            { name: 'Intense', count: 7, category: 'skincare', subcategory: 'hidratante', basePrice: 35, suggestedPrice: 70 },
            { name: 'Celebration', count: 5, category: 'perfumaria', subcategory: 'perfume', basePrice: 55, suggestedPrice: 110 },
            { name: 'H Me', count: 3, category: 'perfumaria', subcategory: 'colonia', basePrice: 45, suggestedPrice: 90 },
        ]
    },
    {
        id: 'hinode',
        display: 'Hinode',
        lines: [
            { name: 'Hinode Bambu', count: 15, category: 'skincare', subcategory: 'locao-corporal', basePrice: 30, suggestedPrice: 60 },
            { name: 'Hinode La Vie', count: 12, category: 'perfumaria', subcategory: 'perfume-feminino', basePrice: 65, suggestedPrice: 130 },
            { name: 'Hinode City', count: 10, category: 'perfumaria', subcategory: 'perfume-masculino', basePrice: 70, suggestedPrice: 140 },
            { name: 'Cuidados Pessoais', count: 8, category: 'skincare', subcategory: 'sabonete', basePrice: 10, suggestedPrice: 20 },
            { name: 'Perfumes', count: 5, category: 'perfumaria', subcategory: 'colonia', basePrice: 50, suggestedPrice: 100 },
        ]
    },
    {
        id: 'racco',
        display: 'Racco',
        lines: [
            { name: 'Racco Cosméticos', count: 20, category: 'maquiagem', subcategory: 'diversos', basePrice: 35, suggestedPrice: 70 },
            { name: 'Racco Perfumes', count: 15, category: 'perfumaria', subcategory: 'perfume', basePrice: 60, suggestedPrice: 120 },
            { name: 'Racco Cuidados', count: 15, category: 'skincare', subcategory: 'hidratante', basePrice: 25, suggestedPrice: 50 },
        ]
    },
    {
        id: 'yanbal',
        display: 'Yanbal',
        lines: [
            {
                name: 'L\\'Bel', count: 20, category: 'skincare', subcategory: 'tratamento', basePrice: 70, suggestedPrice: 140 },
      { name: 'Esika', count: 20, category: 'perfumaria', subcategory: 'perfume', basePrice: 50, suggestedPrice: 100 },
      { name: 'Cyzone', count: 10, category: 'maquiagem', subcategory: 'jovem', basePrice: 25, suggestedPrice: 50 },
        ]
    },
    {
        id: 'independentes',
        display: 'Independentes',
        lines: [
            { name: 'Artesanal', count: 15, category: 'skincare', subcategory: 'sabonete-artesanal', basePrice: 10, suggestedPrice: 25 },
            { name: 'Importados', count: 15, category: 'perfumaria', subcategory: 'perfume-importado', basePrice: 150, suggestedPrice: 300 },
            { name: 'Genéricos', count: 20, category: 'acessorios', subcategory: 'diversos', basePrice: 15, suggestedPrice: 35 },
        ]
    }
];

const PROD_TYPES = ['Ultra', 'Intense', 'Fresh', 'Premium', 'Essencial', 'Glow', 'Matte', 'Classic', 'Pro'];
const DUMMY_MODIFIERS = ['100ml', '200ml', '50ml', 'Cor 1', 'Cor 2', ' FPS 30', 'FPS 50', '250g', '400ml'];

let globalId = 1;
const products = [];

for (const brand of BRANDS) {
    let brandSum = 0;
    for (const line of brand.lines) {
        for (let i = 0; i < line.count; i++) {

            const prodType = PROD_TYPES[Math.floor(Math.random() * PROD_TYPES.length)];
            const modifier = DUMMY_MODIFIERS[Math.floor(Math.random() * DUMMY_MODIFIERS.length)];

            let productName = `${line.subcategory.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} ${line.name} ${prodType} ${modifier}`;

            // Some variance in prices
            const variance = (Math.random() * 0.2) + 0.9; // 0.9 to 1.1 multiplier
            const bp = Number((line.basePrice * variance).toFixed(2));
            const sp = Number((line.suggestedPrice * variance).toFixed(2));

            // Make some popular
            const popular = (i === 0 || i === 1); // first two of each line are popular

            products.push({
                id: `${brand.id}-${String(globalId).padStart(3, '0')}`,
                brand: brand.id,
                brand_display: brand.display,
                line: line.name,
                name: productName.trim(),
                category: line.category,
                subcategory: line.subcategory,
                base_price: bp,
                suggested_price: sp,
                attributes: {
                    volume: modifier.includes('ml') || modifier.includes('g') ? modifier : 'N/A',
                    type: line.category,
                    main_ingredient: 'blend exclusivo',
                    skin_type: 'todos'
                },
                popular: popular,
                image_placeholder: `${brand.id}-${line.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${line.subcategory}`
            });
            globalId++;
            brandSum++;
        }
    }
    // Console log count to ensure exactly 50
    console.log(`Generated ${brandSum} products for ${brand.display}`);
}

const outputPath = path.join(__dirname, 'catalog-full.json');
fs.writeFileSync(outputPath, JSON.stringify({ products }, null, 2), 'utf8');
console.log(`Successfully wrote ${products.length} products to ${outputPath}`);
