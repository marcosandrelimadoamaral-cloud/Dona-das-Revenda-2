const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSaleInsert() {
    // Get a real user_id to test with
    const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
    if (!profiles || profiles.length === 0) { console.log('No users found'); return; }
    const userId = profiles[0].id;
    console.log('Testing with user:', userId);

    // Get a real product
    const { data: products } = await supabase
        .from('user_products')
        .select('id, purchase_price, current_stock, sale_price')
        .eq('user_id', userId)
        .limit(1);

    if (!products || products.length === 0) { console.log('No products found'); return; }
    const product = products[0];
    console.log('Product:', product);

    // Test sale insert
    const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
            user_id: userId,
            client_id: null,
            total_revenue: product.sale_price,
            total_cost: product.purchase_price,
            status: 'paid',
            payment_method: 'cash',
            is_fiado: false,
            due_date: null
        })
        .select('id')
        .single();

    if (saleError) {
        console.error('❌ SALE INSERT ERROR:', saleError);
        return;
    }
    console.log('✅ Sale inserted:', sale.id);

    // Test sale_items insert
    const { error: itemsError } = await supabase
        .from('sale_items')
        .insert({
            sale_id: sale.id,
            product_id: product.id,
            quantity: 1,
            price_at_time: product.sale_price
        });

    if (itemsError) {
        console.error('❌ SALE_ITEMS INSERT ERROR:', itemsError);
        // Cleanup
        await supabase.from('sales').delete().eq('id', sale.id);
        return;
    }
    console.log('✅ Sale items inserted');

    // Cleanup test data
    await supabase.from('sale_items').delete().eq('sale_id', sale.id);
    await supabase.from('sales').delete().eq('id', sale.id);
    console.log('✅ Test data cleaned up. All good!');
}

testSaleInsert();
