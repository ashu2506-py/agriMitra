import { Request, Response, NextFunction } from 'express';
import {
  CreateListingSchema,
  FilterListingSchema,
} from '../validators/listing.validator.js';
import { ListingService } from '../services/listing.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class ListingController {
  /**
   * Create a new crop listing.
   */
  static async createListing(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return sendError(
          res,
          'Unauthenticated',
          'UNAUTHORIZED',
          401
        );
      }

      const input = CreateListingSchema.parse(req.body);

      const listing = await ListingService.createListing(
        req.user.userId,
        input
      );

      return sendSuccess(
        res,
        { listing },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all marketplace listings.
   */
  static async getListings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filter = FilterListingSchema.parse(req.query);

      const result = await ListingService.getListings(filter);

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get listings belonging to the authenticated farmer.
   */
  static async getMyListings(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return sendError(
          res,
          'Unauthenticated',
          'UNAUTHORIZED',
          401
        );
      }

      const listings = await ListingService.getMyListings(
        req.user.userId
      );

      return sendSuccess(
        res,
        { listings }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get one listing by ID.
   */
  static async getListingById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const listing = await ListingService.getListingById(
        req.params.id
      );

      return sendSuccess(
        res,
        { listing }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update listing status.
   */
  static async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return sendError(
          res,
          'Unauthenticated',
          'UNAUTHORIZED',
          401
        );
      }

      const { status } = req.body;

      const updated = await ListingService.updateListingStatus(
        req.user.userId,
        req.params.id,
        status
      );

      return sendSuccess(
        res,
        { listing: updated }
      );
    } catch (error) {
      next(error);
    }
  }
}