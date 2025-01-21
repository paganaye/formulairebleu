export class Box<T> {
    private value: T;
    
    constructor(value: T) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}