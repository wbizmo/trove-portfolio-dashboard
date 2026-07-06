import styles from "./TopBar.module.css";

type TopBarProps = {
  onMenuClick: () => void;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
      <path d="m16.2 16.2 4.1 4.1" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 9.8a6 6 0 0 0-12 0c0 7-3 7.4-3 8.8h18c0-1.4-3-.8-3-8.8Z" />
      <path d="M9.8 20.5a2.4 2.4 0 0 0 4.4 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z" />
      <path d="M4.8 20.2c1.2-3.6 3.8-5.4 7.2-5.4s6 1.8 7.2 5.4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menu} type="button" onClick={onMenuClick} aria-label="Open menu">
          <MenuIcon />
        </button>

        <label className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input type="search" placeholder="Search stocks, crypto..." />
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} type="button" aria-label="Notifications">
          <BellIcon />
        </button>
        <span className={styles.profileIcon}>
          <UserIcon />
        </span>
      </div>
    </header>
  );
}
