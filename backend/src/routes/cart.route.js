import express from 'express'
const router = express.Router()

// khach hang an vao them san pham vao gio hang
// -> them san pham vao gio hang (phieu dat dv) va tao phieu dat dv neu chua co
// neu ma gio hang (phieu dat dv) da ton tai thi chi can them san pham vao phieu dat dv do
// neu khach hang xoa san pham trong gio hang thi xoa san pham do khoi phieu dat dv, neu gio hang ko con san pham nao thi xoa phieu dat dv do luon
// khach hang an thanh toan gio hang -> cap nhat trang thai phieu dat dv thanh da thanh toan va tao hoa don + chi tiet hoa don

router.post('/', ) // api/v1/cart - them san pham vao gio hang lan dau -> tao phieu dat dv va san pham dau tien
router.put('/:maphieudatdv', ) // api/v1/cart/:cartId - cap nhat gio hang (them bot san pham/dv)
router.get('/:maphieudatdv', ) // api/v1/cart/:cartId - lay thong tin gio hang hien tai