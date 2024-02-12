// // store.js
// import { createStore } from 'solid-js/store';

// // Create a store with multiple states
// const [appStore, setGlobalAppState] = createStore({
//   loading: 0,
//   user: null,
//   theme: 'light',
//   loadingMainLabel: '',
//   loadingSecondLabel: ''
//   // ... add more states as needed
// });

// const loadingMessages: string[] = [];

// // Export the store states and control functions
// export const useAppStore = () => ({
//   appStore,
//   startLoading(message: string, secondMessage?: string) {
//     loadingMessages.push(message);
//     setGlobalAppState('loading', (n) => n + 1)
//     setGlobalAppState('loadingMainLabel', message);
//     setGlobalAppState('loadingSecondLabel', secondMessage || '');
//   },
//   completeLoading() {
//     setGlobalAppState('loading', (n) => n - 1)
//     let previousMessage = loadingMessages.pop();
//     setGlobalAppState('loadingMainLabel', previousMessage || '');
//     setGlobalAppState('loadingSecondLabel', '');
//   },
//   setUser(user: any) {
//     setGlobalAppState('user', user);
//   },
//   toggleTheme() {
//     setGlobalAppState('theme', appStore.theme === 'light' ? 'dark' : 'light');
//   },
//   setLoadingMainLabel(mainLabel: string) {
//     setGlobalAppState('loadingMainLabel', mainLabel);
//   },
//   setLoadingSecondLabel(secondLabel: string) {
//     setGlobalAppState('loadingSecondLabel', secondLabel);
//   }
// });
