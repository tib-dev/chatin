import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../Store/Slice/themeSlice";
import { THEMES } from "../../Constants";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme) || "light"; // Default to 'light'

  // Function to handle theme change
  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-300 rounded-box z-10 w-52 p-2 shadow-2xl"
      >
        {THEMES.map((t) => (
          <li key={t}>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-base-200 rounded">
              <input
                type="radio"
                name="theme-dropdown"
                className="hidden"
                value={t}
                checked={theme === t}
                onChange={() => handleThemeChange(t)}
              />
              <span className="text-sm">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeToggle;
