import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().unique(),
  apiKey: text("api_key").notNull(),
  knowledgeBaseUrl: text("knowledge_base_url").notNull(),
  userAddress: text("user_address").notNull(),
  collectionId: text("collection_id").notNull(),
  nftId: text("nft_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertServerSchema = createInsertSchema(servers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const serverRegistrationSchema = z.object({
  serverId: z.string().min(1, "Server ID is required"),
  userAddress: z.string().min(1, "User address is required"),
  signature: z.string().min(1, "Signature is required"),
  message: z.string().min(1, "Message is required"),
  collectionId: z.string().min(1, "Collection ID is required"),
  nftId: z.string().min(1, "NFT ID is required"),
});

export const serverUpdateSchema = z.object({
  userAddress: z.string().min(1, "User address is required"),
  signature: z.string().min(1, "Signature is required"),
  message: z.string().min(1, "Message is required"),
  collectionId: z.string().min(1, "Collection ID is required"),
  nftId: z.string().min(1, "NFT ID is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;
export type Server = typeof servers.$inferSelect;
export type ServerRegistration = z.infer<typeof serverRegistrationSchema>;
export type ServerUpdate = z.infer<typeof serverUpdateSchema>;
