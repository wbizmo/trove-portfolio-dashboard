import styles from "./Sidebar.module.css";

const navItems = ["Dashboard", "Portfolio", "Transactions", "Markets", "Settings"];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <p className={styles.logoText}>Trove</p>
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </button>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item}
            className={`${styles.navItem} ${item === "Dashboard" ? styles.active : ""}`}
            type="button"
          >
            <span className={styles.icon}>{item.slice(0, 1)}</span>
            {item}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.profile}>
          <span className={styles.avatar}>AO</span>
          <span>
            <span className={styles.name}>Adaeze Okonkwo</span>
            <span className={styles.role}>Premium Member</span>
          </span>
        </div>

        <button className={styles.addButton} type="button">
          Add Funds
        </button>
      </div>
    </aside>
  );
}
