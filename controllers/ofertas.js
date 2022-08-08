const { response } = require('express');
const { Oferta } = require('../models');


const obtenerOfertas = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, ofertas ] = await Promise.all([
        Oferta.countDocuments(query),
        Oferta.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        ofertas
    });
}

const obtenerOferta = async(req, res = response ) => {

    const { id } = req.params;
    const oferta = await Oferta.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( oferta );

}

const crearOferta = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const ofertaDB = await Oferta.findOne({ nombre: body.nombre.toUpperCase() });

    
    if ( ofertaDB ) {
        return res.status(400).json({
            msg: `La oferta ${ ofertaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const oferta = new Oferta( data );

    // Guardar DB
    const nuevaOferta = await oferta.save();
    await nuevaOferta
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();

    res.status(201).json( nuevaOferta );

}

const actualizarOferta = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const ofertas = await Oferta.findByIdAndUpdate(id, data, { new: true });

    await ofertas
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
        
    res.json( ofertas );

}

const borrarOferta = async(req, res = response ) => {

    const { id } = req.params;
    const ofertaBorrada = await Oferta.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( ofertaBorrada );
}




module.exports = {
    crearOferta,
    obtenerOfertas,
    obtenerOferta,
    actualizarOferta,
    borrarOferta
}