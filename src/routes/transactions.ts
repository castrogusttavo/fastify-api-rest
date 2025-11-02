import { randomUUID } from "node:crypto";
import { db } from "../database.js";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middleware/check-session-id-exists.js";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId;

      const transactions = await db("transactions")
        .where("session_id", sessionId)
        .select();
      return { transactions };
    },
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);

      const sessionId = request.cookies.sessionId;

      const transactions = await db("transactions")
        .where({ session_id: sessionId, id })
        .select();

      return { transactions };
    },
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId;

      const summary = await db("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    },
  );

  app.post("/", async (request, reply) => {
    const createTransactionBodyScheam = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodyScheam.parse(
      request.body,
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await db("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
