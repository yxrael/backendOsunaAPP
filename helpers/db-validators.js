const Role = require('../models/role');
const { Usuario, Categoria, Negocio, Oferta } = require('../models');

const esRoleValido = async(rol = 'USER_ROLE') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Categorias
 */
const existeCategoriaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Negocios
 */
const existeNegocioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeNegocio = await Negocio.findById(id);
    if ( !existeNegocio ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Negocios
 */
const existeOfertaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeOferta = await Oferta.findById(id);
    if ( !existeOferta ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeNegocioPorId,
    existeOfertaPorId,
    coleccionesPermitidas
}

