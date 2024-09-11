import { fastify } from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoal } from '../useCases/create-goal';
import { getWeekPendingGoals } from '../useCases/get-week-pending-gols';
import { createGoalCompletion } from '../useCases/create-goal-competion';
import z from 'zod';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()
    return { pendingGoals } 
})

app.post('/goals', {
    schema: {
        body: z.object({
            title: z.string(),
            desiredWeeklyFrequency: z.number().int().min(1).max(7)
        })
    }
}, async request => {
    const { title, desiredWeeklyFrequency } = request.body;
    await createGoal({ title, desiredWeeklyFrequency })
})

app.post('/goal-completions', {
    schema: {
        body: z.object({
            goalId: z.string(),
        })
    }
},async request => {
    const { goalId } = request.body
    await createGoalCompletion({ goalId })
})

app.listen({
    port: 3333
}).then(() => {
    console.log('HTTP server running')
})