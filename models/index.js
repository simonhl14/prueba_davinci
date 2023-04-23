import Area from './Area.js';
import Producto from './Producto.js';
import Registro from './Registro.js';
import Usuario from './Usuario.js';

Usuario.belongsTo(Area, { foreignkey: 'areaId' })
Registro.belongsTo(Usuario, { foreignkey: 'usuarioId' })
Registro.belongsTo(Producto, { foreignkey: 'productoId' })

export {
    Area,
    Producto,
    Registro,
    Usuario
}