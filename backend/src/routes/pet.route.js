import express from 'express';
import * as petController from '../controllers/pet.controller.js';

const route = express.Router();

route.post('/', petController.createNewPet);
route.get('/', petController.getPets);
route.get('/:id', petController.getPetDetail);
route.delete('/:id', petController.deletePet);
route.patch('/', petController.updatePet);
route.get('/exams/:id', petController.getPetExamHistory);
route.get('/vaccinations/:id', petController.getPetVaccinationHistory);
export default route;