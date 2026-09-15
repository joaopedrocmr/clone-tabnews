import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const res = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "filipedechamps",
          email: "contato@curso.dev",
          password: "senha123",
        }),
      });

      expect(res.status).toBe(201);

      const responseBody = await res.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "filipedechamps",
        email: "contato@curso.dev",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("filipedechamps");
      const corectPasswordMatch = await password.compare(
        "senha123",
        userInDatabase.password,
      );

      const IncorectPasswordMatch = await password.compare(
        "1234",
        userInDatabase.password,
      );

      expect(corectPasswordMatch).toBe(true);
      expect(IncorectPasswordMatch).toBe(false);
    });

    test("duplicate 'email'", async () => {
      const res1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@curso.dev",
          password: "senha123",
        }),
      });

      expect(res1.status).toBe(201);

      const res2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@curso.dev",
          password: "senha123",
        }),
      });

      expect(res2.status).toBe(400);

      expect(await res2.json()).toEqual({
        name: "ValidationError",
        message: "Email already exists",
        action: "Please use a different email address",
        status: 400,
      });
    });
    test("duplicate 'username'", async () => {
      const res1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userduplicado",
          email: "curso2@curso.dev",
          password: "senha123",
        }),
      });

      expect(res1.status).toBe(201);

      const res2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "UserDuplicado",
          email: "cursodev@curso.dev",
          password: "senha123",
        }),
      });

      expect(res2.status).toBe(400);

      expect(await res2.json()).toEqual({
        name: "ValidationError",
        message: "Username already exists",
        action: "Please use a different username",
        status: 400,
      });
    });
  });
});
