import { Request, Response, NextFunction } from 'express';
import { AIService, ChatMessage } from '../services/ai.service.js';

export class AIController {
  static async chat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { message, history } = req.body as {
        message?: string;
        history?: ChatMessage[];
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Message is required',
        });
      }

      const safeHistory = Array.isArray(history)
        ? history
            .filter(
              (item) =>
                item &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string'
            )
            .slice(-20)
        : [];

      const reply = await AIService.chat(
        message.trim(),
        safeHistory
      );

      return res.status(200).json({
        success: true,
        data: {
          reply,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}