import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const res1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmocase@curso.dev",
          password: "senha123",
        }),
      });

      expect(res1.status).toBe(201);

      const res2 = await fetch("http://localhost:3000/api/v1/users/MesmoCase");

      expect(res2.status).toBe(200);

      const responseBody = await res2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "MesmoCase",
        email: "mesmocase@curso.dev",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With exact case mismatch", async () => {
      const res1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "case.diferente@curso.dev",
          password: "senha123",
        }),
      });

      expect(res1.status).toBe(201);

      const res2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(res2.status).toBe(200);

      const responseBody = await res2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseDiferente",
        email: "case.diferente@curso.dev",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With non-existent username", async () => {
      const res = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(res.status).toBe(404);

      const responseBody = await res.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found",
        action: "Please check the username and try again",
        statusCode: 404,
      });
    });
  });
});
