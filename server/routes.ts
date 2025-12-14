import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMockEndpointSchema, httpMethods } from "@shared/schema";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ============================================
  // Configuration API - Manage mock endpoints
  // ============================================

  // Get all endpoints
  app.get("/api/endpoints", async (_req: Request, res: Response) => {
    const endpoints = await storage.getAllEndpoints();
    res.json(endpoints);
  });

  // Get single endpoint
  app.get("/api/endpoints/:id", async (req: Request, res: Response) => {
    const endpoint = await storage.getEndpoint(req.params.id);
    if (!endpoint) {
      return res.status(404).json({ error: "Endpoint not found" });
    }
    res.json(endpoint);
  });

  // Create endpoint
  app.post("/api/endpoints", async (req: Request, res: Response) => {
    const result = insertMockEndpointSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const endpoint = await storage.createEndpoint(result.data);
    res.status(201).json(endpoint);
  });

  // Update endpoint
  app.put("/api/endpoints/:id", async (req: Request, res: Response) => {
    const result = insertMockEndpointSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const endpoint = await storage.updateEndpoint(req.params.id, result.data);
    if (!endpoint) {
      return res.status(404).json({ error: "Endpoint not found" });
    }
    res.json(endpoint);
  });

  // Delete endpoint
  app.delete("/api/endpoints/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteEndpoint(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Endpoint not found" });
    }
    res.status(204).send();
  });

  // ============================================
  // Mock Server - Serve configured endpoints
  // ============================================

  // Handle all /mock/* requests dynamically
  app.all("/mock/*", async (req: Request, res: Response) => {
    const mockPath = req.path.replace("/mock", "");
    const method = req.method as (typeof httpMethods)[number];

    // Find matching endpoint
    const endpoint = await storage.getEndpointByMethodAndPath(method, mockPath);

    if (!endpoint) {
      return res.status(404).json({
        error: "Mock endpoint not found",
        path: mockPath,
        method: method,
        message: "Configure this endpoint in the MockAPI dashboard",
      });
    }

    // Validate request body if present and schema exists
    if (req.body && Object.keys(req.body).length > 0) {
      try {
        const schema = JSON.parse(endpoint.validationSchema);
        
        // Apply "all that is not limited - allowed" approach
        // by ensuring additionalProperties defaults to true
        if (schema.type === "object" && schema.additionalProperties === undefined) {
          schema.additionalProperties = true;
        }

        const validate = ajv.compile(schema);
        const valid = validate(req.body);

        if (!valid) {
          return res.status(400).json({
            error: "Validation failed",
            details: validate.errors,
          });
        }
      } catch (e) {
        // If schema is empty or invalid, allow all (permissive approach)
        // This implements "all that is not limited - allowed"
      }
    }

    // Return configured response
    try {
      const responseBody = JSON.parse(endpoint.response);
      res.status(endpoint.statusCode).json(responseBody);
    } catch {
      // If response is not valid JSON, return as text
      res.status(endpoint.statusCode).send(endpoint.response);
    }
  });

  return httpServer;
}
