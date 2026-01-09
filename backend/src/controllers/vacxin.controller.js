import * as vacxinService from '../services/vacxin.service.js';

export const getAllVacxins = async (req, res) => {
	try {
		const result = await vacxinService.getAllVaccines(req.db);
		res.status(200).json(result);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to retrieve vaccines', details: err.message });
	}
};

export const addVaccine = async (req, res) => {
	try {
		const vaccine = req.body;
		await vacxinService.addVaccine(req.db, vaccine);
		res.status(201).json({ message: 'Vaccine added successfully' });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to add vaccine', details: err.message });
	}
};

export const getVacxinsByBranch = async (req, res) => {
	try {
		const branchID = req.query.id;
		const result = await vacxinService.getVaccineByBranch(req.db, branchID);
		res.status(200).json(result);
	}
	catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to retrieve vaccines by branch', details: err.message });
	}
};

export const addVacxinToBranch = async (req, res) => {
	try {
		const { branchId, vacxinId, tonKho } = req.body;
		await vacxinService.addVaccineToBranch(req.db, branchId, vacxinId, tonKho);
		res.status(201).json({ message: 'Vaccine added to branch successfully' });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to add vaccine to branch', details: err.message });
	}
};

export const deleteVacxinByBranch = async (req, res) => {
	try {
		const branchID = req.query.branchId;
		const vacxinID = req.query.vacxinId;
		await vacxinService.deleteVaccxinByBranch(req.db, branchID, vacxinID);
		res.status(200).json({ message: 'Vaccine deleted from branch successfully' });
	}
	catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to delete vaccine from branch', details: err.message });
	}
};

export default {
	getAllVacxins,
	addVaccine,
	getVacxinsByBranch,
	addVacxinToBranch,
	deleteVacxinByBranch
};