// import { createSignal, Component, For } from 'solid-js';
// // import { Button } from "@suid/material";
// import { commandRunner } from '../commandRunner';
// // import { width } from '@mui/system';
// import Link from '../components/Link'
// import Page from '../components/Page';
// import Loading from '../components/Loading';
// import Button from '../components/Button';
// import { delay } from '../core/Utils';
// import { useAppStore } from '../core/AppStore';
// import Pager from '../components/Pager';
// import { ObjectSelector } from '../components/ObjectSelector';

// const server = commandRunner<IServerCommands>("Sheet1");

// const Home: Component = () => {
//   const [currentPage, setCurrentPage] = createSignal(1);
//   const { startLoading, completeLoading, appStore, setLoadingMainLabel, setLoadingSecondLabel } = useAppStore();

//   async function longAction() {
//     startLoading("Loading long thing...")
//     try {
//       for (let i = 0; i < 20; i++) {
//         await delay(0.15);
//         setLoadingSecondLabel("#" + i);
//       }
//     } finally {
//       completeLoading()
//     }
//   }

//   return (
//     <Page>
//       <p>y a pas grand chose ici essayez plutôt la page publipostage</p>
//       <button class="btn" onClick={longAction}>long action</button>
//     </Page>
//   );
// };

// export default Home;
