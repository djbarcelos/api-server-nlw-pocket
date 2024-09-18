import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getWeekPendingGoals } from '../../useCases/get-week-pending-gols'

export const getPendingGoalRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()
    return { pendingGoals }
  })
}
