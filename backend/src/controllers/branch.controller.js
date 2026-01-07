import BranchService from '../services/branch.service.js';

const BranchController = {
	async getAllBranches(req, res) {
		try {
			const result = await BranchService.getAllBranches(req.db);
			res.status(200).json(result);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to retrieve branches', details: err.message });
		}
	}
}
export default BranchController;