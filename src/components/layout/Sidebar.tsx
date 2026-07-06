import styles from "./Sidebar.module.css";

const navItems = ["Dashboard", "Portfolio", "Transactions", "Markets", "Settings"];

type SidebarProps = {
  isOpen: boolean;
};

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <p className={styles.logoText}>Trove</p>

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
