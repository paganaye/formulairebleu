// import MenuIcon from "@suid/icons-material/Menu";
import { createSignal, Component, For, Show, createEffect, ErrorBoundary, createMemo } from 'solid-js';
import "../library/src/types"
import { Dynamic } from "solid-js/web";
import { lazy } from "solid-js";

const MailingPage = lazy(() => import("./pages/MailingPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const TestPage = lazy(() => import("./pages/TestPage"));

declare var google: any;
declare var formulaireBleuGlobals: IFBGlobals;

if (typeof formulaireBleuGlobals === 'undefined') {
  (window as any).formulaireBleuGlobals = { webApp: true };
}

declare var dialogRoute: string;

const pages: Record<IDialogType, any> = {
  home: null,
  email: null,
  mailing: MailingPage,
  settings: SettingsPage,
  test: TestPage,
  notFound: NotFoundPage
}

const [appCurrentPage, setAppCurrentPage] = createSignal(formulaireBleuGlobals.dialog);

if (formulaireBleuGlobals.webApp) {
  const page = document.location.pathname.split('/')[1];
  setAppCurrentPage(page);
}


const App: Component = () => {
  const currentPageComponent = createMemo(() => {
    let currentPage = appCurrentPage() || 'notFound';
    console.log({ currentPage, pages })
    return pages[currentPage] ?? NotFoundPage
  })

  console.log("formulaireBleuGlobals", formulaireBleuGlobals);
  return (
    <>
      <ErrorBoundary fallback={(error, reset) => <p>{error}</p>}>
        <Dynamic component={currentPageComponent()} />
      </ErrorBoundary>
    </>
  );
};

export default App;
/*
  myIcon
: 
"/client/icons/excel.svg"
function getDocumentName() {
  google.script.run
    .withSuccessHandler((data: any) => {
      setResponse(data);
    })
    .withFailureHandler((error: any) => {
      setError(error);
    })
    .triggerFunction({ command: "getDocumentName" });
}


function setDocumentName() {
  google.script.run
    .withSuccessHandler((data: any) => {
      setResponse(data);
    })
    .withFailureHandler((error: any) => {
      setError(error);
    })
    .triggerFunction("Test document " + (new Date().toISOString()));
}

  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get('page');
      {/* <div class="flex justify-center items-center h-screen flex-col overflow-hidden bg-gray-400"> * /}
      {/* <div class="flex flex-col overflow-hidden bg-gray-100" style="width: min(100%, 800px); height: 100%">
          <div class="drawer">
            <input id="main-drawer" type="checkbox" class="drawer-toggle" /> * /}
      {/*            <div class="drawer-content"> * /}
      {/* Page content here              * /}
      {/* <Appbar title={T(currentRouteInfo()?.text)}></Appbar> * /}
      {/* </div>
          <div class="drawer-side" style="z-index:2">
            <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label> * /}
      {/* <Sidebar routeInfos={routeInfos} /> * /}
      {/* </div>
        </div> * /}
      {/* <Show when={currentRoute()} fallback={<div class=""><p>Use the button to the left to return to civilisation.</p></div>}> * /}}
      {/* <ErrorBoundary fallback={(error, reset) => ErrorComp({ error, reset, mainLabel: "Error in App" })}> * /}
      {/* <Dynamic component={currentRoute()?.component} /> * /}
      {/* </ErrorBoundary > * /}
      {/* </Show > * /}
      {/* <Loading visible={appStore.loading > 0} mainLabel={appStore.loadingMainLabel} secondLabel={appStore.loadingSecondLabel}></Loading> * /}
      {/* </div > * /}
      {/* </div > * /}
      */