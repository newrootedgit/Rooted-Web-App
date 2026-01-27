export async function getUserFarms(prisma, userId) {
    const farmUsers = await prisma.farm_users.findMany({
        where: { clerk_user_id: userId, is_active: true },
        include: { farms: true },
    });
    return farmUsers
        .filter((fu) => fu.farms)
        .map((fu) => ({
        farmId: fu.farms.id,
        name: fu.farms.name,
        slug: fu.farms.slug,
        role: fu.role,
    }));
}
//# sourceMappingURL=getUserFarms.js.map