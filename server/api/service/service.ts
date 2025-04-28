import { date } from 'drizzle-orm/mysql-core/index.js';
import {DbType, Repository} from '../repository/repository.js'
import bcrypt from 'bcrypt';
import { Request } from 'express';

export interface ServiceResponse<T = any> {
    message:
    | "success"
    | "Job submitted successfully"
    | "Contact submitted successfully"
    | "Login successful"
    | "Account registered successfully"
    | "error"
    | "Error submitting job"
    | "Error submitting contact"
    | "Error during login"
    | "Error during registration attempt"
    | "Empty credentials"
    | "Account with the following email already exists."
    | "Incorrect credentials"
    | string;
    status: number;
    isError: boolean;
    data?: T | null;
}

export interface UserDetails {
    user_id: string;
    // Add other relevant user details here if needed for the login response
}

export class Service{
    repository;
    constructor(db:DbType){
        this.repository = new Repository(db);
    }

    postSubmitJob = async (
        user_id: string,
        company_name: string,
        applied_position: string,
        company_address: string|null,
        date_applied: string,
        country_id: number,
        company_website: string|null,
        status_id: number,
        additional_notes: string|null,
    ):Promise<ServiceResponse<null>> => {
        if(!company_address){
            company_address = null;
        }
        if(!company_website){
            company_website = null;
        }
        if(!additional_notes){
            additional_notes = null;
        }
        try{
            await this.repository.postSubmitJob(
                user_id,
                company_name,
                applied_position,
                company_address,
                date_applied,
                country_id,
                company_website,
                status_id,
                additional_notes
            );
            return {message:'Job submitted successfully', status:201, isError:false, data: null}
        } catch(error: any){
            return {message: error.message || 'Error submitting job', status:500, isError:true, data: null}
        }
    }

    postSubmitContact = async (
        user_id:string,
        role_in_company: string,
        phone_number: string,
        contact_email: string,
        linkedin_profile:string|null,
    ):Promise<ServiceResponse<null>> =>{
       if(!linkedin_profile){
        linkedin_profile = null;
       }
       try{
           await this.repository.postSubmitContact(
            user_id,
            role_in_company,
            phone_number,
            contact_email,
            linkedin_profile);
           return {message:'Contact submitted successfully', status:201, isError:false, data: null};
       } catch(error: any){
            return {message: error.message || 'Error submitting contact', status:500, isError:true, data: null};
       }
    }

    postLogin = async (
        email:string,
        password:string,
        req:any
    ):Promise<ServiceResponse<UserDetails>> => {
        if(!email || !password){
            return {message:'Empty credentials', status:400, isError:true, data: null};
        }
        try{
            const existingAccount = await this.repository.postLogin(email);
        } catch(error: any){
            return {message: error.message || 'Error during login', status:500, isError:true, data: null};
        }
        try{
        const queryResult : Array<{
            "user_id": string
            ;"password_hash": string;}
            > = await this.repository.postLogin(email);
            if(queryResult.length > 0 && await bcrypt.compare(password, queryResult[0]['password_hash'])){
                req.session.user_id = queryResult[0]['user_id'];
                const userDetails: UserDetails = { user_id: queryResult[0]['user_id'] };
                return {message:'Login successful', status:200, isError:false, data: userDetails};
            } else {
                return {message:'Incorrect credentials', status:401, isError:true, data: null};
            }
        } catch (error: any){
            return {message: error.message || 'Error during login', status:500, isError:true, data: null};
        }
    }

    postRegister = async (
        email:string,
        password:string,
        password_confirmation:string,
    ):Promise<ServiceResponse<null>> => {
        let _this = this;
        if(!password || !email){
            return {message:'Empty credentials', status:400, isError:true, data: null};
        }
        try {
            const salt = await bcrypt.genSalt(3);
            bcrypt.hash(password, salt, async function(err, password_hash) {
                if (err) {
                    console.error("Error hashing password:", err);
                    return {message:'Error during hashing', status:500, isError:true, data: null};
                }
                try {
                    await _this.repository.postRegister(email, password_hash);
                    return {message:'Account registered successfully', status:201, isError:false, data: null};
                } catch (error: any) {
                    console.error("Error saving user:", error);
                    return {message: error.message || 'Error during registration attempt', status:500, isError:true, data: null};
                }
            });
        } catch (error: any) {
            return {message: error.message || 'Error during registration attempt', status:500, isError:true, data: null};
        }
        return {message: 'Error during registration attempt', status:500,isError:true}
    }
};