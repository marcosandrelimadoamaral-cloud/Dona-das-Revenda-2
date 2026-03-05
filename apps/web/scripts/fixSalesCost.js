const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jlnsnxqfasjuvbhzldma.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCosts() {
    console.log('Fetching sales...');
    const { data: sales, error } = await supabase.from('sales').select('id, total_cost');

    if (error) {
        console.error('Error fetching sales:', error);
        return;
    }

    console.log(`Found ${sales.length} sales.`);

    for (const sale of sales) {
        if (sale.total_cost === 0 || sale.total_cost === null) {
            console.log(`Calculating cost for sale ${sale.id}...`);

            const { data: items } = await supabase
                .from('sale_items')
                .select('product_id, quantity')
                .eq('sale_id', sale.id);

            if (items && items.length > 0) {
                let calculatedCost = 0;

                for (const item of items) {
                    const { data: product } = await supabase
                        .from('user_products')
                        .select('purchase_price')
                        .eq('id', item.product_id)
                        .single();

                    if (product) {
                        calculatedCost += Number(product.purchase_price || 0) * item.quantity;
                    }
                }

                console.log(`Sale ${sale.id} calculated cost: ${calculatedCost}`);

                const { error: updateError } = await supabase
                    .from('sales')
                    .update({ total_cost: calculatedCost })
                    .eq('id', sale.id);

                if (updateError) {
                    console.error(`Failed to update sale ${sale.id}:`, updateError);
                } else {
                    console.log(`Successfully updated sale ${sale.id}!`);
                }
            } else {
                console.log(`No items found for sale ${sale.id}. Skipping.`);
            }
        }
    }

    console.log('Finished updating past sales!');
}

fixCosts();
