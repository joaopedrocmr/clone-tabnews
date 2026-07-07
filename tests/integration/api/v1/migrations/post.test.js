import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migration should return 200 and json with migration information", async () => {
  const res = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(res.status).toBe(201);

  const responseBody1 = await res.json();

  expect(Array.isArray(responseBody1)).toBe(true);
  expect(responseBody1.length).toBeGreaterThan(0);
});

test("POST to /api/v1/migration should return []", async () => {
  const res = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(res.status).toBe(200);

  const responseBody2 = await res.json();

  expect(responseBody2.length).toBe(0);
});
