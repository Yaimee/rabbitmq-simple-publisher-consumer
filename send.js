const amqp = require('amqplib');

async function sendProductsToQueue(products) {
    const queue = 'productQueue';
    const connectionString = 'amqp://guest:guest@localhost';
    const conn = await amqp.connect(connectionString);
    const channel = await conn.createChannel();
    
    await channel.assertQueue(queue, { durable: true });

    // Helper function to create a delay
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // Send products with a delay of 0.2 seconds between each
        for (let product of products) {
            const message = Buffer.from(JSON.stringify(product));
            const sent = channel.sendToQueue(queue, message);
            if (!sent) {
                console.log("Failed to send:", product);
            } else {
                console.log(" [x] Sent %s", JSON.stringify(product));
            }
            await delay(200); // Wait for 200ms before the next iteration
        }
    } catch (error) {
        console.error('Error sending products:', error);
    } finally {
        // Ensure the channel and connection are closed cleanly
        setTimeout(async () => {
            await channel.close();
            await conn.close();
        }, 1000);
    }
}

const generateProducts = (count) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: Math.random() * 100,
            description: `Description for product ${i + 1}`,
            stock: Math.floor(Math.random() * 100)
        });
    }
    return products;
};

const products = generateProducts(100); // Generate 100 products dynamically
sendProductsToQueue(products).catch(console.error);
