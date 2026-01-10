import * as staffService from '../services/staff.service.js';

export const getAllStaff = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const branchId = req.query.branchId || null; 

        const offset = (page - 1) * limit;

        const result = await staffService.getAllStaff(req.db, page, limit, offset, branchId);

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách nhân viên thành công',
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit)
            },
            filter: {
                branchId: branchId || 'All'
            }
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to get staff list',
            details: error.message
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const staffId = req.user?.id;

        if (!staffId) {
            return res.status(401).json({ error: 'Unauthorized. User ID not found.' });
        }

        const staff = await staffService.getCurrentStaff(req.db, staffId);

        if (!staff) {
            return res.status(404).json({ error: 'Staff profile not found.' });
        }

        res.status(200).json({
            success: true,
            data: staff
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to get profile',
            details: error.message
        });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const staffId = req.user?.id;
        const updateData = req.body;

        if (!staffId) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No data provided to update.' });
        }

        const updatedStaff = await staffService.updateCurrentStaff(req.db, staffId, updateData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedStaff
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to update profile',
            details: error.message
        });
    }
};

export default {
    getAllStaff,
    getMyProfile,
    updateMyProfile
};