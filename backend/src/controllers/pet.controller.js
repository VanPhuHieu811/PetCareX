import * as petService from '../services/pet.service.js';

const canAccessPet = (user, petOwnerId) => {
    const role = user.role || user.VaiTro || 'Khách hàng'; 

    if (role !== 'Khách hàng') return true;

    return user.id === petOwnerId;
};

export const getPets = async (req, res) => {
    try {
        const currentUser = req.user;
        const userRole = currentUser.role || 'Khách hàng';
        
        let targetUserId = currentUser.id;

        if (userRole !== 'Khách hàng' && req.query.customerId) {
            targetUserId = req.query.customerId;
        }

        const results = await petService.getAllPetsByUserId(req.db, targetUserId);
        
        return res.status(200).json({
            success: true,
            filterBy: targetUserId === currentUser.id ? 'My Pets' : `Customer: ${targetUserId}`,
            data: results,
        }); 
    } catch (error) {
        res.status(500).json({ error: 'Fail to retrieve pets', detail: error.message });
    }
};

export const getPetDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Pet ID is required' });

        const pet = await petService.getPetById(req.db, id);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });

        if (!canAccessPet(req.user, pet.MaKH)) {
            return res.status(403).json({ error: 'Forbidden: You do not own this pet' });
        }

        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error: 'Fail to retrieve pet detail', detail: error.message });
    }
};

// API: Update
export const updatePet = async (req, res) => {
    try {
        const { MaTC, ...updateData } = req.body;
        if (!MaTC) return res.status(400).json({ error: 'Pet ID is required' });

        const pet = await petService.getPetById(req.db, MaTC);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });

        if (!canAccessPet(req.user, pet.MaKH)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const rowsAffected = await petService.updatePet(req.db, { 
            MaTC, 
            ...updateData 
        });

        res.status(200).json({
            success: true,
            message: 'Pet updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Fail to update pet', detail: error.message });
    }
};

// Các hàm History, Delete làm tương tự getPetDetail (Lấy pet -> Check canAccessPet -> Thực hiện)
// ...

export const createNewPet = async (req, res) => {
    try {
        const customerId = req.user.id;        
        const { TenTC, MaGiong, NgaySinh, TinhTrangSucKhoe, GioiTinh} = req.body;

        if (!TenTC || !MaGiong || !NgaySinh || !GioiTinh || !customerId) {
            return res.status(400).json({ error: 'Missing required pet data' });
        }
        const newPet = await petService.createPet(req.db, {TenTC, MaGiong, NgaySinh, TinhTrangSucKhoe, GioiTinh, MaKH:customerId});

        res.status(201).json({
            success: true,
            message: 'Pet created successfully',
            data: newPet
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating pet',
            detail: error.message,
        });
    }
};

export const deletePet = async (req, res) => {
    try {
        const customerId = req.user?.id;        
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'deletePet. Pet ID is required'});
        }

        const pet = await petService.getPetById(req.db, id, customerId);
        if (!pet) return res.status(404).json({ error: 'deletePet. Pet not found' });
        if (pet.MaKH !== customerId) return res.status(403).json({ error: 'Forbidden' });

        const deletedCount = await petService.deletePet(req.db, id, customerId);

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
        const customerId = req.user?.id;        

        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'getPetExamHistory. Pet ID is required'});
        }

        const pet = await petService.getPetById(req.db, id, customerId);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        if (pet.MaKH !== customerId) return res.status(403).json({ error: 'Forbidden' });
        
        const exams = await petService.getPetExamHistory(req.db, id, customerId);

        res.status(200).json({
            success: true,
            length: exams.length,
            data: exams
        });
    } catch (error) {
        res.status(500).json({ error: 'Fail to retrieve pet exam history', detail: error.message });
    }
}

export const getPetVaccinationHistory = async (req, res) => {
    try {
        const customerId = req.user?.id;

        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: 'getPetVXHistory. Pet ID is required'})
        }

        const pet = await petService.getPetById(req.db, id, customerId);
        if (!pet) return res.status(404).json({ error: 'updatePet. Pet not found' });
        if (pet.MaKH !== customerId) return res.status(403).json({ error: 'Forbidden' });

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

export const getPetTypes = async (req, res) => {
  try {
    const types = await petService.getAllPetTypes(req.db);
    
    res.status(200).json({
      success: true,
      count: types.length,
      data: types
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Fail to get list pet types', 
      details: err.message 
    });
  }
};

export const getPetBreeds = async (req, res) => {
  try {
    const { typeId } = req.query;

    if (!typeId) {
      return res.status(400).json({ error: 'PetTypeId is required' });
    }

    const breeds = await petService.getBreedsByTypeId(req.db, typeId);
    
    res.status(200).json({
      success: true,
      count: breeds.length,
      data: breeds
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Fail to get pet breeds', 
      details: err.message 
    });
  }
};

export default { 
    canAccessPet,
    getPets, 
    getPetDetail, 
    createNewPet, 
    deletePet,
    updatePet, 
    getPetExamHistory, 
    getPetVaccinationHistory,
    getPetTypes,
    getPetBreeds
};