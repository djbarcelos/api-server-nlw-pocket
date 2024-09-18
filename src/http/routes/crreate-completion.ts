import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createGoalCompletion } from '../../useCases/create-goal-competion'

export const createComplitionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goal-completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.body
      await createGoalCompletion({ goalId })
    }
  )
}
