import { z } from "zod";

export const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
export type HttpMethod = (typeof httpMethods)[number];

export const mockEndpointSchema = z.object({
  id: z.string(),
  method: z.enum(httpMethods),
  path: z.string().min(1).startsWith("/"),
  validationSchema: z.string(),
  response: z.string(),
  statusCode: z.number().int().min(100).max(599),
});

export const insertMockEndpointSchema = mockEndpointSchema.omit({ id: true });

export type MockEndpoint = z.infer<typeof mockEndpointSchema>;
export type InsertMockEndpoint = z.infer<typeof insertMockEndpointSchema>;

// Keep User types for compatibility
export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
