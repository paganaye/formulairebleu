// This is the entry point of the library.
import { IForm } from './IForm';
import { Box } from './Box';

export function double(form: IForm, a: number): Box<number> {
    return new Box(a * 2);
}
