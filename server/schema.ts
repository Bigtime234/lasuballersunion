import { pgTable, serial, text, integer, timestamp, boolean as booleanColumn, pgEnum, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const matchStatusEnum = pgEnum('match_status', ['PENDING', 'LIVE', 'FINISHED']);
export const seasonStatusEnum = pgEnum('season_status', ['ACTIVE', 'COMPLETED']);
export const matchCategoryEnum = pgEnum('match_category', ['men', 'women']);

// ============================================
// NEXTAUTH TABLES (REQUIRED)
// ============================================

export const users = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  role: userRoleEnum('role').notNull().default('user'),
  twoFactorEnabled: booleanColumn('two_factor_enabled').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('account', {
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => {
  return {
    userIdIdx: uniqueIndex('account_userId_provider_idx').on(table.userId, table.provider),
  };
});

export const sessions = pgTable('session', {
  sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
}, (table) => {
  return {
    emailTokenIdx: uniqueIndex('verification_email_token_idx').on(table.identifier, table.token),
  };
});

// ============================================
// SEASONS TABLE
// ============================================

export const seasons = pgTable('seasons', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  status: seasonStatusEnum('status').notNull().default('ACTIVE'),
  championFacultyId: integer('champion_faculty_id').references(() => faculties.id),
  runnerUpFacultyId: integer('runner_up_faculty_id').references(() => faculties.id),
  thirdPlaceFacultyId: integer('third_place_faculty_id').references(() => faculties.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// SEASON STANDINGS TABLE (NEW)
// ============================================

export const seasonStandings = pgTable('season_standings', {
  id: serial('id').primaryKey(),
  seasonId: integer('season_id').notNull().references(() => seasons.id, { onDelete: 'cascade' }),
  facultyId: integer('faculty_id').notNull().references(() => faculties.id, { onDelete: 'cascade' }),
  category: matchCategoryEnum('category').notNull(), // 'men' or 'women'
  finalPosition: integer('final_position').notNull(), // 1st, 2nd, 3rd...
  played: integer('played').notNull().default(0),
  won: integer('won').notNull().default(0),
  drawn: integer('drawn').notNull().default(0),
  lost: integer('lost').notNull().default(0),
  goalsFor: integer('goals_for').notNull().default(0),
  goalsAgainst: integer('goals_against').notNull().default(0),
  goalDifference: integer('goal_difference').notNull().default(0),
  points: integer('points').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    uniqueSeasonFacultyCategory: uniqueIndex('unique_season_faculty_category_idx').on(
      table.seasonId,
      table.facultyId,
      table.category
    ),
  };
});

// ============================================
// FACULTIES TABLE
// ============================================

export const faculties = pgTable('faculties', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  abbreviation: text('abbreviation').notNull().unique(),
  colorPrimary: text('color_primary').notNull().default('#3B82F6'),
  colorSecondary: text('color_secondary').notNull().default('#1E40AF'),
  logo: text('logo'),
  // NOTE: These stats columns are kept for backward compatibility
  // but are NOT used for display (calculated from matches instead)
  played: integer('played').notNull().default(0),
  won: integer('won').notNull().default(0),
  drawn: integer('drawn').notNull().default(0),
  lost: integer('lost').notNull().default(0),
  goalsFor: integer('goals_for').notNull().default(0),
  goalsAgainst: integer('goals_against').notNull().default(0),
  goalDifference: integer('goal_difference').notNull().default(0),
  points: integer('points').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  championshipsWon: integer('championships_won').notNull().default(0),
  runnerUpCount: integer('runner_up_count').notNull().default(0),
  thirdPlaceCount: integer('third_place_count').notNull().default(0),
  isCurrentChampion: booleanColumn('is_current_champion').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// MATCHES TABLE
// ============================================

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  seasonId: integer('season_id').references(() => seasons.id),
  homeFacultyId: integer('home_faculty_id').notNull().references(() => faculties.id),
  awayFacultyId: integer('away_faculty_id').notNull().references(() => faculties.id),
  category: matchCategoryEnum('category').notNull().default('men'),
  scoreHome: integer('score_home').notNull().default(0),
  scoreAway: integer('score_away').notNull().default(0),
  matchDate: timestamp('match_date').notNull(),
  venue: text('venue').notNull().default('Main Field'),
  matchMinute: integer('match_minute').default(0),
  status: matchStatusEnum('status').notNull().default('PENDING'),
  importance: text('importance'),
  notes: text('notes'),
  likesCount: integer('likes_count').notNull().default(0),
  archived: booleanColumn('archived').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  startedAt: timestamp('started_at'),
  finishedAt: timestamp('finished_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// MATCH LIKES TABLE
// ============================================

export const matchLikes = pgTable('match_likes', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').notNull().references(() => matches.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    uniqueUserMatch: uniqueIndex('unique_user_match_idx').on(table.userId, table.matchId),
  };
});

// ============================================
// PLAYERS TABLE
// ============================================

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  facultyId: integer('faculty_id').notNull().references(() => faculties.id),
  goals: integer('goals').notNull().default(0),
  assists: integer('assists').notNull().default(0),
  yellowCards: integer('yellow_cards').notNull().default(0),
  redCards: integer('red_cards').notNull().default(0),
  matchesPlayed: integer('matches_played').notNull().default(0),
  jerseyNumber: integer('jersey_number'),
  position: text('position'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// COMMENTARY TEMPLATES TABLE
// ============================================

export const commentaryTemplates = pgTable('commentary_templates', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(),
  template: text('template').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============================================
// ADMIN ACTIVITY LOG
// ============================================

export const adminActivityLog = pgTable('admin_activity_log', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: integer('entity_id').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  matchLikes: many(matchLikes),
  activityLogs: many(adminActivityLog),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  champion: one(faculties, {
    fields: [seasons.championFacultyId],
    references: [faculties.id],
    relationName: 'championSeasons',
  }),
  runnerUp: one(faculties, {
    fields: [seasons.runnerUpFacultyId],
    references: [faculties.id],
    relationName: 'runnerUpSeasons',
  }),
  thirdPlace: one(faculties, {
    fields: [seasons.thirdPlaceFacultyId],
    references: [faculties.id],
    relationName: 'thirdPlaceSeasons',
  }),
  matches: many(matches),
  standings: many(seasonStandings),
}));

export const seasonStandingsRelations = relations(seasonStandings, ({ one }) => ({
  season: one(seasons, {
    fields: [seasonStandings.seasonId],
    references: [seasons.id],
  }),
  faculty: one(faculties, {
    fields: [seasonStandings.facultyId],
    references: [faculties.id],
  }),
}));

export const facultiesRelations = relations(faculties, ({ many }) => ({
  homeMatches: many(matches, { relationName: 'homeMatches' }),
  awayMatches: many(matches, { relationName: 'awayMatches' }),
  players: many(players),
  championSeasons: many(seasons, { relationName: 'championSeasons' }),
  runnerUpSeasons: many(seasons, { relationName: 'runnerUpSeasons' }),
  thirdPlaceSeasons: many(seasons, { relationName: 'thirdPlaceSeasons' }),
  seasonStandings: many(seasonStandings),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  season: one(seasons, {
    fields: [matches.seasonId],
    references: [seasons.id],
  }),
  homeFaculty: one(faculties, {
    fields: [matches.homeFacultyId],
    references: [faculties.id],
    relationName: 'homeMatches',
  }),
  awayFaculty: one(faculties, {
    fields: [matches.awayFacultyId],
    references: [faculties.id],
    relationName: 'awayMatches',
  }),
  likes: many(matchLikes),
}));

export const matchLikesRelations = relations(matchLikes, ({ one }) => ({
  match: one(matches, {
    fields: [matchLikes.matchId],
    references: [matches.id],
  }),
  user: one(users, {
    fields: [matchLikes.userId],
    references: [users.id],
  }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  faculty: one(faculties, {
    fields: [players.facultyId],
    references: [faculties.id],
  }),
}));

export const adminActivityLogRelations = relations(adminActivityLog, ({ one }) => ({
  user: one(users, {
    fields: [adminActivityLog.userId],
    references: [users.id],
  }),
}));