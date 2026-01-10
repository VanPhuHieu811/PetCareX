// components/customer/pets/AddPetModal.tsx
import { useEffect, useMemo, useState } from "react";
import { X, Plus, Calendar, Heart } from "lucide-react";
import { getPetTypes, getPetBreeds } from "../../../api/petApi";

interface Breed {
  id: string;      // MaGiong
  name: string;    // TenGiong
  typeId: string;  // MaLoaiThuCung
}

interface PetType {
  id: string;   // MaLoai
  name: string; // TenLoai
}

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => void;
  submitting?: boolean;
}

export interface PetFormData {
  name: string;
  breedId: string;
  dob: string;
  gender: "Đực" | "Cái";
  healthStatus: string;
}

export default function AddPetModal({ isOpen, onClose, onSubmit, submitting }: AddPetModalProps) {
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    breedId: "",
    dob: "",
    gender: "Đực",
    healthStatus: "Khỏe mạnh",
  });

  const [types, setTypes] = useState<PetType[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>({});

  const resetForm = () => {
    setFormData({
      name: "",
      breedId: "",
      dob: "",
      gender: "Đực",
      healthStatus: "Khỏe mạnh",
    });
    setSelectedTypeId("");
    setBreeds([]);
    setErrors({});
  };

  // Load types when open
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    (async () => {
      setLoadingTypes(true);
      try {
        const res: any = await getPetTypes();
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        // Map fields (để chịu được backend naming)
        const mapped: PetType[] = list.map((t: any) => ({
          id: t.MaLoaiTC,
          name: t.TenLoaiTC 
        }));
        setTypes(mapped.filter((x) => x.id && x.name));
      } finally {
        setLoadingTypes(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load breeds when type changes
  useEffect(() => {
    if (!selectedTypeId) {
      setBreeds([]);
      setFormData((p) => ({ ...p, breedId: "" }));
      return;
    }

    (async () => {
      setLoadingBreeds(true);
      try {
        const res: any = await getPetBreeds(selectedTypeId);
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const mapped: Breed[] = list.map((b: any) => ({
          id: b.MaGiong,
          name: b.TenGiong,
          typeId: b.MaLoaiTC|| selectedTypeId,
        }));
        setBreeds(mapped.filter((x) => x.id && x.name));
        setFormData((p) => ({ ...p, breedId: "" }));
      } finally {
        setLoadingBreeds(false);
      }
    })();
  }, [selectedTypeId]);

  const availableBreeds = useMemo(() => breeds, [breeds]);

  const handleChange = (field: keyof PetFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PetFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên thú cưng";
    if (!selectedTypeId) newErrors.breedId = "Vui lòng chọn loại thú cưng";
    if (!formData.breedId) newErrors.breedId = "Vui lòng chọn giống";

    if (!formData.dob) {
      newErrors.dob = "Vui lòng chọn ngày sinh";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate > today) newErrors.dob = "Ngày sinh không thể lớn hơn ngày hiện tại";
    }

    if (!formData.healthStatus.trim()) newErrors.healthStatus = "Vui lòng nhập tình trạng sức khỏe";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Thêm thú cưng mới</h2>
                <p className="text-blue-100 mt-1">Điền thông tin để đăng ký thú cưng</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-blue-800 rounded-full transition-colors" disabled={submitting}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thú cưng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Nhập tên thú cưng"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Loại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại thú cưng <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => {
                setSelectedTypeId(e.target.value);
                setErrors((prev) => ({ ...prev, breedId: undefined }));
              }}
              disabled={submitting || loadingTypes}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.breedId && !selectedTypeId ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">{loadingTypes ? "Đang tải..." : "-- Chọn loại thú cưng --"}</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.breedId && !selectedTypeId && <p className="mt-1 text-sm text-red-600">{errors.breedId}</p>}
          </div>

          {/* Giống */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giống <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.breedId}
              onChange={(e) => handleChange("breedId", e.target.value)}
              disabled={!selectedTypeId || submitting || loadingBreeds}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.breedId ? "border-red-300 bg-red-50" : "border-gray-300"
              } ${!selectedTypeId ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {!selectedTypeId ? "Chọn loại trước" : loadingBreeds ? "Đang tải giống..." : "-- Chọn giống --"}
              </option>
              {availableBreeds.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.breedId && selectedTypeId && <p className="mt-1 text-sm text-red-600">{errors.breedId}</p>}
          </div>

          {/* Ngày sinh + giới tính */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                disabled={submitting}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.dob ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value as "Đực" | "Cái")}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="Đực">Đực</option>
                <option value="Cái">Cái</option>
              </select>
            </div>
          </div>

          {/* Tình trạng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 inline mr-1" />
              Tình trạng sức khỏe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.healthStatus}
              onChange={(e) => handleChange("healthStatus", e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.healthStatus ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Ví dụ: Khỏe mạnh, Bệnh ngoài da..."
            />
            {errors.healthStatus && <p className="mt-1 text-sm text-red-600">{errors.healthStatus}</p>}
            <p className="mt-1 text-sm text-gray-500">Mô tả tình trạng sức khỏe hiện tại của thú cưng</p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              {submitting ? "Đang thêm..." : "Thêm thú cưng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
