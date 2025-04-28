var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Service } from '../service/service.js';
import 'express-session';
export class Controller {
    constructor(db) {
        this.postSubmitJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user_id == null) {
                return res.status(400).json({ message: 'user_id is empty' });
            }
            let serviceResponse = yield this.service.postSubmitJob(req.session.user_id, req.body['companyName'], req.body['appliedPosition'], req.body['companyAddress'], req.body['dateApplied'], req.body['country'], req.body['companyWebsite'], req.body['status'], req.body['additional_notes']);
            console.log(serviceResponse['message']);
            return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
        });
        this.postSubmitContact = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user_id == null) {
                return res.status(400).json({ message: 'user_id is empty' });
            }
            let serviceResponse = yield this.service.postSubmitContact(req.session.user_id, req.body['roleInCompany'], req.body['phoneNumber'], req.body['contactEmail'], req.body['linkedinProfile']);
            console.log(serviceResponse['message']);
            return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
        });
        this.postLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let serviceResponse = yield this.service.postLogin(req.body['email'], req.body['password'], req);
            if (serviceResponse['data'] != null && serviceResponse['isError'] == null) {
                req.session.user_id = serviceResponse['data']['user_id'];
            }
            console.log(serviceResponse['message']);
            return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
        });
        this.postRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let serviceResponse = yield this.service.postRegister(req.body['email'], req.body['password'], req.body['passwordConfirmation']);
            console.log(serviceResponse['message']);
            return res.status(serviceResponse['status']).json({ message: serviceResponse['message'] });
        });
        this.service = new Service(db);
    }
}
;
