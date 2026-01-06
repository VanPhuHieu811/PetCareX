import axiosInstance from '../config/axiosConfig';
import { Pet } from '../types';
import { PetFormData } from '../components/pets/AddPetModal';

export const petService = {
    // Lấy danh sách thú cưng của khách hàng
    getPets: async (customerId: string): Promise<Pet[]> => {
        const response = await axiosInstance.get(`/pets`, {
            params: { customerId }
        });
        return response.data;
    },

    // Thêm thú cưng mới
    addPet: async (data: PetFormData & { customerId: string }): Promise<Pet> => {
        const response = await axiosInstance.post('/pets', data);
        return response.data;
    },

    // Cập nhật thông tin thú cưng
    updatePet: async (petId: string, data: Partial<PetFormData>): Promise<Pet> => {
        const response = await axiosInstance.put(`/pets/${petId}`, data);
        return response.data;
    },

    // Xóa thú cưng
    deletePet: async (petId: string): Promise<void> => {
        await axiosInstance.delete(`/pets/${petId}`);
    },

    // Lấy danh sách loại thú cưng (species)
    getSpecies: async (): Promise<{ id: string; name: string }[]> => {
        const response = await axiosInstance.get('/pets/species');
        return response.data;
    },

    // Lấy danh sách giống theo loại thú cưng
    getBreeds: async (speciesId: string): Promise<{ id: string; name: string }[]> => {
        const response = await axiosInstance.get('/pets/breeds', {
            params: { speciesId }
        });
        return response.data;
    }
};

