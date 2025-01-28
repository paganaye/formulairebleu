import { IBootstapSwitchType } from "./BootstrapBooleanView";

declare module "../../core/IForm" {
    export namespace formulairebleu {
        export interface INumberViews {
            mynumber1: { type: 'mynumber1', min: number; };
        }
        export interface IBooleanViews {
         //   switch: IBootstapSwitchType;
        }
    }
}

export default {}