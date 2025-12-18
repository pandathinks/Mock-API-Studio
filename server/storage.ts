import { type MockEndpoint, type InsertMockEndpoint } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { join, dirname } from "path";

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

export class PersistentStorage extends MemStorage {
  private filePath: string;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor(filePath: string = join(process.cwd(), "data", "endpoints.json")) {
    super();
    this.filePath = filePath;
  }

  async initialize(): Promise<void> {
    await this.loadFromFile();
  }

  private async loadFromFile(): Promise<void> {
    try {
      await fs.mkdir(dirname(this.filePath), { recursive: true });
      const data = await fs.readFile(this.filePath, "utf-8");
      const endpoints: MockEndpoint[] = JSON.parse(data);

      for (const endpoint of endpoints) {
        (this as any).endpoints.set(endpoint.id, endpoint);
      }

      console.log(`Loaded ${endpoints.length} endpoints from ${this.filePath}`);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        console.log("No existing endpoints file found, starting fresh");
      } else {
        console.error("Error loading endpoints:", error);
      }
    }
  }

  private async saveToFile(): Promise<void> {
    try {
      await fs.mkdir(dirname(this.filePath), { recursive: true });
      const endpoints = await this.getAllEndpoints();
      await fs.writeFile(this.filePath, JSON.stringify(endpoints, null, 2), "utf-8");
      console.log(`Saved ${endpoints.length} endpoints to ${this.filePath}`);
    } catch (error) {
      console.error("Error saving endpoints:", error);
    }
  }

  private scheduleSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveToFile();
      this.saveTimeout = null;
    }, 100);
  }

  async createEndpoint(insertEndpoint: InsertMockEndpoint): Promise<MockEndpoint> {
    const endpoint = await super.createEndpoint(insertEndpoint);
    this.scheduleSave();
    return endpoint;
  }

  async updateEndpoint(id: string, insertEndpoint: InsertMockEndpoint): Promise<MockEndpoint | undefined> {
    const endpoint = await super.updateEndpoint(id, insertEndpoint);
    if (endpoint) {
      this.scheduleSave();
    }
    return endpoint;
  }

  async deleteEndpoint(id: string): Promise<boolean> {
    const result = await super.deleteEndpoint(id);
    if (result) {
      this.scheduleSave();
    }
    return result;
  }
}

export const storage = new PersistentStorage();
