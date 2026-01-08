import BranchModel from "../models/branch.model.js";

const BranchService = {
	async getAllBranches(db) {
		try {
			const branches = await BranchModel.getAllBranches(db);
			return branches;
		}
		catch (err) {
			throw new Error(`Service error: ${err.message}`);
		}
	},
};
export default BranchService;