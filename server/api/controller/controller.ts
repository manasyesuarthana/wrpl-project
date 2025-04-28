import { Service } from '../service/service.js';
import { DbType } from "../repository/repository.js";
import { Request, Response } from "express";
import 'express-session';
declare module 'express-session' {
  interface SessionData {
    user_id?: string;  // The ? makes it optional
  }
}

export class Controller {
  service;
  constructor(db: DbType) {
    this.service = new Service(db);
  }

  postSubmitJob = async (req: Request, res: Response): Promise<Response> => {
    if(req.session.user_id == null){
      return res.status(400).json({message:'user_id is empty'})
    }
    let serviceResponse = await this.service.postSubmitJob(
      req.session.user_id,
      req.body['companyName'],
      req.body['appliedPosition'],
      req.body['companyAddress'],
      req.body['dateApplied'],
      req.body['country'],
      req.body['companyWebsite'],
      req.body['status'],
      req.body['additional_notes']
    );
    console.log(serviceResponse['message']);
    return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });

  }
  postSubmitContact = async (req: Request, res: Response): Promise<Response> => {
    if(req.session.user_id == null){
      return res.status(400).json({message:'user_id is empty'})
    }
    let serviceResponse = await this.service.postSubmitContact(
      req.session.user_id,
      req.body['roleInCompany'],
      req.body['phoneNumber'],
      req.body['contactEmail'],
      req.body['linkedinProfile']
    );
    console.log(serviceResponse['message']);
    return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
  }

  postLogin = async (req: Request, res: Response): Promise<Response> => {

    let serviceResponse = await this.service.postLogin(req.body['email'], req.body['password'], req);
    if (serviceResponse['data'] != null && serviceResponse['isError'] == null) {
      req.session.user_id = serviceResponse['data']['user_id'];
    }
    console.log(serviceResponse['message']);
    return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
  }


  postRegister = async (req: Request, res: Response): Promise<Response> => {
    let serviceResponse = await this.service.postRegister(
      req.body['email'],
      req.body['password'],
      req.body['passwordConfirmation']
    )
    console.log(serviceResponse['message']);
    return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
  }
};