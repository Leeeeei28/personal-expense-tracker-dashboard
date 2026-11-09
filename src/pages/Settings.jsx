import { Moon, Sun, Palette, Wallet } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./Settings.css";

function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <h2>Settings</h2>
        <p>Manage your personal finance tracker preferences.</p>
      </div>

      <div className="settings-section">
        <div className="settings-section-heading">
          <Palette size={20} />
          <h3>Appearance</h3>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <h4>Theme</h4>
            <p>Choose your preferred dashboard appearance.</p>
          </div>

          <button
            className="theme-setting-button"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <>
                <Sun size={18} />
                Light Mode
              </>
            ) : (
              <>
                <Moon size={18} />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-heading">
          <Wallet size={20} />
          <h3>General Preferences</h3>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <h4>Currency</h4>
            <p>Your default currency for financial records.</p>
          </div>

          <span className="settings-value">PHP (₱)</span>
        </div>
      </div>
    </div>
  );
}

export default Settings;