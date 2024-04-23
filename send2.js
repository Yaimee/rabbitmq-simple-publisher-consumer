const amqp = require('amqplib');

async function sendProductToQueue(product) {
    const queue = 'productQueue';
    const connectionString = 'amqp://guest:guest@localhost';
    const conn = await amqp.connect(connectionString);
    const channel = await conn.createChannel();
    
    await channel.assertQueue(queue, { durable: true });

    try {
        const message = Buffer.from(JSON.stringify(product));
        const sent = channel.sendToQueue(queue, message);
        if (!sent) {
            console.log("Failed to send:", product);
        } else {
            console.log(" [x] Sent %s", JSON.stringify(product));
        }
    } catch (error) {
        console.error('Error sending product:', error);
    } finally {
        // Ensure the channel and connection are closed cleanly
        setTimeout(async () => {
            await channel.close();
            await conn.close();
        }, 1000);
    }
}

const generateProduct = () => {
    return {
        id: 1234,
        name: 'fiskefrikadelle',
        price: Math.random() * 100,
        description: 'Description for product 1',
        stock: Math.floor(Math.random() * 100)
    };
};

const product = generateProduct(); // Generate a single product
sendProductToQueue(product).catch(console.error);
