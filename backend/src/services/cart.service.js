export const createCart = async (pool, customerId, nameCustomer, productId, branchId) => {
  try {
    // select tenKH from NguoiDung where id = customerId
    const query = `
    insert into PhieuDatDV values
    ('PDV00000', GETDATE(), customerID, tenKH, NULL, 'CN03', 'DV03', 'Online', )
    `
  }
}