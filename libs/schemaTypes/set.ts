
export class SetType {
	private valType: string;

	constructor(valType: string) {
		this.valType = valType;
	}

	schemaString(): string {
		return `set<${this.valType}>`;
	}
}