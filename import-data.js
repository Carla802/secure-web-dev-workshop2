require('dotenv').config()
const mongoose=require("mongoose")

const { Schema } = mongoose;

const locationSchema = new Schema({
    filmType:  String, // String is shorthand for {type: String}
    filmProducerName: String,
    endDate:   Date,
    filmName: String,
    district: Number,
    geolocation: {
        coordinates: [
            Number
        ],
        type: {type: String}
    },
    sourceLocationId: String,
    filmDirectorName: String,
    address: String,
    startDate: Date,
    year: Number

});

const Location = mongoose.model("Location",locationSchema)
const filmingLocations = require('./lieux-de-tournage-a-paris.json')

async function ImportMongo() {
    for (let i = 0; i < filmingLocations.length; i++) {
        let object = {
            filmType: filmingLocations[i].fields.type_tournage,
            filmProducerName: filmingLocations[i].fields.nom_producteur,
            endDate: filmingLocations[i].fields.date_fin,
            filmName: filmingLocations[i].fields.nom_tournage,
            district: filmingLocations[i].fields.ardt_lieu,
            geolocation: {
                coordinates: filmingLocations[i].fields.geo_shape.coordinates,
                type: filmingLocations[i].fields.geo_shape.type
            },
            sourceLocationId: filmingLocations[i].fields.id_lieu,
            filmDirectorName: filmingLocations[i].fields.nom_realisateur,
            address: filmingLocations[i].fields.adresse_lieu,
            startDate: filmingLocations[i].fields.date_debut,
            year: filmingLocations[i].fields.annee_tournage
        }
        const myloc = new Location(object);
        await myloc.save();
    }
}

async function locationByID(idToFind) {
    Location.findById(idToFind).then(film => console.log(film));
    Location.findById(idToFind).then(film => console.log("Location by ID : ", film));
}

async function locationsByName(filmName) {
    Location.find({filmName: filmName}).then(films => console.log(films));
    Location.find({filmName: filmName}).then(films => console.log("Locations by Name : ", films));
}

async function deleteByID(id) {
    Location.findOneAndDelete({_id: id});
    try {
        Location.findOneAndDelete({_id: id});
    } catch (e) {
        console.log("Error");
    }

}

function addLocation(location) {
    try {
        location.save();
    } catch (e) {
        console.log("Error");

    }
}

function updateLocation(id, update) {
    try {
        Location.updateOne({id: id}, update);
    } catch (e) {
        console.log("Error");
    }
}

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo Database");
    //await ImportMongo();
    await locationByID("633f2094be2406970ec6e7d9");
    await locationsByName("TOUT S'EST BIEN PASSE")

}

main();


