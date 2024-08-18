export default function Export(name, validator, encoder) {
	this.name = name;
	this.validate = validator;
	this.encode = encoder;
}
