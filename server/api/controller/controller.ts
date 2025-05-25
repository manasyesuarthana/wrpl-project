import { Service } from '../service/service.js';
import { DbType } from "../repository/repository.js";
import { Request, Response } from "express";
import { z } from "zod";
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user_id?: string; // The ? makes it optional
  }
}

// Define Zod schemas for validation
const sessionSchema = z.object({
  user_id: z.string().nonempty("user_id is required"),
});

const postSubmitJobSchema = z.object({
  companyName: z.string().nonempty(),
  appliedPosition: z.string().nonempty(),
  companyAddress: z.string().optional(),
  dateApplied: z.string().nonempty(),
  country: z.number(),
  companyWebsite: z.string().optional(),
  status: z.number(),
  additional_notes: z.string().optional(),
});

const postSubmitContactSchema = z.object({
  roleInCompany: z.string().nonempty(),
  phoneNumber: z.string().nonempty(),
  contactEmail: z.string().email(),
  linkedinProfile: z.string().optional(),
});

const postLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

const postRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
  passwordConfirmation: z.string().nonempty(),
});

const deleteContactSchema = z.object({
  contactEmail: z.string().email(),
});

const deleteJobSchema = z.object({
  companyName: z.string().nonempty(),
  appliedPosition: z.string().nonempty(),
  dateApplied: z.string().nonempty(),
});

export class Controller {
  service;
  constructor(db: DbType) {
    this.service = new Service(db);
  }

  postSubmitJob = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session
      postSubmitJobSchema.parse(req.body); // Validate request body

      const serviceResponse = await this.service.postSubmitJob(
        req.session.user_id!,
        req.body.companyName,
        req.body.appliedPosition,
        req.body.companyAddress,
        req.body.dateApplied,
        req.body.country,
        req.body.companyWebsite,
        req.body.status,
        req.body.additional_notes
      );

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  postSubmitContact = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session
      postSubmitContactSchema.parse(req.body); // Validate request body

      const serviceResponse = await this.service.postSubmitContact(
        req.session.user_id!,
        req.body.roleInCompany,
        req.body.phoneNumber,
        req.body.contactEmail,
        req.body.linkedinProfile
      );

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  postLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
      postLoginSchema.parse(req.body); // Validate request body

      const serviceResponse = await this.service.postLogin(req.body.email, req.body.password, req);

      if (serviceResponse.data && !serviceResponse.isError) {
        req.session.user_id = serviceResponse.data.user_id;
      }

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  postRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
      postRegisterSchema.parse(req.body); // Validate request body

      const serviceResponse = await this.service.postRegister(
        req.body.email,
        req.body.password,
        req.body.passwordConfirmation
      );

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  deleteLogout = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to log out' });
        }
        console.log('User logged out successfully');
        return res.status(200).json({ message: 'User logged out successfully' });
      });

      return res.status(200).json({ message: 'User logged out successfully (warning: unexpected path)' });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  deleteContact = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session
      deleteContactSchema.parse(req.body); // Validate request body

      const serviceResponse = await this.service.deleteContact(
        req.session.user_id!,
        req.body.contactEmail
      );

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  deleteJob = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session
      deleteJobSchema.parse(req.body); // Validate request body

      const serviceResponse = await this.service.deleteJob(
        req.session.user_id!,
        req.body.companyName,
        req.body.appliedPosition,
        req.body.dateApplied
      );

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  getJobs = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session

      const serviceResponse = await this.service.getJobs(req.session.user_id!);

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message, data: serviceResponse.data });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };

  getContacts = async (req: Request, res: Response): Promise<Response> => {
    try {
      sessionSchema.parse(req.session); // Validate session

      const serviceResponse = await this.service.getContacts(req.session.user_id!);

      console.log(serviceResponse.message);
      return res.status(serviceResponse.status).json({ message: serviceResponse.message, data: serviceResponse.data });
    } catch (error:any) {
      return res.status(400).json({ message: error instanceof z.ZodError ? error.errors : error.message });
    }
  };
}