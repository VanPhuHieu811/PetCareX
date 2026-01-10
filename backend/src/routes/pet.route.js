import express from 'express';
import * as petController from '../controllers/pet.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';

const route = express.Router();

route.get('/types', petController.getPetTypes)
route.get('/breeds', petController.getPetBreeds);

route.get('/exams/:id', authenticate, petController.getPetExamHistory);
route.get('/vaccinations/:id', authenticate, petController.getPetVaccinationHistory);

route.get('/:id', authenticate, petController.getPetDetail);

route.post('/', authenticate, petController.createNewPet);
route.get('/', authenticate, petController.getPets);
route.delete('/:id', authenticate, petController.deletePet);
route.patch('/', authenticate, petController.updatePet);

export default route;