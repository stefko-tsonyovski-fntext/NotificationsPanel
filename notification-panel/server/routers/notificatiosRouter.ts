import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const notificationsRouter = router({
  getNotifications: procedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      const notifications = await prisma.notification.findMany({
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalNotifications = await prisma.notification.count();

      return {
        notifications,
        total: totalNotifications,
      };
    }),
  getLatestNotifications: procedure.query(async () => {
    return await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  }),
  getUnreadCount: procedure.query(async () => {
    return await prisma.notification.count({
      where: {
        read: false,
      },
    });
  }),
  addNotification: procedure
    .input(
      z.object({
        type: z.string().min(1),
        message: z.string().min(1),
        releaseNumber: z.string().optional(),
        personName: z.string().optional(),
      })
    )
    .mutation(({ input, ctx: context }) => {
      return prisma.notification.create({
        data: input,
      });
    }),
  markAsRead: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.notification.update({
        where: { id: input.id },
        data: { read: true },
      });
    }),
});
