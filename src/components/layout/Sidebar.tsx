import { useAuth } from "../../context/useAuth";
import styles from "./Sidebar.module.css";

type NavItem = {
  label: string;
  icon: "dashboard" | "portfolio" | "transactions" | "markets" | "settings";
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Portfolio", icon: "portfolio" },
  { label: "Transactions", icon: "transactions" },
  { label: "Markets", icon: "markets" },
  { label: "Settings", icon: "settings" },
];

function NavIcon({ name }: { name: NavItem["icon"] }) {
  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h7v6H4z" />
        <path d="M13 5h7v4h-7z" />
        <path d="M13 11h7v8h-7z" />
        <path d="M4 13h7v6H4z" />
      </svg>
    );
  }

  if (name === "portfolio") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h14v11H5z" />
        <path d="M9 8V6h6v2" />
        <path d="M8 13h8" />
      </svg>
    );
  }

  if (name === "transactions") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7h10" />
        <path d="M14 4l3 3-3 3" />
        <path d="M17 17H7" />
        <path d="M10 14l-3 3 3 3" />
      </svg>
    );
  }

  if (name === "markets") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 17l5-5 4 4 7-8" />
        <path d="M15 8h5v5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M5.6 5.6l2.1 2.1" />
      <path d="M16.3 16.3l2.1 2.1" />
      <path d="M18.4 5.6l-2.1 2.1" />
      <path d="M7.7 16.3l-2.1 2.1" />
    </svg>
  );
}

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
  const { logout } = useAuth();
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
            key={item.label}
            className={`${styles.navItem} ${item.label === "Dashboard" ? styles.active : ""}`}
            type="button"
          >
            <span className={styles.icon}>
              <NavIcon name={item.icon} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <button
          className={styles.signOutButton}
          type="button"
          onClick={logout}
        >
          Sign out
        </button>

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
