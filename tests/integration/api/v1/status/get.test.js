import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const res = await fetch("http://localhost:3000/api/v1/status");
      expect(res.status).toBe(200);

      const resbody = await res.json();

      const parsedUpdatedAt = new Date(resbody.updated_at).toISOString();
      expect(resbody.updated_at).toEqual(parsedUpdatedAt);

      expect(resbody.dependencies.database.version).toBeDefined();
      expect(resbody.dependencies.database.version).toEqual("16.0");

      expect(resbody.dependencies.database.max_connections).toBeDefined();
      expect(resbody.dependencies.database.max_connections).toEqual(100);

      expect(resbody.dependencies.database.open_connections).toEqual(1);
    });
  });
});
