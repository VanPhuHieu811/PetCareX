export const getCart = async (pool, customerId) => {
  try {
    const query = `
      SELECT 
          p.MaPhieuDV, 
          p.TrangThai, 
          d.MaSP,
          d.TenSP_SnapShot as TenSP,
          d.DonGia_LucMua as DonGia,
          d.SoLuongMua
      FROM PhieuDatDV p
      JOIN DanhSachSP d ON p.MaPhieuDV = d.MaPhieuDV
      LEFT JOIN SanPham s ON d.MaSP = s.MaSP
      WHERE p.MaKH = @CustomerId 
        AND p.TrangThai = N'Đang chờ' 
        AND p.LoaiDichVu = N'Mua hàng'
    `;
    const request = pool.request();
    request.input('CustomerId', customerId);
    const result = await request.query(query);

    return result.recordset;
  } catch (err) {
    throw new Error(`Get cart failed: ${err.message}`);
  }
};

export const addToCart = async (pool, customerId, customerName, branchId, productId, quantity) => {
  try {
    // 1. Check if active cart exists
    const checkQuery = `
      SELECT TOP 1 MaPhieuDV 
      FROM PhieuDatDV 
      WHERE MaKH = @CustomerId 
        AND TrangThai = N'Đang chờ' 
        AND LoaiDichVu = N'Mua hàng'
    `;
    const requestCheck = pool.request();
    requestCheck.input('CustomerId', customerId);
    const checkResult = await requestCheck.query(checkQuery);

    let cartId = null;

    if (checkResult.recordset.length > 0) {
      // Cart exists -> Call sp_addToCart
      cartId = checkResult.recordset[0].MaPhieuDV;

      const requestAdd = pool.request();
      requestAdd.input('cartId', cartId);
      requestAdd.input('productId', productId);
      requestAdd.input('branchId', branchId);
      requestAdd.input('quantity', quantity);

      await requestAdd.execute('sp_addToCart');
    } else {
      // Cart does not exist -> Call sp_createCart
      // sp_createCart creates cart AND adds the first item

      const requestCreate = pool.request();
      requestCreate.input('customerId', customerId);
      requestCreate.input('nameCustomer', customerName);
      requestCreate.input('productId', productId);
      requestCreate.input('branchId', branchId);
      requestCreate.input('quantity', quantity);

      await requestCreate.execute('sp_createCart');
    }
  } catch (err) {
    throw new Error(`Add to cart failed: ${err.message}`);
  }
};

export const removeFromCart = async (pool, cartId, productId) => {
  try {
    const request = pool.request();
    request.input('cartId', cartId);
    request.input('productId', productId);
    await request.execute('sp_removeFromCart');
  } catch (err) {
    throw new Error(`Remove from cart failed: ${err.message}`);
  }
};

export const checkout = async (pool, cartId, staffId, branchId, paymentMethod) => {
  try {
    const request = pool.request();
    request.input('cartId', cartId);
    request.input('staffId', staffId);
    request.input('branchId', branchId);
    request.input('paymentMethod', paymentMethod);
    await request.execute('sp_checkout');
  } catch (err) {
    throw new Error(`Checkout failed: ${err.message}`);
  }
};