// import { fakeGoogle } from './ClientFakes';
// import "../server/IServerTypes";
// import { useAppStore } from './core/AppStore';
// import { getOrCache } from './core/Utils';


// export var google: any = (window as any).google ?? ((window as any).google = fakeGoogle);

// type AsyncMethods<T> = {
//   [P in keyof T]: T[P] extends (...args: infer Args) => infer Return
//   ? (...args: Args) => Promise<Return>
//   : never;
// };



// export function commandRunner<T>(sheetName: string): AsyncMethods<T> {
//   const { startLoading: startLoading, completeLoading } = useAppStore()
//   return new Proxy({}, {
//     get(target, command: string, receiver) {
//       return (...args: any[]) => {
//         let request: ISideBarRequest = {
//           sheetName,
//           command: command,
//           args
//         };
//         console.log("CommandRunner request", request);
//         let result = getOrCache({ command: request.command, args }, async () => {
//           return new Promise((resolve, reject) => {
//             startLoading(request.command, JSON.stringify(request.args));
//             let scriptRun = (google.script.run as any)
//               .withSuccessHandler((data: ISideBarResponse) => {
//                 completeLoading();
//                 console.log("CommandRunner success data (command " + request.command + ")", data);
//                 if (data.error) {
//                   reject(data.error);
//                 } else {
//                   console.log("CommandRunner data result", data.result);
//                   resolve(data.result);
//                 }
//               })
//               .withFailureHandler((err: any) => {
//                 completeLoading();
//                 console.log("CommandRunner failure", err);
//                 reject(err);
//               })
//             scriptRun.serverCommand(request);
//           })
//         });
//         return result;
//       };
//     },
//   }) as AsyncMethods<T>;
// }
