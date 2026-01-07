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

export default { getAllBranches };