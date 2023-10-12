import { component$, $, useStore } from "@builder.io/qwik";
import styles from "./hero.module.css";
import ImgThunder from "~/media/thunder.png?jsx";
import axios from "axios";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

export default component$(() => {
  hljs.registerLanguage('json', json);
  const state = useStore({
    weburl: "",
    returnedData: "",
    searching: false,
    invalidUrl: false,
  });

  const handleInputChange = $((event: any, element: { value: string; }) => {
    state.weburl = element.value;
  });

  const $execute = $(() => {
    state.searching = true;
    axios.get(`http://127.0.0.1:3000/scrape?url=${state.weburl}`).then((response) => {
      state.returnedData = JSON.stringify(response.data.result, null, 4);
      state.searching = false;
    }).catch((error) => {
      state.invalidUrl = true;
      state.searching = false;
      setTimeout(() => {
        state.invalidUrl = false;
      }, 3000);
      console.log(error);
    });
  });

  return (
    <div class={["container", styles.hero]}>
      <ImgThunder class={styles["hero-image"]} />
      <h1>
        Basic <span class="highlight">Qwik</span>
        <br />
        app for <span class="highlight">API</span> testing
      </h1>
      <p>Insert down the link</p>
      <p class={styles["tip"]}>🤫 Psst! Here's the link:  <code>
        https://wsa-test.vercel.app/</code></p>
      <input
        type="text"
        name="weburl"
        id="weburl"
        value={state.weburl}
        onInput$={handleInputChange}
      />
      {state.searching == true ? <p style="margin:0;color:green">Scraping: {[state.weburl]} </p> : null}
      {state.invalidUrl == true ? <p style="margin:0;color:red">ERROR: An error occured. Check the input! </p> : null}
      <button
        type="button"
        class={["btn", styles.btnPrimary]}
        onClick$={$execute}
      >
        Scrape !
      </button>

      <p class="highlight">Results:</p>
      {state.returnedData && (
        <div class={styles.blackBox}>
          <pre>
          {state.returnedData}

          </pre>
        </div>
      )}
    </div>

  );
});