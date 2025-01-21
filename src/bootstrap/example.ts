import { IForm } from '../core/IForm';
import { IBootstrapFormEngine } from './IForm';


const form: IForm<IBootstrapFormEngine> = {
  version: '1',
  name: 'Example Form',
  dataType: {
    type: 'array',
    entryType: { type: 'string' },
    viewAs: { type: 'table' },
  },
};