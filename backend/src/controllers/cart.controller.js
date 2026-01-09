export const createCart = async (req, res) => {
  try {
    const pool = req.db; 

    const customerId = req.user.id;
    const nameCustomer = req.user.name;

    const productId = req.body.productId;
    const branchId = req.body.branchId;

    const result = await cartService.createCart(pool, customerId, nameCustomer, productId, branchId);
    res.status(200).json(result);
  }
  catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to add item to cart', details: err.message });
  }
}