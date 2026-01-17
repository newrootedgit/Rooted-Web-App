import type { FastifyRequest, FastifyReply } from 'fastify';
import type { inferAsyncReturnType } from '@trpc/server';
import { prisma } from '../db/index.js';

export async function createContext({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}) {
  return {
    req,
    res,
    prisma,
    auth: req.auth,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
