// src/controllers/AuthController.ts
import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      console.log("[AuthController] Intento de login:", req.body.email);

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json(result);

    } catch (error: any) {
      console.error("[AuthController] Error en login:", error.message);
      res.status(400).json({ message: error.message }); // <--- IMPORTANTE
    }
  }
}
