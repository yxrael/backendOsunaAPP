const { response } = require('express');
const { Negocio } = require('../models');


const obtenerNegocios = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, negocios ] = await Promise.all([
        Negocio.countDocuments(query),
        Negocio.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        negocios
    });
}

const obtenerNegocio = async(req, res = response ) => {

    const { id } = req.params;
    const negocio = await Negocio.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( negocio );

}

const crearNegocio = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const negocioDB = await Negocio.findOne({ nombre: body.nombre.toUpperCase() });

    
    if ( negocioDB ) {
        return res.status(400).json({
            msg: `El establecimiento ${ negocioDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const negocio = new Negocio( data );

    // Guardar DB
    const nuevoNegocio = await negocio.save();
    await nuevoNegocio
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();

    res.status(201).json( nuevoNegocio );

}

const actualizarNegocio = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const negocios = await Negocio.findByIdAndUpdate(id, data, { new: true });

    await negocios
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
        
    res.json( negocios );

}

const borrarNegocio = async(req, res = response ) => {

    const { id } = req.params;
    const negocioBorrado = await Negocio.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( negocioBorrado );
}




module.exports = {
    crearNegocio,
    obtenerNegocios,
    obtenerNegocio,
    actualizarNegocio,
    borrarNegocio
}