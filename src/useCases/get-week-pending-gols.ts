import dayjs from "dayjs";
import { and, count, gte, lte, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";

export async function getWeekPendingGoals() {
    const fistDayWeek = dayjs().startOf('week').toDate()
    const lastDayWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayWeek))
    )

    const goalCompletionCounts = db.$with('goal_completion_counts').as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount')
        })
        .from(goalCompletions)
        .where(and(
            gte(goalCompletions.createdAt, fistDayWeek),
            lte(goalCompletions.createdAt, lastDayWeek)
        ))
        .groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql/*sql*/` 
            COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number)
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id))


    return {
        pendingGoals
    }
}