import * as branchService from '../services/branch.service.js';

export const getAllBranches = async (req, res) => {
  try {
    const result = await branchService.getAllBranches(req.db);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to retrieve branches', details: err.message });
  }
};

export const getBranchRevenue = async (req, res) => {
  try {
    const branchID = req.query.id;
    const result = await branchService.getBranchRevenue(req.db, branchID);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to retrieve branch revenue', details: err.message });
  }
};

export const getBranchServiceUsage = async (req, res) => {
  try {
    const branchID = req.query.id;
    const result = await branchService.getBranchServiceUsage(req.db, branchID);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to retrieve branch revenue', details: err.message });
  }
};

export const getDateStatistics = async (req, res) => {
	try {
		const branchID = req.query.id;
		const year  = Number(req.query.year  ?? 0) || 0;
		const month = Number(req.query.month ?? 0) || 0;
		const day   = Number(req.query.day   ?? 0) || 0;
		const result = await branchService.getDateStatistics(req.db, branchID, year, month, day);
		res.status(200).json(result);
	}
	catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to retrieve date statistics', details: err.message });
	}
};

export const getStaffBranch = async (req, res) => {
	try {
		const userId = req.user?.id;
		const result = await branchService.getStaffBranch(req.db, userId);
		res.status(200).json(result);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to retrieve staff branch', details: err.message });
	}
};

export const getBranchCustomerList = async (req, res) => {
	try {
		const branchID = req.query.branchID;
		const limit = parseInt(req.query.limit) || 20;
		const offset = parseInt(req.query.offset) || 0;
		const result = await branchService.getBranchCustomerList(req.db, branchID, limit, offset);
		res.status(200).json(result);
	}
	catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to retrieve branch customer list', details: err.message });
	}
};

export const countAllCustomersInBranch = async (req, res) => {
	try {
		const branchID = req.query.branchID;
		const result = await branchService.countAllCustomersInBranch(req.db, branchID);
		res.status(200).json({ count: result });
	}
	catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to count customers in branch', details: err.message });
	}
};

export const countVIPCustomersInBranch = async (req, res) => {
	try {
		const branchID = req.query.branchID;
		const result = await branchService.countVIPCustomersInBranch(req.db, branchID);
		res.status(200).json({ count: result });
	}
	catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to count VIP customers in branch', details: err.message });
	}
};

export default { 
	getAllBranches, 
	getBranchRevenue,
	getBranchServiceUsage,
	getDateStatistics,
	getStaffBranch,
	getBranchCustomerList,
	countAllCustomersInBranch,
	countVIPCustomersInBranch
};