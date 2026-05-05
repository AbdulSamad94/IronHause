import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Stores gym owners / prospects who interact with the IronHause AI agent.
 */
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  message: text('message'),
  source: varchar('source', { length: 100 }).default('ai_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Stores intro session booking requests captured by the AI agent.
 */
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  leadId: serial('lead_id').references(() => leads.id),
  preferredDate: varchar('preferred_date', { length: 100 }),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types inferred from schema
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
