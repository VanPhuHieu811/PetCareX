import * as petService from '../services/pet.service.js';

export const getPets = async (req, res) => {
    try {
        const userId = req.body.userId;

        if(!userId) {
            return res.status(400).json({ message: 'getPets. User ID is required' });
        }

        const results = await petService.getAllPetsByUserId(req.db, userId);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Fail to retrieve pets', detail: error.message });
    }
};

export const getPetDetail = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'getPetDetail. Pet ID is required'});
        }

        const pet = await petService.getPetById(req.db, id);

        if(!pet) {
            return res.status(404).json({error: 'getPetDetail. Pet not found'});
        } 
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error: 'Fail to retrieve pet detail', detail: error.message });
    }
};

export const createNewPet = async (req, res) => {
    try {
        console.log("Dữ liệu nhận được:", req.body);
        const { TenTC, MaGiong, NgaySinh, TinhTrangSucKhoe, GioiTinh, MaKH } = req.body;

        if (!TenTC || !MaGiong || !NgaySinh || !GioiTinh || !MaKH) {
            return res.status(400).json({ error: 'Missing required pet data' });
        }
        const newPet = await petService.createPet(req.db, {TenTC, MaGiong, NgaySinh, TinhTrangSucKhoe, GioiTinh, MaKH});

        res.status(201).json({
            success: true,
            message: 'Pet created successfully',
            data: newPet
        });
    } catch (error) {
        throw new Error('Error creating pet: ' + error.message);
    }
};

export const deletePet = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'deletePet. Pet ID is required'});
        }

        const deletedCount = await petService.deletePet(req.db, id);

        if (deletedCount === 0) {
            return res.status(404).json({error: 'deletePet. Pet not found'});
        }

        res.status(200).json({
            success:true,
            message: 'Pet deleted successfully'
        });
    } catch (error) {
        if (error.message.includes('Cannot delete pet')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Fail to delete pet', detail: error.message });
    }
}

export const getPetExamHistory = async (req, res) =>{
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'getPetExamHistory. Pet ID is required'});
        }

        const exams = await petService.getPetExamHistory(req.db, id);

        res.status(200).json({
            success: true,
            length: exams.length,
            data: exams
        });
    } catch (error) {
        res.status(500).json({ error: 'Fail to retrieve pet exam history', detail: error.message });
    }
}

export const updatePet = async (req, res) => {
    try {
        const {MaTC, ...updateData} = req.body;

        if (!MaTC){
            return res.status(400).json({error: 'updatePet. Pet ID is required'});
        }

        const rowsAffected = await petService.updatePet(req.db, { MaTC, ...updateData });

        if (rowsAffected === 0){
            return res.status(404).json({error: 'updatePet. Pet not found'});
        }

        res.status(200).json({
            success:true,
            message:'Pet update successfully',
            petId: MaTC
        })
    } catch(error) {
        res.status(500).json({ error: 'Fail to update pet data', detail: error.message })
    }
}


export const getPetVaccinationHistory = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'getPetVXHistory. Pet ID is required'})
        }

        const vaccinations = await petService.getPetVaccinationHistory(req.db, id);

        res.status(200).json({
        success: true,
        count: vaccinations.length,
        data: vaccinations
        });

    } catch (err) {
        res.status(500).json({ 
        error: 'getPetVXHistory. Fail to get pet history', 
        details: err.message 
        });
    }
    };
export default { getPets, getPetDetail, createNewPet, deletePet,updatePet, getPetExamHistory, getPetVaccinationHistory };