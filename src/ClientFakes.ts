// export class FakeRunner {
//   successAction?: (data: any) => void;
//   failureAction?: (data: any) => void;

//   withSuccessHandler(action: (data: any) => void): FakeRunner {
//     this.successAction = action;
//     return this;
//   }

//   withFailureHandler(action: (data: any) => void): FakeRunner {
//     this.failureAction = action;
//     return this;
//   }

//   serverCommand(req: any): void {
//     console.log("Client want to run " + JSON.stringify(req));
//     try {
//       let xx = fetch("http://localhost:3000/server?req=" + encodeURIComponent(JSON.stringify(req)))
//         .then(response => {
//           const statusCode = response.status;
//           let result = response.json();
//           return result;
//         })
//         .then(result => {
//           if ("error" in result) {
//             if (this.failureAction) this.failureAction(result.error)
//           } else {
//             if (this.successAction) this.successAction(result);
//           }
//         })
//         .catch((error: any) => {
//           console.error('Error:', error.statusCode, error.errorContent, xx);
//           if (this.failureAction) this.failureAction(error);
//         });
//     } catch (e) {
//       if (this.failureAction) this.failureAction(e);
//     }

//   }

// }
// export class FakeGoogleClass {
//   script = this;
//   get run(): FakeRunner {
//     return new FakeRunner();
//   }
// }

// export var fakeGoogle = new FakeGoogleClass()
