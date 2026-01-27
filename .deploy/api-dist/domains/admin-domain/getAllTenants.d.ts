export declare function getAllTenants(): Promise<{
    name: string;
    id: string;
    created_at: Date | null;
    slug: string;
    contact_email: string | null;
    _count: {
        farms: number;
        machines: number;
    };
}[]>;
//# sourceMappingURL=getAllTenants.d.ts.map