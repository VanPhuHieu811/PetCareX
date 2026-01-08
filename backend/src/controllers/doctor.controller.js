import * as doctorService from '../services/doctor.service.js';

export const getDoctorStatistics = async (req, res) => {
  try {
		const result = await doctorService.getDoctorStatistics(req.db, req.query.id);
		res.status(200).json(result);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to retrieve doctor statistics', details: err.message });
	}
};
export default {
	getDoctorStatistics,
};