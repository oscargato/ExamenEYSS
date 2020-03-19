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
		id:Int
		frase:String
	}

	type Mutation{
		deleteFrase(id:Int!):String
		createFrase(frase:String!):Frases
		updateFrase(id:Int!, FraseModificada:String!):Frases
	}

	input FraseInput{
		frase:String
	}
`); 


//Retorna Una Frase
let getFrase = (args)=>{
	let id = args.id;
	return frasesArreglo.filter(frase => {
		return frase.id == id;
	})[0]
}

//Retorna Todas las Frases
let getFrasesAll = ()=>{
	return frasesArreglo;
}

//Elimina una Frase
let deleteFrase = (id) =>{
	frasesArreglo.splice(id,1);
	return 'Frase Eliminada';
}

//Crea una Frase
let createFrase = (input) =>{
	input.id = frasesArreglo.length + 1;
	console.log(input);
	frasesArreglo.push(input);
	return input;
}


//*************************************************
//Modifica una Frase
let updateFrase = (id, frase) =>{
	frasesArreglo.map(result => {
		if(result.id === id){
			result.frase = frase;
		}
		return result;
	});
	return frasesArreglo.filter(fras => fras.id === id)[0];
}
//*************************************************


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