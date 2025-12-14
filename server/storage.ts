import { type MockEndpoint, type InsertMockEndpoint } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllEndpoints(): Promise<MockEndpoint[]>;
  getEndpoint(id: string): Promise<MockEndpoint | undefined>;
  getEndpointByMethodAndPath(method: string, path: string): Promise<MockEndpoint | undefined>;
  createEndpoint(endpoint: InsertMockEndpoint): Promise<MockEndpoint>;
  updateEndpoint(id: string, endpoint: InsertMockEndpoint): Promise<MockEndpoint | undefined>;
  deleteEndpoint(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private endpoints: Map<string, MockEndpoint>;

  constructor() {
    this.endpoints = new Map();
  }

  async getAllEndpoints(): Promise<MockEndpoint[]> {
    return Array.from(this.endpoints.values());
  }

  async getEndpoint(id: string): Promise<MockEndpoint | undefined> {
    return this.endpoints.get(id);
  }

  async getEndpointByMethodAndPath(method: string, path: string): Promise<MockEndpoint | undefined> {
    return Array.from(this.endpoints.values()).find(
      (ep) => ep.method === method && this.matchPath(ep.path, path)
    );
  }

  private escapeRegex(str: string): string {
    // Escape regex metacharacters for literal matching
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private matchPath(pattern: string, actual: string): boolean {
    // Convert route pattern like /api/users/:id to regex
    const regexPattern = pattern
      .split("/")
      .map((segment) => {
        if (segment.startsWith(":")) {
          return "[^/]+";
        }
        // Escape regex metacharacters in literal segments
        return this.escapeRegex(segment);
      })
      .join("\\/");
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(actual);
  }

  async createEndpoint(insertEndpoint: InsertMockEndpoint): Promise<MockEndpoint> {
    const id = randomUUID();
    const endpoint: MockEndpoint = { ...insertEndpoint, id };
    this.endpoints.set(id, endpoint);
    return endpoint;
  }

  async updateEndpoint(id: string, insertEndpoint: InsertMockEndpoint): Promise<MockEndpoint | undefined> {
    if (!this.endpoints.has(id)) {
      return undefined;
    }
    const endpoint: MockEndpoint = { ...insertEndpoint, id };
    this.endpoints.set(id, endpoint);
    return endpoint;
  }

  async deleteEndpoint(id: string): Promise<boolean> {
    return this.endpoints.delete(id);
  }
}

export const storage = new MemStorage();
