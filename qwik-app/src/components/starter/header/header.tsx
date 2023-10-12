import { component$ } from "@builder.io/qwik";
import styles from "./header.module.css";

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <h3 class={styles.textlogo}>
            WebScrapingAPI - Mihai
          </h3>
        </div>
      </div>
    </header>
  );
});
