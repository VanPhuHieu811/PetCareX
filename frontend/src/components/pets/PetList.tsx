import { Pet } from '../../types';
import { Heart } from 'lucide-react';

interface PetListProps {
    pets: Pet[];
    selectedPetId: string | null;
    onSelectPet: (petId: string) => void;
}

export default function PetList({ pets, selectedPetId, onSelectPet }: PetListProps) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map(pet => (
                <div
                    key={pet.id}
                    onClick={() => onSelectPet(pet.id)}
                    className={`
                        bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all
                        ${selectedPetId === pet.id
                            ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                            : 'border-gray-100 hover:border-blue-300 hover:shadow-md'
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {pet.avatar ? (
                                <img
                                    src={pet.avatar}
                                    alt={pet.name}
                                    className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-gray-100"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                                    {pet.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{pet.name}</h3>
                            <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{pet.gender}</span>
                                <span>•</span>
                                <span>{pet.weight}kg</span>
                            </div>
                        </div>
                    </div>
                    {selectedPetId === pet.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                                <Heart className="w-4 h-4" />
                                <span>Đang xem lịch sử</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

