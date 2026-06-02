import { prisma } from './prisma';

export async function logAdminAction(params: {
  adminEmail: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
}) {
  try {
    await prisma.auditLog.create({
      data: {
        adminEmail: params.adminEmail,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
      }
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}
