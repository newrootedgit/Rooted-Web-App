import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

const iotClient = new IoTDataPlaneClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_IOT_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function publishToDevice(
    thingName: string, 
    payload: Record<string, unknown>
): Promise<void> { 
    const topic = `rooted/machines/${thingName}/commands`;

    await iotClient.send(new PublishCommand({
        topic,
        qos: 1,
        payload: Buffer.from(JSON.stringify(payload)),
    }));
}