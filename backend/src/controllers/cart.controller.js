import * as CartService from '../services/cart.service.js';

export const getCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const cart = await CartService.getCart(req.db, customerId);
    return res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const customerName = req.user.name;
    const { branchId, productId, quantity } = req.body;

    if (!branchId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: branchId, productId, quantity'
      });
    }

    await CartService.addToCart(req.db, customerId, customerName, branchId, productId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.body;

    const cartItems = await CartService.getCart(req.db, customerId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active cart found'
      });
    }

    const cartId = cartItems[0].MaPhieuDV; // All items share the same MaPhieuDV

    await CartService.removeFromCart(req.db, cartId, productId);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const checkout = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { branchId, paymentMethod } = req.body;

    if (!branchId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: branchId, paymentMethod'
      });
    }

    // Find active cart
    const cartItems = await CartService.getCart(req.db, customerId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active cart found to checkout'
      });
    }

    const cartId = cartItems[0].MaPhieuDV;

    // StaffId can be null if online self-checkout? 
    // sp_checkout takes @staffId. If online, who is the staff?
    // Maybe NULL is allowed? schema: MaNVLap varchar(10) NOT NULL in HoaDon...
    // Wait, HoaDon.MaNVLap is NOT NULL.
    // So we need a default "System" staff or "Online" staff.

    const staffId = 'NV0087';

    await CartService.checkout(req.db, cartId, staffId, branchId, paymentMethod);

    return res.status(200).json({
      success: true,
      message: 'Checkout successful'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}