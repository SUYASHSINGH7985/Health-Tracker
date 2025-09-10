import { Habit, Completion } from "@prisma/client"

interface HabitStats {
  currentStreak: number
  longestStreak: number
  completionRate: number
  totalCompletions: number
}

export function calculateHabitStats(
  habit: Habit & { completions: Completion[] }
): HabitStats {
  const completions = habit.completions
    .map((c) => new Date(c.completedAt))
    .sort((a, b) => b.getTime() - a.getTime())

  if (completions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      totalCompletions: 0,
    }
  }

  const now = new Date()
  const startOfToday = new Date(now.setHours(0, 0, 0, 0))
  const isDaily = habit.frequency === "daily"

  // Calculate streaks
  let currentStreak = 0
  let longestStreak = 0
  let currentCount = 0

  for (let i = 0; i < completions.length; i++) {
    const completion = completions[i]
    const prevCompletion = completions[i + 1]

    // Check if this completion continues the streak
    if (isStreakContinuous(completion, prevCompletion, isDaily)) {
      currentCount++
    } else {
      // Streak broken, update longest and reset current
      longestStreak = Math.max(longestStreak, currentCount)
      currentCount = 1
    }
  }

  // Update longest streak one final time
  longestStreak = Math.max(longestStreak, currentCount)

  // Calculate current streak (must include today/this week)
  const mostRecent = completions[0]
  if (isCurrentPeriod(mostRecent, startOfToday, isDaily)) {
    currentStreak = currentCount
  } else {
    currentStreak = 0
  }

  // Calculate completion rate
  const daysSinceStart = Math.ceil(
    (now.getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  const expectedCompletions = isDaily
    ? daysSinceStart
    : Math.floor(daysSinceStart / 7)
  
  const completionRate = Math.min(
    100,
    Math.round((completions.length / Math.max(1, expectedCompletions)) * 100)
  )

  return {
    currentStreak,
    longestStreak,
    completionRate,
    totalCompletions: completions.length,
  }
}

function isStreakContinuous(
  current: Date,
  previous: Date | undefined,
  isDaily: boolean
): boolean {
  if (!previous) return true

  const diffInDays = Math.floor(
    (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
  )

  return isDaily ? diffInDays === 1 : diffInDays <= 7
}

function isCurrentPeriod(
  completion: Date,
  startOfToday: Date,
  isDaily: boolean
): boolean {
  const diffInDays = Math.floor(
    (startOfToday.getTime() - completion.getTime()) / (1000 * 60 * 60 * 24)
  )

  return isDaily ? diffInDays === 0 : diffInDays <= 6
}
