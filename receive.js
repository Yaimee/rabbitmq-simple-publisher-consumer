const amqp = require('amqplib');

async function receiveProducts() {
    const queue = 'productQueue';
    const conn = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await conn.createChannel();

    await channel.assertQueue(queue, { durable: false });
    console.log(" [*] Waiting for products in %s. To exit press CTRL+C", queue);

    channel.consume(queue, message => {
        const product = JSON.parse(message.content.toString());
        console.log(" [x] Received %s", JSON.stringify(product));
    }, { noAck: true });
}

receiveProducts().catch(console.error);
