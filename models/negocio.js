const { Schema, model } = require('mongoose');

const NegocioShema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    // precio: {
    //     type: Number,
    //     default: 0
    // },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        // required: true
    },
    seccion: { 
        type: String,
        default: 'negocios'
    },
    descripcion: { type: String },
    direccion: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    disponible: { type: Boolean, default: true },
    img: { type: String },
});


NegocioShema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Negocio', NegocioShema );
