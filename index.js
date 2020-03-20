const express = require('express');
const app = express();
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql'); 
const { frasesArreglo } = require('./data.json');


const schema = buildSchema(`
	type Query{
		frase(id:Int!):Frases
		frasesAll:[Frases]
	}

	type Frases{
		frase:String
	}

	type Mutation{
		deleteFrase(id:Int!):String
		createFrase(frase:String!):Frases
		updateFrase(id:Int!, FraseModificada:String!):String
	}

	input FraseInput{
		frase:String
	}
`); 

//Retorna Todas las Frases
let getFrasesAll = ()=>{
	return frasesArreglo;
}

//Retorna Una Frase
let getFrase = (args)=>{
	let id = args.id;
	return frasesArreglo[id];
}

//Elimina una Frase
let deleteFrase = (id) =>{
	if(id.id >= 0 && id.id < frasesArreglo.length){
		frasesArreglo.splice(id.id,1);
		return 'Frase Eliminada';
	}else{
		return null
	}
}

//Crea una Frase
let createFrase = (input) =>{
	frasesArreglo.push(input);
	return input;
}

//Modifica una Frase
let updateFrase = (id, frase) =>{
	let index = id.id;
	frasesArreglo[index].frase = id.FraseModificada;
	return 'Frase Modificada';
}

const root = {
	frase: getFrase,
	frasesAll: getFrasesAll,
	deleteFrase: deleteFrase,
	updateFrase: updateFrase,
	createFrase: createFrase,
}

app.use('/graphql',express_graphql({
	schema:schema,
	rootValue:root,
	graphiql:true
}));

app.listen(3000, ()=> console.log('server on port 3000'));