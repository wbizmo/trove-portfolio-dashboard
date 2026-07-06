import styles from "./TopBar.module.css";

type TopBarProps = {
  onMenuClick: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menu} type="button" onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>

        <label className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>
          <input type="search" placeholder="Search stocks, crypto..." />
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} type="button" aria-label="Notifications">
          ◔
        </button>
        <span className={styles.profileIcon}>A</span>
      </div>
    </header>
  );
}
