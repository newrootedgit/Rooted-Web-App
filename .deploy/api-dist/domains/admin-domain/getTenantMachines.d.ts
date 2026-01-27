export declare function getTenantMachines(tenantId: string): Promise<({
    farms: {
        name: string;
        id: string;
        slug: string;
    } | null;
} & {
    name: string;
    status: string | null;
    id: string;
    tenant_id: string | null;
    farm_id: string | null;
    created_at: Date | null;
    device_id: string;
    aws_iot_thing_name: string | null;
    last_seen_at: Date | null;
    current_wifi_ssid: string | null;
})[]>;
//# sourceMappingURL=getTenantMachines.d.ts.map