import { Component } from "solid-js";

const NotFoundPage: Component = () => {

  return (
    <>
      <div>
        <p>On a pas trouvé cette page</p>
        <p>Vous cherchez peut-être</p>
        <ul>
          <li><a href='test'>test</a></li>
          <li><a href='home'>home</a></li>
          <li><a href='settings'>settings</a></li>
        </ul>
      </div>
    </>
  );
};

export default NotFoundPage;
