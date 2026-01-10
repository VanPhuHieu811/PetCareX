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

    const result = await CartService.addToCart(req.db, customerId, customerName, branchId, productId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cartId: result.cartId,
      productName: result.productName || null
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

    const result = await CartService.removeFromCart(req.db, cartId, productId);

    let message = `Item '${result.ProductName || productId}' removed from cart`;
    if (result.DeletedCartId) {
      message += `. Cart ${result.DeletedCartId} was also removed as it became empty`;
    }

    return res.status(200).json({
      success: true,
      message: message,
      productName: result.ProductName || null,
      deletedCartId: result.DeletedCartId || null
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
    const { branchId } = req.body;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: branchId'
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

    const invoice = await CartService.checkout(req.db, cartId, branchId);

    return res.status(200).json({
      success: true,
      message: 'Checkout successful',
      invoice: invoice || null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}