/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
// import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  name: true,
  text: true,
  createdAt: true,
});

export const commentRouter = createRouter()
  // read
  .query('byPostId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      return await prisma.comment.findMany({
        where: { postId: id },
        select: defaultCommentSelect,
      });
    },
  })
  // add
  .mutation('add', {
    input: z.object({
      postId: z.string().uuid(),
      name: z.string().min(1).max(32),
      text: z.string().min(1),
    }),
    async resolve({ input }) {
      const comment = await prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      });
      return comment;
    },
  });
