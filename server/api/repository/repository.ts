import { NeonQueryFunction } from "@neondatabase/serverless";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {usersTable, jobsTable, countryIdsTable, recruiterContactsTable, applicationStatusEnum} from '../../db/schema.js'
import { NeonDbError } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";

export type DbType = NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
}
export class Repository{
    db:DbType;
    constructor(db:DbType){
        this.db=db;
    }
    async postSubmitJob(
        user_id: string,
        company_name: string,
        applied_position: string,
        company_address: string|null,
        date_applied: string,
        country_id: number,
        company_website: string|null,
        status_id: number,
        additional_notes: string|null
    ):Promise<void>{
        try{
        await this.db
            .insert(jobsTable)
            .values({
                user_id:user_id,
                company_name:company_name,
                applied_position: applied_position,
                company_address: company_address,
                date_applied: date_applied,
                country_id: country_id,
                company_website: company_website,
                status_id: applicationStatusEnum.enumValues[status_id],
                additional_notes: additional_notes
            })
        } catch(error){
            console.log(error);
            throw new Error("An error occured during database call.");
        }
        return;
    }
    async postSubmitContact(
        user_id:string,
        role_in_company: string,
        phone_number: string,
        contact_email: string,
        linkedin_profile:string | null,
    ):Promise<void>{
        try{
            await this.db
            .insert(recruiterContactsTable)
            .values({
                user_id:user_id,
                role_in_company:role_in_company,
                phone_number:phone_number,
                contact_email:contact_email,
                linkedin_profile:linkedin_profile 
            })
        }catch(error){
            console.log(error);
            throw new Error('An error occured during database call.')
        }
    }
    async postLogin(
        email:string, 
    ):Promise<Array<{'user_id':string, 'password_hash':string}>>{
        try{
        var queryResult = await this.db
            .select({user_id:usersTable.user_id, password_hash: usersTable.password_hash})
            .from(usersTable)
            .where(
                and(
                    eq(usersTable.email, email),
                )
            )
        } catch (error){
            throw new Error("An errror occured during the database call.");
        }
        try{
            var user_id = queryResult[0]['user_id']; 
        }
        catch(error){
            throw new Error("Account with such credential is not found.");
        }
        return queryResult;
    }
    async postRegister(
        email:string, 
        password_hash:string):Promise<void>{
        try{
            await this.db
            .insert(usersTable)
            .values({
                email:email,
                password_hash:password_hash
            })
        }

        catch(error){
            if(error instanceof NeonDbError){
                if(error.code == '23505'){
                    throw new Error("User with that email already exists.");
                }
            }
            throw new Error('An error occured during the database call.');
        };
        return ;
    }

};