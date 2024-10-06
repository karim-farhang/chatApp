import {Router} from 'express';
import {verifyToken} from '../middlewares/AuthMiddleware.js';
import {searchContact, getContactsForDMlist, getAllContacts} from '../controllers/ContactsController.js';

const contactRoutes = Router();

contactRoutes.post('/search', verifyToken, searchContact);
contactRoutes.post('/get-contacts-for-dm', verifyToken, getContactsForDMlist);
contactRoutes.post('/get-all-contact', verifyToken, getAllContacts);


export default contactRoutes;
